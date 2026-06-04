"""Extract static WordPress pages (About, Contact, Privacy, T&C, Loan Portal) from backup SQL."""
import re, json, sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))
from extract_from_backup import parse_sql_inserts, unescape, PREFIX

BASE     = Path(__file__).parent.parent
SQL_FILE = BASE / "migration" / "wp-backup" / "backup" / "edudhruv_wp382.sql"
OUT_JSON = BASE / "migration" / "wp_pages.json"

sql = SQL_FILE.read_text(encoding="utf-8", errors="replace")
post_rows = parse_sql_inserts(sql, "posts")

pages = []
for r in post_rows:
    if len(r) < 21:
        continue
    post_type = unescape(r[20]).strip()
    status    = unescape(r[7]).strip()
    if post_type != "page":
        continue
    slug    = unescape(r[11])
    title   = unescape(r[5])
    content = unescape(r[4])
    content = re.sub(r"<!-- /?wp:[^>]*-->", "", content, flags=re.DOTALL).strip()
    content = re.sub(r'href=["\']https?://(?:www\.)?edudhruv\.com(/[^"\']*)["\']', r'href="\1"', content)
    content = re.sub(r'(src|srcset)=["\']https?://(?:www\.)?edudhruv\.com(/wp-content/uploads/[^"\']*)["\']', r'\1="\2"', content)
    pages.append({"slug": slug, "title": title, "content": content, "status": status})

print(f"Found {len(pages)} pages:")
for p in pages:
    print(f"  [{p['status']:10}] /{p['slug']:40} — {p['title']}")

with open(OUT_JSON, "w", encoding="utf-8") as f:
    json.dump(pages, f, indent=2, ensure_ascii=False)
print(f"\nSaved → {OUT_JSON}")
