"""
EduDhruv: Extract from Full WordPress Backup
==============================================
Reads the SQL dump + uploads directory from the backup archive.
Extracts: posts, categories, Yoast SEO meta, featured images, leads.
Copies images to public/ and rewrites URLs for the new site.

This is the gold standard migration — no API calls, no Cloudflare, everything offline.
"""

import os, re, json, shutil, logging
from pathlib import Path
from datetime import datetime

logging.basicConfig(level=logging.INFO, format="%(asctime)s  %(message)s", datefmt="%H:%M:%S")
log = logging.getLogger()

# ── PATHS ───────────────────────────────────────────────────────────────────
BASE        = Path(__file__).parent.parent
BACKUP_DIR  = BASE / "migration" / "wp-backup"
SQL_FILE    = BACKUP_DIR / "backup" / "edudhruv_wp382.sql"
UPLOADS_SRC = BACKUP_DIR / "domains" / "edudhruv.com" / "public_html" / "wp-content" / "uploads"
IMG_DEST    = BASE / "public" / "wp-content" / "uploads"   # serve from /wp-content/uploads/ — same path!
OUT_JSON    = BASE / "migration" / "wp_export.json"
OUT_TS      = BASE / "src" / "lib" / "mock-data.ts"
OUT_LEADS   = BASE / "migration" / "leads_export.json"

PREFIX = "wpgp_"   # table prefix from the dump

CAT_MAP = {
    "education-loan":        "education-loan",
    "indian-students-abroad":"indian-students-abroad",
    "scholarship":           "scholarship",
    "top-universities":      "top-universities",
    "student-accommodation": "student-accommodation",
    "travel-essentials":     "travel-essentials",
    "latest":                "latest",
    "news":                  "latest",
    "university":            "top-universities",
    "uncategorized":         "latest",
}

# ── SQL PARSER ──────────────────────────────────────────────────────────────
def parse_sql_inserts(sql_text: str, table_name: str) -> list[list[str]]:
    """Extract all INSERT rows for a given table from the SQL dump."""
    pattern = re.compile(
        rf"INSERT INTO `{PREFIX}{table_name}`\s+(?:\([^)]+\)\s+)?VALUES\s+(.+?);\s*$",
        re.MULTILINE | re.DOTALL
    )
    rows = []
    for match in pattern.finditer(sql_text):
        values_str = match.group(1)
        # Split into individual row tuples
        depth = 0
        current = ""
        in_string = False
        escape = False
        for ch in values_str:
            if escape:
                current += ch
                escape = False
                continue
            if ch == '\\':
                current += ch
                escape = True
                continue
            if ch == "'" and not escape:
                in_string = not in_string
                current += ch
                continue
            if not in_string:
                if ch == '(':
                    depth += 1
                    if depth == 1:
                        current = ""
                        continue
                elif ch == ')':
                    depth -= 1
                    if depth == 0:
                        rows.append(parse_row(current))
                        current = ""
                        continue
            current += ch
    return rows


def parse_row(row_str: str) -> list[str]:
    """Parse a single SQL VALUES row tuple into a list of strings."""
    values = []
    current = ""
    in_string = False
    escape = False
    for ch in row_str:
        if escape:
            current += ch
            escape = False
            continue
        if ch == '\\':
            escape = True
            current += ch
            continue
        if ch == "'" and not escape:
            in_string = not in_string
            continue   # skip the quotes
        if ch == ',' and not in_string:
            values.append(current.strip())
            current = ""
            continue
        current += ch
    values.append(current.strip())
    return values


def unescape(s: str) -> str:
    """Unescape SQL string values."""
    return s.replace("\\'", "'").replace('\\"', '"').replace("\\n", "\n").replace("\\r", "").replace("\\\\", "\\")


