"""
EduDhruv WordPress → Supabase Migration Script
================================================
Run this ONCE from your local machine to:
  1. Pull ALL published posts from WordPress REST API
  2. Pull ALL categories
  3. Save backup JSON to migration/wp_export.json
  4. Import directly into Supabase

Usage:
  pip install python-dotenv requests
  python automation/wp_export.py

Your machine can reach edudhruv.com — Claude's servers cannot (Cloudflare blocks them).
"""

import os
import re
import json
import time
import logging
from pathlib import Path
from datetime import datetime

try:
    import requests
except ImportError:
    print("Run: pip install requests python-dotenv")
    raise

from dotenv import load_dotenv

load_dotenv(Path(__file__).parent / ".env")

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
log = logging.getLogger("wp_export")

WP_URL            = "https://www.edudhruv.com"
SUPABASE_URL      = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY      = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
EXPORT_FILE       = Path(__file__).parent.parent / "migration" / "wp_export.json"
EXPORT_FILE.parent.mkdir(exist_ok=True)

# ─── CATEGORY SLUG MAPPING ────────────────────────────────────────────────
# Maps WordPress category IDs → our slugs (will be auto-detected from WP)
WP_CAT_REMAP = {
    "education-loan":         "education-loan",
    "indian-students-abroad": "indian-students-abroad",
    "scholarship":            "scholarship",
    "top-universities":       "top-universities",
    "student-accommodation":  "student-accommodation",
    "travel-essentials":      "travel-essentials",
    "latest":                 "latest",
    "news":                   "latest",          # merge news → latest
    "university":             "top-universities", # merge → top-universities
}

# ─── FETCH FROM WORDPRESS REST API ────────────────────────────────────────

def fetch_wp_categories() -> dict[int, str]:
    """Returns {wp_id: slug}"""
    log.info("Fetching categories from WordPress...")
    r = requests.get(
        f"{WP_URL}/wp-json/wp/v2/categories",
        params={"per_page": 100},
        timeout=30,
    )
    r.raise_for_status()
    cats = r.json()
    mapping = {}
    for c in cats:
        slug = WP_CAT_REMAP.get(c["slug"], c["slug"])
        mapping[c["id"]] = slug
        log.info(f"  Category {c['id']}: {c['slug']} → {slug}")
    return mapping


def fetch_all_posts(cat_map: dict[int, str]) -> list[dict]:
    """Fetches ALL published posts page by page."""
    all_posts = []
    page = 1
    while True:
        log.info(f"Fetching posts page {page}...")
        r = requests.get(
            f"{WP_URL}/wp-json/wp/v2/posts",
            params={
                "per_page": 100,
                "page": page,
                "status": "publish",
                "_fields": "id,title,slug,content,excerpt,categories,tags,date,modified,yoast_head_json",
            },
            timeout=60,
        )
        if r.status_code == 400:
            break  # No more pages
        r.raise_for_status()
        posts = r.json()
        if not posts:
            break

        for p in posts:
            converted = convert_post(p, cat_map)
            all_posts.append(converted)
            log.info(f"  ✓ [{converted['category_slug']}] {converted['title'][:60]}")

        total_pages = int(r.headers.get("X-WP-TotalPages", 1))
        if page >= total_pages:
            break
        page += 1
        time.sleep(0.5)  # Be polite to the server

    log.info(f"Total posts fetched: {len(all_posts)}")
    return all_posts


def convert_post(wp: dict, cat_map: dict[int, str]) -> dict:
    """Convert a WordPress post object to our Supabase schema."""
    # Category slug
    cat_ids = wp.get("categories", [])
    category_slug = "latest"
    for cid in cat_ids:
        if cid in cat_map:
            slug = cat_map[cid]
            if slug != "latest":  # prefer a real category over 'latest'
                category_slug = slug
                break
    if category_slug == "latest" and cat_ids and cat_ids[0] in cat_map:
        category_slug = cat_map[cat_ids[0]]

    # Yoast SEO data
    yoast = wp.get("yoast_head_json") or {}
    meta_desc   = yoast.get("og_description") or yoast.get("description", "")
    meta_title  = yoast.get("og_title") or wp["title"]["rendered"]
    focus_kw    = yoast.get("schema", {}).get("@graph", [{}])[0].get("name", "")

    # Content — strip WP block comments, keep HTML
    content = wp["content"]["rendered"]
    content = re.sub(r"<!-- /?wp:[^>]* -->", "", content)
    content = content.strip()

    # Excerpt
    excerpt_raw = wp["excerpt"]["rendered"]
    excerpt = re.sub(r"<[^>]+>", "", excerpt_raw).strip()

    # Estimate reading time (avg 200 wpm)
    word_count = len(re.sub(r"<[^>]+>", "", content).split())
    reading_time = max(1, round(word_count / 200))

    # Featured image — try yoast og_image
    og_images = yoast.get("og_image", [])
    featured_url = og_images[0]["url"] if og_images else None

    return {
        "title":                 wp["title"]["rendered"],
        "slug":                  wp["slug"],
        "content":               content,
        "excerpt":               excerpt[:300] if excerpt else "",
        "category_slug":         category_slug,
        "meta_title":            meta_title[:70] if meta_title else "",
        "meta_description":      meta_desc[:160] if meta_desc else "",
        "focus_keyword":         focus_kw[:100] if focus_kw else "",
        "featured_image_url":    featured_url,
        "featured_image_alt":    wp["title"]["rendered"],
        "featured_image_credit": None,
        "reading_time":          reading_time,
        "tags":                  [],
        "status":                "published",
        "created_at":            wp["date"],
        "updated_at":            wp["modified"],
        "_wp_id":                wp["id"],  # keep for reference, not saved to Supabase
    }

