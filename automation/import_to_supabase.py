"""
Import migrated WordPress data → Supabase

Reads:  migration/wp_export.json
Writes: Supabase `posts` table

Run AFTER you've:
  1. Created Supabase project
  2. Run schema.sql + schema-social.sql in SQL Editor
  3. Added env vars to .env.local

Usage:
  python3 automation/import_to_supabase.py
  python3 automation/import_to_supabase.py --dry-run  (preview only)
"""

import os, sys, json, time
from pathlib import Path

try:
    import requests
except ImportError:
    os.system("pip3 install requests -q"); import requests

try:
    from dotenv import load_dotenv
    load_dotenv(Path(__file__).parent.parent / ".env.local")
    load_dotenv(Path(__file__).parent / ".env")
except ImportError:
    pass

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL") or os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or "placeholder" in (SUPABASE_URL or ""):
    print("❌ NEXT_PUBLIC_SUPABASE_URL not set in .env.local"); sys.exit(1)
if not SUPABASE_KEY or SUPABASE_KEY == "placeholder":
    print("❌ SUPABASE_SERVICE_ROLE_KEY not set in .env.local"); sys.exit(1)

DRY_RUN = "--dry-run" in sys.argv

EXPORT_FILE = Path(__file__).parent.parent / "migration" / "wp_export.json"
PAGES_FILE  = Path(__file__).parent.parent / "migration" / "wp_pages.json"
LEADS_FILE  = Path(__file__).parent.parent / "migration" / "leads_export.json"

HEADERS = {
    "apikey":        SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type":  "application/json",
    "Prefer":        "resolution=merge-duplicates",
}


def import_table(table: str, rows: list, batch_size: int = 25) -> int:
    """Upsert rows into a Supabase table in batches."""
    if not rows:
        print(f"  ⚠️  No rows to import for {table}"); return 0
    if DRY_RUN:
        print(f"  [DRY-RUN] Would import {len(rows)} rows into {table}"); return len(rows)

    url = f"{SUPABASE_URL}/rest/v1/{table}"
    imported = 0
    for i in range(0, len(rows), batch_size):
        batch = rows[i:i + batch_size]
        try:
            r = requests.post(url, headers=HEADERS, json=batch, timeout=30)
            if r.status_code in (200, 201):
                imported += len(batch)
                print(f"  ✓ Batch {(i//batch_size) + 1}: {imported}/{len(rows)} imported")
            else:
                print(f"  ❌ Batch failed ({r.status_code}): {r.text[:300]}")
                if r.status_code in (401, 403):
                    print("  → Check your SUPABASE_SERVICE_ROLE_KEY"); sys.exit(1)
                if r.status_code == 404:
                    print(f"  → Table `{table}` doesn't exist. Run schema.sql in SQL Editor first."); sys.exit(1)
        except Exception as e:
            print(f"  ❌ Network error: {e}")
        time.sleep(0.2)
    return imported


def main():
    print("=" * 60)
    print("EduDhruv → Supabase Importer")
    print(f"Target: {SUPABASE_URL}")
    print(f"Mode:   {'DRY RUN (no writes)' if DRY_RUN else 'LIVE'}")
    print("=" * 60)

    # ── 1. Posts ─────────────────────────────────────────────────────
    if EXPORT_FILE.exists():
        print(f"\n📰 Importing posts from {EXPORT_FILE.name}...")
        data = json.loads(EXPORT_FILE.read_text(encoding="utf-8"))
        raw_posts = data.get("posts", data) if isinstance(data, dict) else data

        # Strip internal fields
        posts = []
        for p in raw_posts:
            clean = {k: v for k, v in p.items() if not k.startswith("_")}
            posts.append(clean)

        n = import_table("posts", posts)
        print(f"  Total: {n} posts imported")
    else:
        print(f"⚠️  {EXPORT_FILE} not found — skipping posts")

    # ── 2. Leads ─────────────────────────────────────────────────────
    if LEADS_FILE.exists():
        print(f"\n👥 Importing leads from {LEADS_FILE.name}...")
        leads_raw = json.loads(LEADS_FILE.read_text(encoding="utf-8"))
        leads = []
        for l in leads_raw:
            if not l.get("name") and not l.get("email"):
                continue
            leads.append({
                "name":   l.get("name", "Unknown"),
                "email":  l.get("email", ""),
                "phone":  l.get("phone", ""),
                "status": "new",
            })
        n = import_table("leads", leads)
        print(f"  Total: {n} leads imported")
    else:
        print("ℹ️  No leads_export.json — skipping leads")

    # ── 3. Verification ──────────────────────────────────────────────
    if not DRY_RUN:
        print("\n🔍 Verifying...")
        for table in ["posts", "leads"]:
            try:
                r = requests.get(
                    f"{SUPABASE_URL}/rest/v1/{table}?select=count",
                    headers={**HEADERS, "Prefer": "count=exact"},
                    timeout=15,
                )
                count = r.headers.get("Content-Range", "0").split("/")[-1]
                print(f"  ✅ {table}: {count} rows in Supabase")
            except Exception as e:
                print(f"  ⚠️  Could not verify {table}: {e}")

    print("\n" + "=" * 60)
    print("✅ Import complete!" if not DRY_RUN else "✅ Dry run complete!")
    print("=" * 60)
    if not DRY_RUN:
        print("\nNext steps:")
        print("  1. Check posts in Supabase → Table Editor → posts")
        print("  2. Visit your Vercel site → real Supabase data should now load")
        print("  3. Test the lead form on https://edudhruv.vercel.app/")


if __name__ == "__main__":
    main()
