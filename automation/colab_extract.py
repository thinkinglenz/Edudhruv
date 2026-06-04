"""
EduDhruv WordPress Extractor — Google Colab Version
=====================================================
1. Go to https://colab.research.google.com
2. Create a new notebook
3. Paste this entire script into a cell and run it
4. Download the wp_export.json file that appears
5. Put it in ~/edudhruv-next/migration/wp_export.json
6. Run: python3 automation/wp_xml_import.py  (to load into mock-data.ts)

OR paste this URL directly into Colab:
https://colab.research.google.com/
"""

# ── PASTE THIS INTO A COLAB CELL ────────────────────────────────────────────

COLAB_SCRIPT = """
!pip install cloudscraper beautifulsoup4 -q

import cloudscraper, json, re, time, base64
from bs4 import BeautifulSoup
from datetime import datetime, timezone

WP_URL  = "https://www.edudhruv.com"
WP_USER = "edu-agent"
WP_PASS = "GYIJ z1Oi pxPN GRut B353 voZm"

scraper = cloudscraper.create_scraper(browser={"browser":"chrome","platform":"windows","mobile":False})
token   = base64.b64encode(f"{WP_USER}:{WP_PASS}".encode()).decode()
scraper.headers.update({"Authorization": f"Basic {token}"})

posts, page = [], 1
while True:
    r = scraper.get(f"{WP_URL}/wp-json/wp/v2/posts?per_page=100&page={page}&status=publish", timeout=30)
    print(f"Page {page}: HTTP {r.status_code}")
    if r.status_code != 200: break
    batch = r.json()
    if not batch: break
    posts.extend(batch)
    print(f"  Got {len(batch)} posts (total: {len(posts)})")
    if page >= int(r.headers.get("X-WP-TotalPages", 1)): break
    page += 1
    time.sleep(1)

print(f"\\nTotal: {len(posts)} posts")

# Save to file
output = {"exported_at": datetime.utcnow().isoformat(), "total": len(posts), "posts": posts}
with open("wp_export.json", "w") as f:
    json.dump(output, f, indent=2, ensure_ascii=False)
print("Saved: wp_export.json")

# Download it
from google.colab import files
files.download("wp_export.json")
"""

print("=" * 60)
print("COLAB INSTRUCTIONS:")
print("=" * 60)
print()
print("1. Open: https://colab.research.google.com")
print("2. File → New notebook")
print("3. Click '+ Code' to add a cell")
print("4. Paste the script below into the cell:")
print()
print("-" * 60)
print(COLAB_SCRIPT)
print("-" * 60)
print()
print("5. Click the ▶ button to run")
print("6. wp_export.json will download automatically")
print("7. Move it to: ~/edudhruv-next/migration/wp_export.json")
print()
print("Then on your Mac:")
print("  cd ~/edudhruv-next")
print("  python3 automation/wp_xml_import.py")
print()
print("(The XML import script also handles JSON — it auto-detects the format)")

if __name__ == "__main__":
    pass
