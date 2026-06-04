"""
EduDhruv WordPress XML → Supabase Import
==========================================
Use this if the REST API is blocked (Cloudflare protection).

Step 1: Download WP export XML
  WP Admin → Tools → Export → All Content → Download Export File
  Save as: migration/wordpress-export.xml

Step 2: Run this script:
  python3 automation/wp_xml_import.py

It will:
  - Parse the XML
  - Update src/lib/mock-data.ts  (see it instantly in localhost)
  - Save migration/wp_export.json (backup)
  - Import to Supabase if credentials are set
"""

import os
import re
import json
import time
import logging
import xml.etree.ElementTree as ET
from pathlib import Path
from datetime import datetime

try:
    import requests
    HAS_REQUESTS = True
except ImportError:
    HAS_REQUESTS = False

from dotenv import load_dotenv
load_dotenv(Path(__file__).parent / ".env")

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
log = logging.getLogger("wp_xml_import")

SUPABASE_URL      = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY      = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
XML_FILE          = Path(__file__).parent.parent / "migration" / "wordpress-export.xml"
EXPORT_FILE       = Path(__file__).parent.parent / "migration" / "wp_export.json"
MOCK_FILE         = Path(__file__).parent.parent / "src" / "lib" / "mock-data.ts"
Path(XML_FILE).parent.mkdir(exist_ok=True)

# WordPress XML namespaces
NS = {
    "wp":      "http://wordpress.org/export/1.2/",
    "content": "http://purl.org/rss/1.0/modules/content/",
    "excerpt": "http://wordpress.org/export/1.2/excerpt/",
    "dc":      "http://purl.org/dc/elements/1.1/",
}

CAT_REMAP = {
    "education-loan":         "education-loan",
    "indian-students-abroad": "indian-students-abroad",
    "scholarship":            "scholarship",
    "top-universities":       "top-universities",
    "student-accommodation":  "student-accommodation",
    "travel-essentials":      "travel-essentials",
    "latest":                 "latest",
    "news":                   "latest",
    "university":             "top-universities",
}


def text(el, tag: str, ns: str = "") -> str:
    ns_tag = f"{{{NS[ns]}}}{tag}" if ns else tag
    found = el.find(ns_tag)
    return (found.text or "").strip() if found is not None else ""


def parse_xml(xml_path: Path) -> list[dict]:
    log.info(f"Parsing: {xml_path}")
    tree = ET.parse(xml_path)
    root = tree.getroot()
    channel = root.find("channel")
    posts = []

    for item in channel.findall("item"):
        # Only published posts
        post_type   = text(item, "post_type", "wp")
        post_status = text(item, "status", "wp")
        if post_type != "post" or post_status != "publish":
            continue

        title   = text(item, "title")
        slug    = text(item, "post_name", "wp")
        date    = text(item, "post_date", "wp")   # "2025-03-15 10:00:00"
        content = text(item, "encoded", "content")
        excerpt = text(item, "encoded", "excerpt")
        wp_id   = text(item, "post_id", "wp")

        # Parse date to ISO
        try:
            dt = datetime.strptime(date, "%Y-%m-%d %H:%M:%S")
            iso_date = dt.isoformat() + "Z"
        except Exception:
            iso_date = datetime.utcnow().isoformat() + "Z"

        # Category
        cat_slug = "latest"
        for cat in item.findall("category"):
            domain = cat.get("domain", "")
            nicename = cat.get("nicename", "")
            if domain == "category" and nicename:
                mapped = CAT_REMAP.get(nicename, nicename)
                if mapped != "latest":
                    cat_slug = mapped
                    break
                cat_slug = mapped

        # Meta fields (Yoast SEO)
        meta_desc  = ""
        focus_kw   = ""
        og_image   = None
        for meta in item.findall("wp:postmeta", {"wp": NS["wp"]}):
            key = text(meta, "meta_key", "wp")
            val = text(meta, "meta_value", "wp")
            if key == "_yoast_wpseo_metadesc":
                meta_desc = val
            elif key == "_yoast_wpseo_focuskw":
                focus_kw = val
            elif key == "_thumbnail_id":
                pass  # We'll handle separately if needed

        # Clean content — remove WP block comments
        clean_content = re.sub(r"<!-- /?wp:[^>]*-->", "", content).strip()

        # Excerpt fallback from content
        if not excerpt.strip():
            plain = re.sub(r"<[^>]+>", "", clean_content)
            excerpt = " ".join(plain.split()[:50]) + "…"
        else:
            excerpt = re.sub(r"<[^>]+>", "", excerpt).strip()

        word_count   = len(re.sub(r"<[^>]+>", "", clean_content).split())
        reading_time = max(1, round(word_count / 200))

        posts.append({
            "title":                 title,
            "slug":                  slug,
            "content":               clean_content,
            "excerpt":               excerpt[:300],
            "category_slug":         cat_slug,
            "meta_title":            title[:70],
            "meta_description":      meta_desc[:160],
            "focus_keyword":         focus_kw[:100],
            "featured_image_url":    og_image,
            "featured_image_alt":    title,
            "featured_image_credit": None,
            "reading_time":          reading_time,
            "tags":                  [],
            "status":                "published",
            "created_at":            iso_date,
            "updated_at":            iso_date,
            "_wp_id":                wp_id,
        })

    log.info(f"Parsed {len(posts)} published posts")
    return posts