# ─── SAVE BACKUP ──────────────────────────────────────────────────────────

def save_backup(posts: list[dict]):
    backup = {
        "exported_at": datetime.utcnow().isoformat(),
        "total": len(posts),
        "posts": posts,
    }
    with open(EXPORT_FILE, "w") as f:
        json.dump(backup, f, indent=2, ensure_ascii=False)
    log.info(f"✅ Backup saved → {EXPORT_FILE}")


# ─── IMPORT TO SUPABASE ───────────────────────────────────────────────────

def import_to_supabase(posts: list[dict]):
    if not SUPABASE_URL or not SUPABASE_KEY:
        log.warning("No Supabase credentials — skipping import. Run again after setting .env")
        return

    log.info(f"Importing {len(posts)} posts to Supabase...")
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates",  # upsert by slug
    }

    # Remove internal fields before inserting
    clean = [{k: v for k, v in p.items() if not k.startswith("_")} for p in posts]

    # Batch insert in groups of 20
    batch_size = 20
    imported = 0
    for i in range(0, len(clean), batch_size):
        batch = clean[i : i + batch_size]
        r = requests.post(
            f"{SUPABASE_URL}/rest/v1/posts",
            headers=headers,
            json=batch,
            timeout=30,
        )
        if r.status_code in (200, 201):
            imported += len(batch)
            log.info(f"  Imported batch {i//batch_size + 1} ({imported}/{len(clean)})")
        else:
            log.error(f"  Batch failed ({r.status_code}): {r.text[:200]}")
        time.sleep(0.3)

    log.info(f"✅ Import complete: {imported}/{len(clean)} posts in Supabase")


# ─── UPDATE LOCAL MOCK DATA ───────────────────────────────────────────────

def update_mock_data(posts: list[dict]):
    """Write fetched posts into src/lib/mock-data.ts so localhost shows real content."""
    mock_file = Path(__file__).parent.parent / "src" / "lib" / "mock-data.ts"

    lines = ['import type { Post } from "./types";\n\n']
    lines.append("export const MOCK_POSTS: Post[] = [\n")

    for p in posts[:60]:  # cap at 60 for mock
        safe = lambda s: (s or "").replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${")
        # Truncate content for mock (full content loads from Supabase in prod)
        content_preview = (p["content"] or "")[:2000] + ("..." if len(p["content"] or "") > 2000 else "")
        lines.append("  {\n")
        lines.append(f'    id: "{p["_wp_id"]}",\n')
        lines.append(f'    title: {json.dumps(p["title"])},\n')
        lines.append(f'    slug: {json.dumps(p["slug"])},\n')
        lines.append(f'    excerpt: {json.dumps(p["excerpt"][:200] if p["excerpt"] else "")},\n')
        lines.append(f'    content: {json.dumps(content_preview)},\n')
        lines.append(f'    category_slug: {json.dumps(p["category_slug"])},\n')
        lines.append(f'    meta_title: {json.dumps(p["meta_title"] or "")},\n')
        lines.append(f'    meta_description: {json.dumps(p["meta_description"] or "")},\n')
        lines.append(f'    focus_keyword: {json.dumps(p["focus_keyword"] or "")},\n')
        lines.append(f'    featured_image_url: {json.dumps(p["featured_image_url"])},\n')
        lines.append(f'    featured_image_alt: {json.dumps(p["featured_image_alt"] or "")},\n')
        lines.append(f'    featured_image_credit: null,\n')
        lines.append(f'    reading_time: {p["reading_time"]},\n')
        lines.append(f'    tags: [],\n')
        lines.append(f'    status: "published",\n')
        lines.append(f'    created_at: {json.dumps(p["created_at"])},\n')
        lines.append(f'    updated_at: {json.dumps(p["updated_at"])},\n')
        lines.append("  },\n")

    lines.append("];\n")

    with open(mock_file, "w", encoding="utf-8") as f:
        f.writelines(lines)

    log.info(f"✅ mock-data.ts updated with {min(len(posts), 60)} real posts")
    log.info("   Restart `npm run dev` to see real articles in localhost")


# ─── MAIN ─────────────────────────────────────────────────────────────────

def main():
    log.info("═" * 55)
    log.info("EduDhruv WordPress → Supabase Migration")
    log.info("═" * 55)

    # 1. Fetch categories
    cat_map = fetch_wp_categories()

    # 2. Fetch all posts
    posts = fetch_all_posts(cat_map)

    if not posts:
        log.error("No posts fetched — is edudhruv.com accessible from this machine?")
        return

    # 3. Save JSON backup (ALWAYS — even if Supabase import fails)
    save_backup(posts)

    # 4. Update local mock-data.ts so localhost shows real content immediately
    update_mock_data(posts)

    # 5. Import to Supabase (only if credentials are set)
    import_to_supabase(posts)

    log.info("")
    log.info("NEXT STEPS:")
    log.info("  1. Restart: npm run dev  (to see real articles in localhost)")
    log.info(f"  2. Backup is at: {EXPORT_FILE}")
    log.info("  3. Once Supabase is set up, run this script again with credentials")
    log.info("     and all posts will import automatically.")


if __name__ == "__main__":
    main()