# ── MAIN EXTRACTION ──────────────────────────────────────────────────────────
def main():
    log.info("=" * 60)
    log.info("EduDhruv: Extract from WordPress Backup")
    log.info("=" * 60)

    if not SQL_FILE.exists():
        log.error(f"SQL dump not found: {SQL_FILE}")
        return

    log.info(f"Reading SQL dump ({SQL_FILE.stat().st_size // 1024 // 1024}MB)...")
    sql = SQL_FILE.read_text(encoding="utf-8", errors="replace")

    # ── 1. Extract categories ────────────────────────────────────────────
    log.info("Extracting categories...")
    term_rows = parse_sql_inserts(sql, "terms")
    taxonomy_rows = parse_sql_inserts(sql, "term_taxonomy")

    # terms: term_id, name, slug, term_group
    terms = {}
    for r in term_rows:
        if len(r) >= 3:
            tid  = r[0].strip()
            name = unescape(r[1])
            slug = unescape(r[2])
            terms[tid] = {"name": name, "slug": slug}

    # term_taxonomy: term_taxonomy_id, term_id, taxonomy, description, parent, count
    cat_ids = {}  # term_id → our_slug
    for r in taxonomy_rows:
        if len(r) >= 3 and r[2].strip().strip("'") == "category":
            tid = r[1].strip()
            if tid in terms:
                wp_slug = terms[tid]["slug"]
                our_slug = CAT_MAP.get(wp_slug, wp_slug)
                cat_ids[tid] = our_slug

    log.info(f"  Found {len(cat_ids)} categories: {list(cat_ids.values())}")

    # ── 2. Extract term_relationships (post → category mapping) ──────────
    log.info("Extracting post-category relationships...")
    rel_rows = parse_sql_inserts(sql, "term_relationships")
    # object_id, term_taxonomy_id, term_order
    post_cats = {}   # post_id → [term_ids]
    for r in rel_rows:
        if len(r) >= 2:
            post_cats.setdefault(r[0].strip(), []).append(r[1].strip())

    # ── 3. Extract postmeta (Yoast SEO) ─────────────────────────────────
    log.info("Extracting Yoast SEO meta...")
    meta_rows = parse_sql_inserts(sql, "postmeta")
    # meta_id, post_id, meta_key, meta_value
    postmeta = {}  # post_id → {key: value}
    yoast_keys = {"_yoast_wpseo_focuskw", "_yoast_wpseo_metadesc", "_yoast_wpseo_title", "_thumbnail_id"}
    for r in meta_rows:
        if len(r) >= 4:
            pid = r[1].strip()
            key = unescape(r[2].strip())
            val = unescape(r[3].strip())
            if key in yoast_keys:
                postmeta.setdefault(pid, {})[key] = val

    log.info(f"  Yoast meta for {len(postmeta)} posts")

    # ── 4. Extract posts ─────────────────────────────────────────────────
    log.info("Extracting published posts...")
    post_rows = parse_sql_inserts(sql, "posts")
    # wp_posts columns: ID, post_author, post_date, post_date_gmt, post_content,
    #   post_title, post_excerpt, post_status, comment_status, ping_status,
    #   post_password, post_name(slug), to_ping, pinged, post_modified,
    #   post_modified_gmt, post_content_filtered, post_parent, guid,
    #   menu_order, post_type, post_mime_type, comment_count

    # Build attachment map: ID → URL (for featured images)
    attachments = {}
    posts = []

    for r in post_rows:
        if len(r) < 21:
            continue
        pid         = r[0].strip()
        post_date   = unescape(r[2])
        content     = unescape(r[4])
        title       = unescape(r[5])
        excerpt     = unescape(r[6])
        status      = unescape(r[7])
        slug        = unescape(r[11])
        modified    = unescape(r[14])
        guid        = unescape(r[18])
        post_type   = unescape(r[20])

        if post_type == "attachment":
            attachments[pid] = guid
            continue

        if post_type != "post" or status != "publish":
            continue

        # Category
        cat_slug = "latest"
        for tid in post_cats.get(pid, []):
            if tid in cat_ids and cat_ids[tid] != "latest":
                cat_slug = cat_ids[tid]
                break
        if cat_slug == "latest":
            for tid in post_cats.get(pid, []):
                if tid in cat_ids:
                    cat_slug = cat_ids[tid]
                    break

        # Yoast meta
        meta = postmeta.get(pid, {})
        meta_title    = meta.get("_yoast_wpseo_title", title)[:70]
        meta_desc     = meta.get("_yoast_wpseo_metadesc", "")[:160]
        focus_kw      = meta.get("_yoast_wpseo_focuskw", "")[:100]
        thumbnail_id  = meta.get("_thumbnail_id", "")

        # Featured image URL
        featured_url = attachments.get(thumbnail_id)

        # Clean content
        content = re.sub(r"<!-- /?wp:[^>]*-->", "", content, flags=re.DOTALL).strip()

        # Fix internal links to relative
        content = re.sub(
            r'href=["\']https?://(?:www\.)?edudhruv\.com(/[^"\']*)["\']',
            r'href="\1"', content
        )

        # Rewrite image URLs to use /wp-content/uploads/ path (will serve from public/)
        content = re.sub(
            r'(src|srcset)=["\']https?://(?:www\.)?edudhruv\.com(/wp-content/uploads/[^"\']*)["\']',
            r'\1="\2"', content
        )

        # Excerpt fallback
        if not excerpt:
            plain = re.sub(r"<[^>]+>", "", content)
            excerpt = " ".join(plain.split()[:50]) + "…"
        else:
            excerpt = re.sub(r"<[^>]+>", "", excerpt).strip()

        # Reading time
        plain = re.sub(r"<[^>]+>", "", content)
        rt = max(1, round(len(plain.split()) / 200))

        # Fix featured image URL
        if featured_url:
            featured_url = re.sub(
                r'https?://(?:www\.)?edudhruv\.com(/wp-content/uploads/.*)',
                r'\1', featured_url
            )

        # ISO dates
        try:
            created = datetime.strptime(post_date, "%Y-%m-%d %H:%M:%S").isoformat() + "Z"
        except:
            created = datetime.utcnow().isoformat() + "Z"
        try:
            updated = datetime.strptime(modified, "%Y-%m-%d %H:%M:%S").isoformat() + "Z"
        except:
            updated = created

        posts.append({
            "title":                title,
            "slug":                 slug,
            "content":              content,
            "excerpt":              excerpt[:300],
            "category_slug":        cat_slug,
            "meta_title":           meta_title,
            "meta_description":     meta_desc,
            "focus_keyword":        focus_kw,
            "featured_image_url":   featured_url,
            "featured_image_alt":   title,
            "featured_image_credit": None,
            "reading_time":         rt,
            "tags":                 [focus_kw] if focus_kw else [],
            "status":               "published",
            "created_at":           created,
            "updated_at":           updated,
            "_wp_id":               pid,
        })

    log.info(f"  ✅ {len(posts)} published posts extracted")

    # Sort by date (newest first)
    posts.sort(key=lambda p: p["created_at"], reverse=True)

    # ── 5. Copy images to public/ ────────────────────────────────────────
    log.info("Copying images to public/wp-content/uploads/...")
    if UPLOADS_SRC.exists():
        if IMG_DEST.exists():
            shutil.rmtree(IMG_DEST)
        shutil.copytree(UPLOADS_SRC, IMG_DEST)
        img_count = sum(1 for _ in IMG_DEST.rglob("*") if _.is_file())
        log.info(f"  ✅ {img_count} files copied to {IMG_DEST}")
    else:
        log.warning(f"  Uploads dir not found: {UPLOADS_SRC}")

    # ── 6. Extract leads ─────────────────────────────────────────────────
    log.info("Extracting student leads...")
    leads_rows = parse_sql_inserts(sql, "edudhruv_leads")
    leads = []
    for r in leads_rows:
        if len(r) >= 5:
            leads.append({
                "id":   r[0].strip(),
                "name": unescape(r[1]) if len(r) > 1 else "",
                "email": unescape(r[2]) if len(r) > 2 else "",
                "phone": unescape(r[3]) if len(r) > 3 else "",
                "raw":  [unescape(x) for x in r],
            })
    if leads:
        with open(OUT_LEADS, "w", encoding="utf-8") as f:
            json.dump(leads, f, indent=2, ensure_ascii=False)
        log.info(f"  ✅ {len(leads)} leads → {OUT_LEADS}")
    else:
        log.info("  No leads found in dump (table might use different structure)")

    # ── 7. Summary ───────────────────────────────────────────────────────
    cats = {}
    with_meta  = sum(1 for p in posts if p["meta_description"])
    with_img   = sum(1 for p in posts if p["featured_image_url"])
    with_kw    = sum(1 for p in posts if p["focus_keyword"])
    for p in posts:
        cats[p["category_slug"]] = cats.get(p["category_slug"], 0) + 1

    log.info("")
    log.info("=" * 60)
    log.info(f"EXTRACTION COMPLETE — {len(posts)} posts")
    log.info(f"  Meta descriptions:   {with_meta}/{len(posts)}")
    log.info(f"  Featured images:     {with_img}/{len(posts)}")
    log.info(f"  Focus keywords:      {with_kw}/{len(posts)}")
    log.info(f"  Categories:          {json.dumps(cats)}")
    log.info(f"  Leads:               {len(leads)}")
    log.info(f"  Images:              {sum(1 for _ in IMG_DEST.rglob('*') if _.is_file()) if IMG_DEST.exists() else 0}")
    log.info("=" * 60)

    # ── 8. Save JSON backup ──────────────────────────────────────────────
    backup_data = {
        "exported_at": datetime.utcnow().isoformat(),
        "source": "wordpress-backup-sql",
        "total": len(posts),
        "posts": posts,
    }
    with open(OUT_JSON, "w", encoding="utf-8") as f:
        json.dump(backup_data, f, indent=2, ensure_ascii=False)
    log.info(f"✅ JSON backup → {OUT_JSON}")

    # ── 9. Write mock-data.ts ────────────────────────────────────────────
    lines = ['import type { Post } from "./types";\n\nexport const MOCK_POSTS: Post[] = [\n']
    for p in posts[:100]:
        content_preview = (p["content"] or "")[:5000]
        lines += [
            "  {\n",
            f'    id: {json.dumps(str(p.get("_wp_id", p["slug"])))},\n',
            f'    title: {json.dumps(p["title"])},\n',
            f'    slug: {json.dumps(p["slug"])},\n',
            f'    excerpt: {json.dumps(p["excerpt"])},\n',
            f'    content: {json.dumps(content_preview)},\n',
            f'    category_slug: {json.dumps(p["category_slug"])},\n',
            f'    meta_title: {json.dumps(p["meta_title"])},\n',
            f'    meta_description: {json.dumps(p["meta_description"])},\n',
            f'    focus_keyword: {json.dumps(p["focus_keyword"])},\n',
            f'    featured_image_url: {json.dumps(p["featured_image_url"])},\n',
            f'    featured_image_alt: {json.dumps(p["featured_image_alt"])},\n',
            f'    featured_image_credit: null,\n',
            f'    reading_time: {p["reading_time"]},\n',
            f'    tags: {json.dumps(p["tags"])},\n',
            f'    status: "published",\n',
            f'    created_at: {json.dumps(p["created_at"])},\n',
            f'    updated_at: {json.dumps(p["updated_at"])},\n',
            "  },\n",
        ]
    lines.append("];\n")
    with open(OUT_TS, "w", encoding="utf-8") as f:
        f.writelines(lines)
    log.info(f"✅ mock-data.ts → {min(len(posts), 100)} posts for localhost")

    log.info("")
    log.info("NEXT STEPS:")
    log.info("  1. Restart: npm run dev")
    log.info("  2. Open:    http://localhost:3004")
    log.info("  3. All real posts + images should appear!")
    log.info("  4. Images served from /wp-content/uploads/ (same path = no broken URLs)")


if __name__ == "__main__":
    main()
