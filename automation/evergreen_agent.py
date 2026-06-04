"""
EduDhruv Evergreen Blog Agent
==============================
Generates SEO-optimised blog posts using Claude and publishes directly
to Supabase (no WordPress needed).

Schedule: Every 4 hours via GitHub Actions or any cron.

GitHub Actions cron (free, zero infra):
  - See .github/workflows/evergreen.yml

Local test:
  python automation/evergreen_agent.py

Environment variables (set in .env or GitHub Secrets):
  ANTHROPIC_API_KEY
  SUPABASE_URL
  SUPABASE_SERVICE_ROLE_KEY
  UNSPLASH_ACCESS_KEY  (optional)
"""

import os
import json
import time
import random
import logging
import urllib.request
import urllib.parse
from datetime import datetime, timezone
from pathlib import Path

from dotenv import load_dotenv

load_dotenv(Path(__file__).parent / ".env")

# ─── LOGGING ──────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
log = logging.getLogger("evergreen")

# ─── CONFIG ───────────────────────────────────────────────────────────────
ANTHROPIC_API_KEY    = os.getenv("ANTHROPIC_API_KEY", "")
# Accept either env var name (workflow uses SUPABASE_URL, Vercel uses NEXT_PUBLIC_SUPABASE_URL)
SUPABASE_URL         = os.getenv("SUPABASE_URL") or os.getenv("NEXT_PUBLIC_SUPABASE_URL", "")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
UNSPLASH_KEY         = os.getenv("UNSPLASH_ACCESS_KEY", "")
# Default to a current, valid Claude model name
CLAUDE_MODEL         = os.getenv("CLAUDE_MODEL", "claude-3-5-haiku-latest")
MAX_TOKENS           = int(os.getenv("MAX_TOKENS", "4096"))
AMAZON_TAG           = os.getenv("AMAZON_ASSOCIATE_ID", "edudhruv-20")

# ─── TOPIC BANK ───────────────────────────────────────────────────────────
TOPICS: dict[str, list[str]] = {
    "indian-students-abroad": [
        "How to Get a Student Visa for the UK as an Indian Student",
        "Life in Canada for Indian Students: What No One Tells You",
        "Top 5 Part-Time Jobs for Indian Students in Australia",
        "Cost of Living for Indian Students in Germany 2025",
        "How Indian Students Can Open a Bank Account in the UK",
        "Student Health Insurance for Indians Studying Abroad",
        "Indian Food in Australian Cities: A Survival Guide",
        "How to Send Money Home from the UK as an Indian Student",
        "Indian Student Communities in Singapore",
        "Celebrating Diwali as an Indian Student Abroad",
        "How to Convert Indian Degree Equivalence for Abroad Universities",
        "Mental Health Support for Indian Students Studying Abroad",
    ],
    "top-universities": [
        "Top 10 Universities in Canada for Indian Students 2025",
        "Best Engineering Universities in Germany for International Students",
        "QS Rankings 2025: Best Universities for MBA in UK",
        "NUS vs NTU — Which Singapore University is Better for Indian Students",
        "Top Universities in Australia for Computer Science",
        "University of Melbourne vs Monash: Which One Should You Choose",
        "Best Affordable Universities in Europe for Indian Students",
        "Top Universities in UAE for Indian Students",
        "Ivy League vs Russell Group: Which is Better for Indian Students",
        "Best University Campuses in the World Ranked by Indian Students",
    ],
    "scholarship": [
        "Top 10 Scholarships for Indian Students Studying Abroad 2025",
        "Chevening Scholarship 2025: Complete Guide for Indians",
        "Commonwealth Scholarship: How to Apply as an Indian Student",
        "Australia Awards Scholarship: Step-by-Step Guide for Indians",
        "DAAD Scholarship Germany: Everything Indian Students Need to Know",
        "Singapore Government Scholarships for Indian Students",
        "Merit-Based Scholarships in Canada for Indian Students",
        "Sports Scholarships Abroad for Indian Athletes",
        "Partial Scholarship vs Full Scholarship: What to Choose",
        "How to Write a Winning Scholarship Essay: Tips for Indians",
    ],
    "education-loan": [
        "SBI Education Loan for Abroad Studies: Complete Guide 2025",
        "HDFC Credila vs Avanse: Which Education Loan is Better",
        "How to Get Education Loan Without Collateral for Abroad Studies",
        "Education Loan Tax Benefit Under Section 80E Explained",
        "How Much Education Loan Can You Get for UK Universities",
        "Prodigy Finance Review: Is It Worth It for Indian Students",
        "GRE Score Requirements for Education Loan Approval",
        "Education Loan for Canada Studies: Best Banks Compared",
        "How to Repay Education Loan After Returning to India",
        "Top NBFCs Giving Education Loans for Abroad Studies",
    ],
    "student-accommodation": [
        "How to Find Student Accommodation in the UK as an Indian",
        "Purpose-Built Student Accommodation vs Private Rentals in Australia",
        "Student Housing in Canada: University Dorms vs Off-Campus",
        "Cheap Student Accommodation in Singapore for Indians",
        "How to Avoid Accommodation Scams When Studying Abroad",
        "Best Apps to Find Student Accommodation in Europe",
        "Living in University Halls: Pros and Cons for Indian Students",
        "How Much Does Student Accommodation Cost in Germany",
        "Homestay vs Student Hostel: Which is Better for Indian Students",
        "Tips for Finding Roommates Abroad as an Indian Student",
    ],
    "travel-essentials": [
        "Best Travel Insurance for Indian Students Studying Abroad",
        "What to Pack for UK Studies: The Ultimate Indian Student Checklist",
        "Cheapest Flights from India to UK, Canada, Australia in 2025",
        "Student Discount Cards for Travel in Europe",
        "How to Get an International Driving Permit as an Indian Student",
        "Best Budget Airlines for Students in Europe",
        "Luggage Tips for Indian Students Flying Abroad First Time",
        "How to Use Public Transport as a Student in London",
        "Travel Hacks for Indian Students During University Breaks",
        "Best Travel Credit Cards for Indian Students Abroad",
    ],
}