def save_backup(posts: list[dict]):
    data = {"exported_at": datetime.utcnow().isoformat(), "total": len(posts), "posts": posts}
    with open(EXPORT_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    log.info(f"✅ Backup saved → {EXPORT_FILE}")


def update_mock_data(posts: list[dict]):
    lines = ['import type { Post } from "./types";\n\nexport const MOCK_POSTS: Post[] = [\n']
    for p in posts[:100]:
        content_preview = (p["content"] or "")[:3000]
        lines.append("  {\n")
        lines.append(f'    id: {json.dumps(p["_wp_id"])},\n')
        lines.append(f'    title: {json.dumps(p["title"])},\n')
        lines.append(f'    slug: {json.dumps(p["slug"])},\n')
        lines.append(f'    excerpt: {json.dumps(p["excerpt"])},\n')
        lines.append(f'    content: {json.dumps(content_preview)},\n')
        lines.append(f'    category_slug: {json.dumps(p["category_slug"])},\n')
        lines.append(f'    meta_title: {json.dumps(p["meta_title"])},\n')
        lines.append(f'    meta_description: {json.dumps(p["meta_description"])},\n')
        lines.append(f'    focus_keyword: {json.dumps(p["focus_keyword"])},\n')
        lines.append(f'    featured_image_url: {json.dumps(p["featured_image_url"])},\n')
        lines.append(f'    featured_image_alt: {json.dumps(p["featured_image_alt"])},\n')
        lines.append(f'    featured_image_credit: null,\n')
        lines.append(f'    reading_time: {p["reading_time"]},\n')
        lines.append(f'    tags: [],\n')
        lines.append(f'    status: "published",\n')
        lines.append(f'    created_at: {json.dumps(p["created_at"])},\n')
        lines.append(f'    updated_at: {json.dumps(p["updated_at"])},\n')
        lines.append("  },\n")
    lines.append("];\n")
    with open(MOCK_FILE, "w", encoding="utf-8") as f:
        f.writelines(lines)
    log.info(f"✅ mock-data.ts updated → {min(len(posts), 100)} real posts in localhost")


def import_to_supabase(posts: list[dict]):
    if not SUPABASE_URL or not SUPABASE_KEY or "placeholder" in SUPABASE_URL:
        log.info("No Supabase credentials — skipping import (add to automation/.env)")
        return
    if not HAS_REQUESTS:
        log.warning("requests not installed — skipping Supabase import")
        return
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates",
    }
    clean = [{k: v for k, v in p.items() if not k.startswith("_")} for p in posts]
    imported = 0
    for i in range(0, len(clean), 20):
        batch = clean[i:i + 20]
        r = requests.post(f"{SUPABASE_URL}/rest/v1/posts", headers=headers, json=batch, timeout=30)
        if r.status_code in (200, 201):
            imported += len(batch)
            log.info(f"  Batch {i//20 + 1}: {imported}/{len(clean)} imported")
        else:
            log.error(f"  Batch failed ({r.status_code}): {r.text[:200]}")
        time.sleep(0.2)
    log.info(f"✅ Supabase import complete: {imported}/{len(clean)} posts")


