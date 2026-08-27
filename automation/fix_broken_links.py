"""
One-time cleanup: unwrap invented/broken internal links in EXISTING published
posts (the ongoing agent fix only affects NEW posts). Uses the same
sanitize_links() the agent now applies. Safe: only rewrites posts that
actually contain broken links; keeps all valid internal + external links.
"""
import json
import re
import urllib.request

from evergreen_agent import sanitize_links, _VALID_INTERNAL_ROOTS

# ── creds from .env.local ────────────────────────────────────────────────
env = {}
for line in open("../.env.local"):
    line = line.strip()
    if "=" in line and not line.startswith("#"):
        k, v = line.split("=", 1)
        env[k] = v.strip().strip('"').strip("'")
URL = env.get("SUPABASE_URL") or env.get("NEXT_PUBLIC_SUPABASE_URL")
KEY = env.get("SUPABASE_SERVICE_ROLE_KEY")
H = {"apikey": KEY, "Authorization": f"Bearer {KEY}", "Content-Type": "application/json"}

APPLY = True  # set False for a dry run

LINK_RE = re.compile(r'<a\b[^>]*\bhref=["\']([^"\']*)["\'][^>]*>.*?</a>', re.I | re.S)


def broken_hrefs(content: str):
    out = []
    for m in LINK_RE.finditer(content):
        href = (m.group(1) or "").strip()
        if re.match(r"^(https?:|mailto:|tel:|#)", href, re.I):
            continue
        if href.startswith("/"):
            first = href.strip("/").split("/")[0].split("?")[0].split("#")[0]
            if first == "" or first in _VALID_INTERNAL_ROOTS:
                continue
        out.append(href)
    return out


req = urllib.request.Request(
    f"{URL}/rest/v1/posts?status=eq.published&select=id,slug,content&limit=2000", headers=H)
posts = json.loads(urllib.request.urlopen(req, timeout=30).read())
print(f"Published posts: {len(posts)}")

fixed = 0
for p in posts:
    content = p.get("content") or ""
    hrefs = broken_hrefs(content)
    if not hrefs:
        continue
    clean, n = sanitize_links(content)
    print(f"\nPost: /{p['slug']}")
    for h in hrefs:
        print(f"   ✂  {h}")
    if APPLY:
        body = json.dumps({"content": clean}).encode()
        preq = urllib.request.Request(
            f"{URL}/rest/v1/posts?id=eq.{p['id']}", data=body, method="PATCH",
            headers={**H, "Prefer": "return=minimal"})
        urllib.request.urlopen(preq, timeout=30)
        print(f"   ✅ updated ({n} unwrapped)")
    fixed += 1

print(f"\nDONE — posts {'fixed' if APPLY else 'that would be fixed'}: {fixed}")
