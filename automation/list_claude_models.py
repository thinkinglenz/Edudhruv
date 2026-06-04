"""
Quick utility — list Claude models available on your Anthropic account.

Usage:
  ANTHROPIC_API_KEY=sk-ant-... python3 automation/list_claude_models.py
"""
import os, json
import urllib.request
from pathlib import Path

try:
    from dotenv import load_dotenv
    load_dotenv(Path(__file__).parent.parent / ".env.local")
    load_dotenv(Path(__file__).parent / ".env")
except ImportError:
    pass

key = os.getenv("ANTHROPIC_API_KEY", "")
if not key or key == "placeholder":
    print("❌ No ANTHROPIC_API_KEY set in .env.local"); raise SystemExit(1)

req = urllib.request.Request(
    "https://api.anthropic.com/v1/models",
    headers={"x-api-key": key, "anthropic-version": "2023-06-01"},
)
res = json.loads(urllib.request.urlopen(req, timeout=30).read())

print(f"\nAvailable models on your account ({len(res.get('data', []))} total):\n")
for m in res.get("data", []):
    name = m.get("id", "?")
    display = m.get("display_name", "")
    created = m.get("created_at", "")[:10]
    print(f"  {name:50}  ({display}, since {created})")

# Find the cheapest Haiku for the blog agent
haikus = [m for m in res.get("data", []) if "haiku" in m.get("id", "").lower()]
if haikus:
    print(f"\n💡 Recommended for blog agent (cheapest):")
    for h in haikus:
        print(f"    CLAUDE_MODEL={h['id']}")