def load_from_json(json_file: Path) -> list[dict]:
    """Load posts from a wp_export.json (from Colab or REST API export)."""
    with open(json_file, encoding="utf-8") as f:
        data = json.load(f)
    raw_posts = data.get("posts", data) if isinstance(data, dict) else data
    log.info(f"Loaded {len(raw_posts)} posts from JSON")
    converted = []
    for wp in raw_posts:
        # Already converted format
        if "category_slug" in wp:
            converted.append(wp)
            continue
        # Raw WP REST API format — convert it
        content = wp.get("content", {})
        content = content.get("rendered", content) if isinstance(content, dict) else content
        content = re.sub(r"<!--.*?-->", "", content, flags=re.DOTALL).strip()
        excerpt = wp.get("excerpt", {})
        excerpt = excerpt.get("rendered", excerpt) if isinstance(excerpt, dict) else excerpt
        excerpt = re.sub(r"<[^>]+>", "", excerpt).strip()
        title   = wp.get("title", {})
        title   = title.get("rendered", title) if isinstance(title, dict) else title
        yoast   = wp.get("yoast_head_json") or {}
        og_imgs = yoast.get("og_image", [])
        plain   = re.sub(r"<[^>]+>", "", content)
        rt      = max(1, round(len(plain.split()) / 200))
        converted.append({
            "title":                 title,
            "slug":                  wp.get("slug", ""),
            "content":               content,
            "excerpt":               excerpt[:300],
            "category_slug":         "latest",
            "meta_title":            (yoast.get("og_title") or title)[:70],
            "meta_description":      (yoast.get("og_description") or "")[:160],
            "focus_keyword":         "",
            "featured_image_url":    og_imgs[0]["url"] if og_imgs else None,
            "featured_image_alt":    title,
            "featured_image_credit": None,
            "reading_time":          rt,
            "tags":                  [],
            "status":                "published",
            "created_at":            wp.get("date", datetime.utcnow().isoformat()),
            "updated_at":            wp.get("modified", datetime.utcnow().isoformat()),
            "_wp_id":                wp.get("id"),
        })
    return converted


def main():
    log.info("═" * 55)
    log.info("EduDhruv WordPress Import")
    log.info("═" * 55)

    # Check for JSON export first (from Colab or REST API)
    json_file = Path(__file__).parent.parent / "migration" / "wp_export.json"
    if json_file.exists():
        log.info(f"Found JSON export: {json_file}")
        posts = load_from_json(json_file)
        if posts:
            save_backup(posts)
            update_mock_data(posts)
            import_to_supabase(posts)
            log.info("")
            log.info("✅ ALL DONE!")
            log.info("  → Restart `npm run dev` to see all real articles")
            return

    if not XML_FILE.exists():
        log.error(f"No import file found!")
        log.error("")
        log.error("Option A — WordPress XML export (recommended):")
        log.error("  1. Open on your phone: https://www.edudhruv.com/wp-admin/export.php")
        log.error("  2. Select: All content → Download Export File")
        log.error(f"  3. Save to: {XML_FILE}")
        log.error("")
        log.error("Option B — Google Colab JSON export:")
        log.error("  1. Run: python3 automation/colab_extract.py  (for instructions)")
        log.error(f"  2. Save wp_export.json to: {json_file}")
        log.error("")
        log.error("Option C — Mobile hotspot:")
        log.error("  1. Connect Mac to phone hotspot")
        log.error("  2. Run: python3 automation/wp_scrape.py")
        return

    posts = parse_xml(XML_FILE)
    if not posts:
        log.error("No posts found in XML — check the file")
        return

    save_backup(posts)
    update_mock_data(posts)
    import_to_supabase(posts)

    log.info("")
    log.info("✅ ALL DONE!")
    log.info("  → Restart `npm run dev` to see all real articles in localhost")
    log.info(f"  → Backup saved to: {EXPORT_FILE}")


if __name__ == "__main__":
    main()