# Weighted rotation: Indian Students Abroad = 4 slots, rest = 2 each
CYCLE_ORDER = (
    ["indian-students-abroad"] * 4
    + ["top-universities"] * 2
    + ["scholarship"] * 2
    + ["education-loan"] * 2
    + ["student-accommodation"] * 1
    + ["travel-essentials"] * 1
)

# ─── HTTP HELPERS ──────────────────────────────────────────────────────────

def _req(url: str, method: str = "GET", data: dict | None = None, headers: dict | None = None) -> dict:
    """HTTP request with detailed error logging on failure."""
    body = json.dumps(data).encode() if data else None
    req = urllib.request.Request(url, data=body, method=method, headers=headers or {})
    if body:
        req.add_header("Content-Type", "application/json")
    try:
        with urllib.request.urlopen(req, timeout=120) as res:
            return json.loads(res.read())
    except urllib.error.HTTPError as e:
        # Log the actual error body so we can see what's wrong
        err_body = e.read().decode("utf-8", errors="replace")
        log.error(f"HTTP {e.code} on {method} {url}")
        log.error(f"Response: {err_body[:1000]}")
        raise
    except urllib.error.URLError as e:
        log.error(f"Network error on {method} {url}: {e.reason}")
        raise


def supabase_get(table: str, params: str = "") -> list[dict]:
    url = f"{SUPABASE_URL}/rest/v1/{table}?{params}"
    headers = {
        "apikey": SUPABASE_SERVICE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
    }
    return _req(url, headers=headers)


def supabase_post(table: str, data: dict) -> dict:
    url = f"{SUPABASE_URL}/rest/v1/{table}"
    headers = {
        "apikey": SUPABASE_SERVICE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
        "Prefer": "return=representation",
    }
    return _req(url, method="POST", data=data, headers=headers)


def claude(system: str, user: str) -> str:
    url = "https://api.anthropic.com/v1/messages"
    headers = {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
    }
    data = {
        "model": CLAUDE_MODEL,
        "max_tokens": MAX_TOKENS,
        "system": system,
        "messages": [{"role": "user", "content": user}],
    }
    res = _req(url, method="POST", data=data, headers=headers)
    return res["content"][0]["text"]


