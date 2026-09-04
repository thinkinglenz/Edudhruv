"""
Inspect the saved Facebook token and, if it's a user token, extract the
Page access token for the EduDhruv page — WITHOUT ever printing any secret.
Prints only safe info (id, name, token type, expiry, scopes).
"""
import json
import os
import urllib.parse
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
PAGE_ID = "109173178522211"
GRAPH = "https://graph.facebook.com/v21.0"

# ── load .env ──
env = {}
for line in open(os.path.join(HERE, ".env")):
    line = line.strip()
    if line and not line.startswith("#") and "=" in line:
        k, v = line.split("=", 1)
        env[k.strip()] = v.strip().strip('"').strip("'")

TOKEN = env.get("FB_TOKEN", "")
if not TOKEN:
    print("No FB_TOKEN in .env"); raise SystemExit

def get(path, params):
    q = urllib.parse.urlencode(params)
    with urllib.request.urlopen(f"{GRAPH}/{path}?{q}", timeout=20) as r:
        return json.loads(r.read())

def save_env(key, value):
    """Append/replace a key in .env without printing the value."""
    path = os.path.join(HERE, ".env")
    lines = []
    found = False
    for line in open(path):
        if line.strip().startswith(key + "="):
            lines.append(f"{key}={value}\n"); found = True
        else:
            lines.append(line)
    if not found:
        lines.append(f"{key}={value}\n")
    with open(path, "w") as f:
        f.writelines(lines)

# 1) What is this token?
try:
    me = get("me", {"fields": "id,name", "access_token": TOKEN})
    print(f"Token identity: {me.get('name')} (id {me.get('id')})")
except urllib.error.HTTPError as e:
    print("Token check failed:", e.code, e.read().decode()[:200]); raise SystemExit

is_page = (me.get("id") == PAGE_ID)  # page token if /me is the page itself

# 2) Debug: type, expiry, scopes
try:
    dbg = get("debug_token", {"input_token": TOKEN, "access_token": TOKEN}).get("data", {})
    import datetime
    exp = dbg.get("expires_at", 0)
    exp_s = "never" if exp == 0 else datetime.datetime.fromtimestamp(exp).strftime("%Y-%m-%d %H:%M")
    print(f"Type: {dbg.get('type')} | Expires: {exp_s} | Scopes: {dbg.get('scopes')}")
except Exception as e:
    print("debug_token unavailable:", e)

# 3) If USER token → get the Page token for the EduDhruv page
if not is_page:
    try:
        accts = get("me/accounts", {"access_token": TOKEN}).get("data", [])
        page = next((p for p in accts if p.get("id") == PAGE_ID), None)
        if page and page.get("access_token"):
            save_env("FB_PAGE_ACCESS_TOKEN", page["access_token"])
            print(f"✅ Found EduDhruv page token — SAVED to .env as FB_PAGE_ACCESS_TOKEN (not shown)")
        else:
            print(f"⚠️  EduDhruv page ({PAGE_ID}) not in the token's page list. Pages found: "
                  f"{[p.get('name') for p in accts]}")
    except urllib.error.HTTPError as e:
        print("me/accounts failed:", e.code, e.read().decode()[:200])
else:
    # It's already a page token — save it directly.
    if me.get("id") == PAGE_ID:
        save_env("FB_PAGE_ACCESS_TOKEN", TOKEN)
        print("✅ This is already the EduDhruv PAGE token — saved as FB_PAGE_ACCESS_TOKEN.")
    else:
        print(f"⚠️  This page token is for a different page ({me.get('id')}), not EduDhruv.")

save_env("FB_PAGE_ID", PAGE_ID)
print("Page ID saved to .env.")
