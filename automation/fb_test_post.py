"""Test whether the saved Page token can actually publish — using an
UNPUBLISHED post (not visible to the public), then delete it. Prints only
safe info, never the token."""
import json, os, urllib.parse, urllib.request, urllib.error

HERE = os.path.dirname(os.path.abspath(__file__))
GRAPH = "https://graph.facebook.com/v21.0"
env = {}
for line in open(os.path.join(HERE, ".env")):
    line = line.strip()
    if line and not line.startswith("#") and "=" in line:
        k, v = line.split("=", 1); env[k.strip()] = v.strip().strip('"').strip("'")

TOKEN = env.get("FB_PAGE_ACCESS_TOKEN", "")
PAGE = env.get("FB_PAGE_ID", "")
if not TOKEN or not PAGE:
    print("Missing FB_PAGE_ACCESS_TOKEN or FB_PAGE_ID"); raise SystemExit

def api(method, path, params):
    data = urllib.parse.urlencode(params).encode()
    req = urllib.request.Request(f"{GRAPH}/{path}", data=data, method=method)
    with urllib.request.urlopen(req, timeout=20) as r:
        return json.loads(r.read())

try:
    # Create an UNPUBLISHED post (not public) to test the permission.
    res = api("POST", f"{PAGE}/feed", {
        "message": "EduDhruv auto-post permission test — ignore.",
        "published": "false",
        "access_token": TOKEN,
    })
    post_id = res.get("id")
    print(f"✅ POST SUCCEEDED — the page token CAN publish. (test post id {post_id})")
    # Clean up: delete the test post.
    try:
        api("DELETE", post_id, {"access_token": TOKEN})
        print("   🧹 Test post deleted.")
    except Exception as e:
        print(f"   (couldn't auto-delete test post {post_id}: {e})")
except urllib.error.HTTPError as e:
    body = e.read().decode()
    print(f"❌ POST FAILED (HTTP {e.code}): {body[:300]}")