def unsplash_image(query: str) -> dict | None:
    if not UNSPLASH_KEY:
        return None
    try:
        q = urllib.parse.quote(f"{query} student education")
        url = f"https://api.unsplash.com/photos/random?query={q}&orientation=landscape&content_filter=high"
        req = urllib.request.Request(url, headers={"Authorization": f"Client-ID {UNSPLASH_KEY}"})
        with urllib.request.urlopen(req, timeout=10) as res:
            data = json.loads(res.read())
        return {
            "url": data["urls"]["regular"],
            "alt": data.get("alt_description") or query,
            "credit": (
                f'Photo by <a href="{data["user"]["links"]["html"]}?utm_source=edudhruv&utm_medium=referral" '
                f'target="_blank" rel="noopener">{data["user"]["name"]}</a> on '
                f'<a href="https://unsplash.com?utm_source=edudhruv&utm_medium=referral" target="_blank" rel="noopener">Unsplash</a>'
            ),
        }
    except Exception as e:
        log.warning(f"Unsplash error: {e}")
        return None


# ─── TOPIC SELECTION ──────────────────────────────────────────────────────

def get_used_topics() -> dict[str, list[str]]:
    """Fetch already-published topics from Supabase agent_state table."""
    try:
        rows = supabase_get("agent_state", "select=category_slug,topic")
        used: dict[str, list[str]] = {}
        for row in rows:
            used.setdefault(row["category_slug"], []).append(row["topic"])
        return used
    except Exception as e:
        log.warning(f"Could not fetch agent state: {e}")
        return {}


def pick_topic(cycle: int, used: dict[str, list[str]]) -> tuple[str, str]:
    category = CYCLE_ORDER[cycle % len(CYCLE_ORDER)]
    all_topics = TOPICS[category]
    done = used.get(category, [])
    available = [t for t in all_topics if t not in done]
    if not available:
        # All done — reset this category
        log.info(f"All topics used for {category}, resetting")
        available = all_topics
    return category, random.choice(available)


def get_current_cycle() -> int:
    """Estimate current cycle from total published post count."""
    try:
        rows = supabase_get("posts", "select=id&status=eq.published")
        return len(rows)
    except Exception:
        return 0


# ─── CONTENT GENERATION ───────────────────────────────────────────────────

SYSTEM_PROMPT = """You are an expert education writer for EduDhruv.com — India's most trusted study abroad platform.
Write like a knowledgeable senior who has personally helped hundreds of Indian students study abroad.

Writing rules:
- Warm, practical, specific — real data, real bank names, real numbers
- Indian context: mention INR, RBI, IELTS scores, Indian cities where relevant
- 100% original, E-E-A-T compliant, human-sounding (not AI-generated)
- 2025 data where possible
- Return VALID JSON ONLY — no markdown, no code fences, no explanation"""


def generate_post(topic: str, category_name: str) -> dict:
    prompt = f"""Write a comprehensive blog post for EduDhruv.com on: "{topic}"
Category: {category_name}

Return a JSON object with EXACTLY these fields:
{{
  "title": "SEO title 50-60 chars, include year if relevant",
  "slug": "lowercase-hyphenated-url-slug-no-special-chars",
  "meta_title": "60-char SEO meta title",
  "meta_description": "150-160 char meta description with primary keyword",
  "focus_keyword": "primary keyword phrase (3-5 words)",
  "excerpt": "2-sentence plain text excerpt",
  "intro": "<p>HTML intro — 2 paragraphs — hooks reader, includes focus keyword in first sentence</p>",
  "body": "<article body — 1200-1600 words of HTML with H2/H3 headings, bullet lists, numbered steps. MUST include a section titled 'Frequently Asked Questions' with 3-4 H3 question headings each followed by a <p> answer paragraph>",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "reading_time": 7
}}

Content requirements:
- Body word count: 1200-1600 words
- At least 3 H2 subheadings
- FAQ section with minimum 3 questions at the end
- Include at least 1 internal link suggestion: text linking to /education-loan/
- 2025 statistics and real data points
- Naturally place focus keyword in first 100 words"""

    raw = claude(SYSTEM_PROMPT, prompt)

    # Strip markdown fences if Claude wrapped output in them
    clean = raw.strip()
    if clean.startswith("```"):
        # Remove first line (```json or ```) and last ``` block
        lines = clean.split("\n")
        if len(lines) > 1:
            clean = "\n".join(lines[1:])
        clean = clean.rsplit("```", 1)[0].strip()

    # Sometimes Claude adds preamble like "Here's the JSON:" — try to find the first {
    if not clean.startswith("{"):
        idx = clean.find("{")
        if idx > 0:
            clean = clean[idx:]
        # And trim anything after the last }
        last = clean.rfind("}")
        if last > 0:
            clean = clean[:last + 1]

    try:
        return json.loads(clean)
    except json.JSONDecodeError as e:
        log.error(f"JSON parse failed at position {e.pos}: {e.msg}")
        log.error(f"Raw Claude output (first 500 chars): {raw[:500]}")
        log.error(f"Cleaned (first 500 chars):           {clean[:500]}")
        raise


