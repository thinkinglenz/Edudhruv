"""Exchange the short-lived token for a long-lived one, then pull the
PERMANENT page token. Never prints any secret/token — only safe status."""
import json, os, urllib.parse, urllib.request, urllib.error, datetime

HERE = os.path.dirname(os.path.abspath(__file__))
GRAPH = "https://graph.facebook.com/v21.0"
APP_ID = "1632904575012013"
PAGE_ID = "109173178522211"

env = {}
for line in open(os.path.join(HERE, ".env")):
    line = line.strip()
    if line and not line.startswith("#") and "=" in line:
        k, v = line.split("=", 1); env[k.strip()] = v.strip().strip('"').strip("'")

SHORT = env.get("FB_TOKEN", "")
SECRET = env.get("FB_APP_SECRET", "")
if not SHORT or not SECRET:
    print("Missing FB_TOKEN or FB_APP_SECRET in .env"); raise SystemExit

def get(path, params):
    q = urllib.parse.urlencode(params)
    with urllib.request.urlopen(f"{GRAPH}/{path}?{q}", timeout=25) as r:
        return json.loads(r.read())

def save_env(key, value):
    path = os.path.join(HERE, ".env"); lines = []; found = False
    for line in open(path):
        if line.strip().startswith(key + "="):
            lines.append(f"{key}={value}\n"); found = True
        else:
            lines.append(line)
    if not found: lines.append(f"{key}={value}\n")
    open(path, "w").writelines(lines)

def expiry(tok):
    try:
        d = get("debug_token", {"input_token": tok, "access_token": tok}).get("data", {})
        e = d.get("expires_at", 0)
        return "never (permanent)" if e == 0 else datetime.datetime.fromtimestamp(e).strftime("%Y-%m-%d %H:%M")
    except Exception:
        return "?"

try:
    # 1) short-lived user token -> long-lived user token
    ll = get("oauth/access_token", {
        "grant_type": "fb_exchange_token",
        "client_id": APP_ID, "client_secret": SECRET,
        "fb_exchange_token": SHORT,
    })
    long_user = ll["access_token"]
    print(f"Long-lived USER token obtained. Expiry: {expiry(long_user)}")

    # 2) permanent page token from the long-lived user token
    page = get(PAGE_ID, {"fields": "access_token,name", "access_token": long_user})
    page_tok = page.get("access_token")
    if not page_tok:
        print("No page access_token returned:", page); raise SystemExit
    save_env("FB_PAGE_ACCESS_TOKEN", page_tok)
    save_env("FB_TOKEN", long_user)  # keep the long-lived user token too
    save_env("FB_PAGE_ID", PAGE_ID)
    save_env("FB_APP_ID", APP_ID)
    print(f"✅ PERMANENT page token for '{page.get('name')}' saved as FB_PAGE_ACCESS_TOKEN.")
    print(f"   Page token expiry: {expiry(page_tok)}")
except urllib.error.HTTPError as e:
    print(f"❌ FAILED (HTTP {e.code}): {e.read().decode()[:300]}")
