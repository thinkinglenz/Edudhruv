"""
Move all 'latest' category posts to draft status.
This is part of the AdSense recovery strategy — reduce the volume of
thin/news-style AI content so the site looks more focused and authoritative.

Why this works:
  - 152 'latest' posts → vanish from public site
  - Site goes from 326 → ~174 quality posts in 6 specific categories
  - Each remaining category has 14-48 substantive posts
  - AdSense crawler now sees focused, expert content (not news spam)
  - Topic relevance score goes way up

You can always restore them later by changing status back to 'published'.
"""

import os, sys, json
from pathlib import Path
import urllib.request

try:
    from dotenv import load_dotenv
    load_dotenv(Path(__file__).parent.parent / ".env.local")
except ImportError:
    pass

URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL") or os.getenv("SUPABASE_URL", "")
KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
if not URL or not KEY or "placeholder" in URL:
    print("❌ Set NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in .env.local"); sys.exit(1)

DRY_RUN = "--dry-run" in sys.argv


def patch(table: str, where: str, body: dict) -> int:
    """PATCH rows where condition matches. Returns count."""
    url = f"{URL}/rest/v1/{table}?{where}"
    req = urllib.request.Request(url, method="PATCH",
        data=json.dumps(body).encode(),
        headers={
            "apikey": KEY, "Authorization": f"Bearer {KEY}",
            "Content-Type": "application/json",
            "Prefer": "return=representation",
        })
    with urllib.request.urlopen(req, timeout=30) as res:
        return len(json.loads(res.read()))


def count(where: str) -> int:
    url = f"{URL}/rest/v1/posts?{where}&select=count"
    req = urllib.request.Request(url, headers={
        "apikey": KEY, "Authorization": f"Bearer {KEY}",
        "Prefer": "count=exact",
    })
    with urllib.request.urlopen(req, timeout=30) as res:
        cr = res.headers.get("Content-Range", "0")
        return int(cr.split("/")[-1])


print("═" * 60)
print("AdSense Recovery — Hide 'latest' category posts")
print("═" * 60)
print(f"Mode: {'DRY RUN' if DRY_RUN else 'LIVE'}\n")

published = count("category_slug=eq.latest&status=eq.published")
drafts    = count("category_slug=eq.latest&status=eq.draft")
print(f"Current 'latest' category:")
print(f"  Published: {published}")
print(f"  Drafts:    {drafts}")
print()

if published == 0:
    print("✓ Nothing to do — no published 'latest' posts."); sys.exit(0)

if DRY_RUN:
    print(f"[DRY RUN] Would move {published} posts from published → draft")
else:
    moved = patch("posts",
        "category_slug=eq.latest&status=eq.published",
        {"status": "draft"})
    print(f"✓ Moved {moved} posts from published → draft")
    print()

    # Verify
    print("After:")
    print(f"  Published 'latest': {count('category_slug=eq.latest&status=eq.published')}")
    print(f"  Draft 'latest':     {count('category_slug=eq.latest&status=eq.draft')}")
    print(f"  TOTAL published:    {count('status=eq.published')}")

print()
print("Next steps:")
print("  1. Visit /admin/posts → filter Status=Draft → see the moved posts")
print("  2. Trigger /api/revalidate to refresh homepage cache")
print("  3. Wait 1-2 weeks for Google to recrawl + de-index")
print("  4. Request AdSense review")
print()
print("To restore later (if you ever want to):")
print("  Manually publish individual ones from /admin/posts (Edit → Publish)")