# ─── PUBLISH TO SUPABASE ──────────────────────────────────────────────────

def publish_post(post_data: dict, category_slug: str, image: dict | None) -> dict:
    full_content = post_data["intro"]

    if image:
        full_content += (
            f'\n<figure style="margin:28px 0;">'
            f'<img src="{image["url"]}" alt="{image["alt"]}" loading="lazy" '
            f'style="max-width:100%;border-radius:8px;" />'
            f'<figcaption>{image["credit"]}</figcaption></figure>'
        )

    full_content += "\n" + post_data["body"]

    record = {
        "title":                 post_data["title"],
        "slug":                  post_data["slug"],
        "content":               full_content,
        "excerpt":               post_data.get("excerpt", ""),
        "category_slug":         category_slug,
        "meta_title":            post_data.get("meta_title") or post_data["title"],
        "meta_description":      post_data.get("meta_description", ""),
        "focus_keyword":         post_data.get("focus_keyword", ""),
        "featured_image_url":    image["url"] if image else None,
        "featured_image_alt":    image["alt"] if image else None,
        "featured_image_credit": image["credit"] if image else None,
        "reading_time":          post_data.get("reading_time", 7),
        "tags":                  post_data.get("tags", []),
        "status":                "published",
    }

    result = supabase_post("posts", record)
    return result[0] if isinstance(result, list) else result


def mark_topic_used(category_slug: str, topic: str, post_slug: str):
    try:
        supabase_post("agent_state", {
            "category_slug": category_slug,
            "topic": topic,
            "post_slug": post_slug,
            "published_at": datetime.now(timezone.utc).isoformat(),
        })
    except Exception as e:
        log.warning(f"Could not save agent state: {e}")


# ─── MAIN ─────────────────────────────────────────────────────────────────

def main():
    log.info("═" * 50)
    log.info("EduDhruv Evergreen Agent — Supabase Edition")
    log.info(f"Model: {CLAUDE_MODEL} | Time: {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    log.info("═" * 50)

    # Validate env
    missing = [k for k in ["ANTHROPIC_API_KEY", "SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"]
               if not os.getenv(k)]
    if missing:
        log.error(f"Missing environment variables: {', '.join(missing)}")
        raise SystemExit(1)

    # Pick topic
    used = get_used_topics()
    cycle = get_current_cycle()
    category_slug, topic = pick_topic(cycle, used)

    category_names = {
        "indian-students-abroad": "Indian Students Abroad",
        "top-universities": "Top Universities",
        "scholarship": "Scholarship",
        "education-loan": "Education Loan",
        "student-accommodation": "Student Accommodation",
        "travel-essentials": "Travel Essentials",
    }
    category_name = category_names.get(category_slug, category_slug)

    log.info(f"Category: {category_slug}")
    log.info(f"Topic: {topic}")

    # Get image
    image = unsplash_image(topic)
    if image:
        log.info(f"Image: {image['url']}")
    else:
        log.info("No image (no Unsplash key or API error)")

    # Generate content
    log.info("Calling Claude to generate content...")
    t0 = time.time()
    post_data = generate_post(topic, category_name)
    log.info(f"Content generated in {time.time()-t0:.1f}s — title: {post_data['title']}")

    # Publish
    result = publish_post(post_data, category_slug, image)
    post_slug = result.get("slug", post_data["slug"])

    # Mark topic used
    mark_topic_used(category_slug, topic, post_slug)

    log.info(f"✅ Published: {post_data['title']}")
    log.info(f"   URL: https://www.edudhruv.com/{category_slug}/{post_slug}")
    log.info(f"   Cycle: {cycle + 1}")


if __name__ == "__main__":
    import traceback
    try:
        main()
    except SystemExit:
        raise
    except Exception as e:
        log.error("═" * 60)
        log.error(f"AGENT FAILED: {type(e).__name__}: {e}")
        log.error("Full traceback:")
        log.error(traceback.format_exc())
        log.error("═" * 60)
        raise SystemExit(1)
