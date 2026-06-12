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
import urllib.error
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
# Default to a stable, dated Claude model ID (— most reliable, no alias resolution).
# Override with CLAUDE_MODEL env var or workflow_dispatch input.
CLAUDE_MODEL         = os.getenv("CLAUDE_MODEL", "claude-3-5-haiku-20241022")
# 8192 gives plenty of headroom for a 1600-word body + all metadata fields.
# (Claude Haiku 4.5 supports up to 64K output tokens.)
MAX_TOKENS           = int(os.getenv("MAX_TOKENS", "8192"))
AMAZON_TAG           = os.getenv("AMAZON_ASSOCIATE_ID", "edudhruv-20")

# ─── YEAR — used in topic titles + prompts ────────────────────────────────
# Students searching now are typically planning for the NEXT admission cycle.
# E.g. in June 2026, queries spike for "scholarships 2027". We use current+1.
YEAR = datetime.now().year + 1
YEAR_PREV = YEAR - 1   # for "Class of {YEAR-1} → {YEAR}" type references

# ─── TOPIC BANK ───────────────────────────────────────────────────────────
# Use {YEAR} placeholder in any topic that needs a year — it's substituted
# at runtime so the agent always publishes forward-looking content.
TOPICS: dict[str, list[str]] = {
    "indian-students-abroad": [
        "How to Get a Student Visa for the UK as an Indian Student",
        "Life in Canada for Indian Students: What No One Tells You",
        "Top 5 Part-Time Jobs for Indian Students in Australia",
        "Cost of Living for Indian Students in Germany {YEAR}",
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
        "Top 10 Universities in Canada for Indian Students {YEAR}",
        "Best Engineering Universities in Germany for International Students",
        "QS Rankings {YEAR}: Best Universities for MBA in UK",
        "NUS vs NTU — Which Singapore University is Better for Indian Students",
        "Top Universities in Australia for Computer Science",
        "University of Melbourne vs Monash: Which One Should You Choose",
        "Best Affordable Universities in Europe for Indian Students",
        "Top Universities in UAE for Indian Students",
        "Ivy League vs Russell Group: Which is Better for Indian Students",
        "Best University Campuses in the World Ranked by Indian Students",
    ],
    "scholarship": [
        "Top 10 Scholarships for Indian Students Studying Abroad {YEAR}",
        "Chevening Scholarship {YEAR}: Complete Guide for Indians",
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
        "SBI Education Loan for Abroad Studies: Complete Guide {YEAR}",
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
        "Cheapest Flights from India to UK, Canada, Australia in {YEAR}",
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
    """Plain text Claude completion (for non-structured outputs)."""
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


def list_available_models() -> list[str]:
    """Query Anthropic /v1/models to discover what's available on this account."""
    try:
        req = urllib.request.Request(
            "https://api.anthropic.com/v1/models",
            headers={"x-api-key": ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01"},
        )
        with urllib.request.urlopen(req, timeout=30) as res:
            data = json.loads(res.read())
        return [m["id"] for m in data.get("data", [])]
    except Exception as e:
        log.warning(f"Could not list models: {e}")
        return []


# Model preference — tries each in order until one works.
# Newest Haiku first (cheapest), then Sonnet (more reliable), then older dated IDs.
MODEL_FALLBACKS = [
    "claude-haiku-4-5",                # Claude 4.5 family alias
    "claude-3-5-haiku-20241022",       # Stable dated Haiku 3.5
    "claude-sonnet-4-5",               # Sonnet 4.5 family alias (more expensive)
    "claude-3-5-sonnet-20241022",      # Stable dated Sonnet 3.5
    "claude-3-haiku-20240307",         # Oldest Haiku (last-resort fallback)
]


def claude_structured(system: str, user: str, tool_schema: dict) -> dict:
    """
    Call Claude with tool_use to force structured JSON output.
    Returns the parsed input from the tool call — always valid JSON.

    Tries CLAUDE_MODEL first, then auto-falls back to alternatives if 404.
    """
    url = "https://api.anthropic.com/v1/messages"
    headers = {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
    }
    base_payload = {
        "max_tokens": MAX_TOKENS,
        "system": system,
        "tools": [{
            "name":        "publish_blog_post",
            "description": "Save the generated blog post to the database",
            "input_schema": tool_schema,
        }],
        "tool_choice": {"type": "tool", "name": "publish_blog_post"},
        "messages": [{"role": "user", "content": user}],
    }

    # Build the list of models to try: configured one first, then fallbacks
    models_to_try = [CLAUDE_MODEL]
    for m in MODEL_FALLBACKS:
        if m not in models_to_try:
            models_to_try.append(m)

    last_error = None
    for model in models_to_try:
        log.info(f"  Trying model: {model}")
        try:
            res = _req(url, method="POST", data={**base_payload, "model": model}, headers=headers)
            for block in res.get("content", []):
                if block.get("type") == "tool_use" and block.get("name") == "publish_blog_post":
                    log.info(f"  ✓ Model {model} succeeded")
                    return block["input"]
            raise ValueError(f"No tool_use block in response from {model}")
        except urllib.error.HTTPError as e:
            if e.code == 404:
                log.warning(f"  ✗ Model {model} not available (404), trying next...")
                last_error = e
                continue
            raise  # 401, 429, 500 — don't fallback
        except Exception as e:
            last_error = e
            log.warning(f"  ✗ Model {model} failed: {e}, trying next...")
            continue

    # Nothing worked — log what's actually available for the user
    log.error("All model fallbacks failed. Listing what your account actually has:")
    available = list_available_models()
    if available:
        log.error(f"Available models on this account: {available}")
        log.error(f"→ Set CLAUDE_MODEL env var or override in workflow_dispatch input")
    else:
        log.error("Could not list models — check ANTHROPIC_API_KEY is valid and has billing")
    raise last_error or ValueError("No working model found")


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
    # Substitute {YEAR} placeholder so topics always reference the next intake
    all_topics = [t.format(YEAR=YEAR, YEAR_PREV=YEAR_PREV) for t in TOPICS[category]]
    done = used.get(category, [])
    # Strip year from comparison so we don't re-pick "Chevening 2026" after publishing
    # the same topic for 2025. Compare base form (without year).
    import re as _re
    def base(t: str) -> str:
        return _re.sub(r"\s+\d{4}", "", t).strip()
    done_bases = {base(t) for t in done}
    available = [t for t in all_topics if base(t) not in done_bases]
    if not available:
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

SYSTEM_PROMPT = f"""You are an expert education writer for EduDhruv.com — India's most trusted study abroad platform.
Write like a knowledgeable senior who has personally helped hundreds of Indian students study abroad.

CURRENT YEAR: {datetime.now().year}. UPCOMING ADMISSION CYCLE: {YEAR}.
Whenever you reference dates, deadlines, fees, or visa rules, target the {YEAR} cycle
(or whichever specific cycle is relevant to the topic). NEVER write about a past year as if
it were current — students applying now are planning for {YEAR}, not {YEAR-2}.

Writing rules:
- Warm, practical, specific — real data, real bank names, real numbers
- Indian context: mention INR, RBI, IELTS scores, Indian cities where relevant
- 100% original, E-E-A-T compliant, human-sounding (not AI-generated)
- Forward-looking: use {YEAR}/{YEAR+1} data, not stale {YEAR-2} numbers
- Return VALID JSON ONLY — no markdown, no code fences, no explanation"""


POST_SCHEMA = {
    "type": "object",
    "required": ["title", "slug", "meta_title", "meta_description",
                 "focus_keyword", "excerpt", "intro", "body", "tags", "reading_time"],
    "properties": {
        "title": {
            "type": "string",
            "description": "SEO-optimised blog post title, 50-70 characters. Include year if relevant.",
        },
        "slug": {
            "type": "string",
            "description": "URL slug: lowercase, hyphens only, no special chars, max 80 chars (e.g. 'student-visa-uk-2026-guide').",
        },
        "meta_title": {
            "type": "string",
            "description": "SEO meta title for <title> tag, up to 65 characters.",
        },
        "meta_description": {
            "type": "string",
            "description": "SEO meta description, 140-160 characters, with primary keyword and clear value prop.",
        },
        "focus_keyword": {
            "type": "string",
            "description": "Primary SEO keyword phrase (3-6 words).",
        },
        "excerpt": {
            "type": "string",
            "description": "Plain-text excerpt, 2 sentences (max 300 chars), summarising the post.",
        },
        "intro": {
            "type": "string",
            "description": "REQUIRED: HTML intro for the article — 2 short paragraphs wrapped in <p> tags. Hook the reader, include the focus keyword in the first sentence.",
        },
        "body": {
            "type": "string",
            "description": f"REQUIRED — THE LONGEST FIELD BY FAR (must be 5000-8000 characters, ~1200-1600 words). This is the MAIN article body as a single HTML string. Structure: start with <h2>section heading</h2>, then 3-4 <p> paragraphs, repeat for 4-6 different sections covering different aspects of the topic. Use <ul><li>...</li></ul> for lists, <strong> for emphasis. End with <h2>Frequently Asked Questions</h2> followed by 4+ <h3>question</h3><p>answer</p> pairs. Include at least one internal link <a href=\"/education-loan/\">education loan</a>. Reference specific {YEAR}/{YEAR+1} data points (do NOT use {YEAR-2} or older). Do NOT include the intro paragraphs again — only the substantive body content AFTER the intro.",
            "minLength": 4500,
        },
        "tags": {
            "type": "array",
            "items": {"type": "string"},
            "minItems": 3,
            "maxItems": 8,
            "description": "Array of 5 relevant tags (single words or short phrases).",
        },
        "reading_time": {
            "type": "integer",
            "minimum": 3,
            "maximum": 20,
            "description": "Estimated reading time in minutes (typical: 7).",
        },
    },
}


def generate_post(topic: str, category_name: str) -> dict:
    """
    Generate a structured blog post via Claude tool_use.
    Guaranteed valid JSON because Claude returns it as a tool invocation
    instead of free-form text.
    """
    prompt = f"""Write a long-form blog post for EduDhruv.com on: "{topic}"
Category: {category_name}

You MUST call the `publish_blog_post` tool with ALL 10 required fields:
title, slug, meta_title, meta_description, focus_keyword, excerpt, intro, body, tags, reading_time.

═══ THE BODY FIELD IS CRITICAL ═══

The `body` field MUST be 5000-8000 characters (≈ 1200-1600 words) of HTML.
If your body is shorter than 4500 characters, the article will be REJECTED.

Structure your body like this (and verify length BEFORE submitting):

<h2>First major section title</h2>
<p>Paragraph 1 (3-5 sentences with specific facts, numbers, examples)</p>
<p>Paragraph 2 (3-5 sentences)</p>
<p>Paragraph 3 (3-5 sentences)</p>

<h2>Second major section title</h2>
<p>Paragraph...</p>
<ul>
  <li><strong>Point 1:</strong> Detailed explanation</li>
  <li><strong>Point 2:</strong> Detailed explanation</li>
  <li><strong>Point 3:</strong> Detailed explanation</li>
</ul>
<p>More detail...</p>

<h2>Third major section title</h2>
<p>...with internal link: <a href="/education-loan/">education loan</a>...</p>

<h2>Fourth major section</h2>
<p>...</p>

<h2>Frequently Asked Questions</h2>
<h3>Question 1?</h3>
<p>Detailed answer (3-4 sentences).</p>
<h3>Question 2?</h3>
<p>Detailed answer.</p>
<h3>Question 3?</h3>
<p>Detailed answer.</p>
<h3>Question 4?</h3>
<p>Detailed answer.</p>

═══ OTHER REQUIREMENTS ═══

- Include {YEAR}/{YEAR+1} statistics, real bank names, real visa subclass numbers, real fees in INR (NEVER use {YEAR-2} as the headline year)
- Indian audience — use Indian Rupee equivalents and Indian-context examples
- slug: lowercase, hyphens only, no special chars, max 80 chars
- intro: 2 short <p> paragraphs (2-4 sentences each) — separate from body
- excerpt: plain text, 2 sentences, ≤300 chars
- meta_description: 140-160 chars including primary keyword

Now generate and call publish_blog_post with ALL 10 fields populated."""

    return claude_structured(SYSTEM_PROMPT, prompt, POST_SCHEMA)


# ─── PUBLISH TO SUPABASE ──────────────────────────────────────────────────

MIN_BODY_WORDS = 600   # below this we treat the post as broken and skip publishing

def slug_exists(slug: str) -> bool:
    """Check whether a slug is already taken in posts (any status)."""
    try:
        rows = supabase_get("posts", f"select=id&slug=eq.{slug}&limit=1")
        return bool(rows)
    except Exception:
        return False


def slug_too_similar(slug: str, threshold: int = 5) -> bool:
    """
    Reject slugs that look like near-duplicates of existing ones.
    Strips trailing year + variant suffix, compares stems.
    Returns True if base-form already exists with the same first 4 words.
    """
    import re as _re
    # Strip trailing variant suffix and year
    base = _re.sub(r"-\d+$", "", slug)
    base = _re.sub(r"-(20\d\d)(-\d{2})?$", "", base)
    base = base.strip("-")
    # Get first 4 stem words
    head = "-".join(base.split("-")[:5])
    if len(head) < 15: return False  # too short to be meaningful
    try:
        rows = supabase_get("posts", f"select=slug&slug=ilike.{head}*&limit=10")
        return any(r["slug"] != slug for r in rows)
    except Exception:
        return False


def publish_post(post_data: dict, category_slug: str, image: dict | None) -> dict:
    # Log what fields we actually got from Claude (helps diagnose missing data)
    log.info(f"  Claude returned keys: {sorted(post_data.keys())}")

    if not post_data.get("title"):
        raise ValueError(f"Claude omitted 'title'. Got: {list(post_data.keys())}")
    if not post_data.get("slug"):
        raise ValueError(f"Claude omitted 'slug'. Got: {list(post_data.keys())}")

    # ─── SLUG UNIQUENESS GUARDS ──────────────────────────────────────
    # Refuse to publish if this exact slug or a near-duplicate already exists.
    # Better to skip the topic entirely than create a "-2", "-3" sibling
    # that Google will see as duplicate content and refuse to index.
    proposed_slug = post_data["slug"]
    if slug_exists(proposed_slug):
        raise ValueError(
            f"DUPLICATE_SLUG: '{proposed_slug}' already exists. "
            f"Skipping to avoid creating a -2/-3 sibling that Google won't index."
        )
    if slug_too_similar(proposed_slug):
        raise ValueError(
            f"DUPLICATE_SLUG: '{proposed_slug}' is too similar to an existing post. "
            f"Skipping to avoid near-duplicate content."
        )

    # Body might come back under different names depending on model
    body = (
        post_data.get("body")
        or post_data.get("content")
        or post_data.get("article_body")
        or post_data.get("article")
        or ""
    ).strip()
    intro = (post_data.get("intro") or post_data.get("introduction") or "").strip()

    # Validate body has substantial content (Claude sometimes returns intro only)
    import re as _re
    plain_body = _re.sub(r"<[^>]+>", "", body)
    body_words = len(plain_body.split())

    log.info(f"  Body: {len(body)} chars, {body_words} words")
    log.info(f"  Intro: {len(intro)} chars")

    if body_words < MIN_BODY_WORDS:
        raise ValueError(
            f"Body too short ({body_words} words, need {MIN_BODY_WORDS}+). "
            f"Claude returned: {list(post_data.keys())}. "
            f"Body preview: {body[:200]!r}"
        )

    # IMPORTANT: do NOT embed the featured image into content.
    # The blog post page renders featured_image_url separately at the top.
    # Embedding it again here causes the image to appear twice.
    full_content = intro + "\n" + body if intro else body

    record = {
        "title":                 post_data["title"],
        "slug":                  post_data["slug"],
        "content":               full_content,
        "excerpt":               post_data.get("excerpt", "") or "",
        "category_slug":         category_slug,
        "meta_title":            (post_data.get("meta_title") or post_data["title"])[:200],
        "meta_description":      (post_data.get("meta_description") or "")[:200],
        "focus_keyword":         (post_data.get("focus_keyword") or "")[:100],
        "featured_image_url":    image["url"] if image else None,
        "featured_image_alt":    image["alt"] if image else None,
        "featured_image_credit": image["credit"] if image else None,
        "reading_time":          int(post_data.get("reading_time") or 7),
        "tags":                  post_data.get("tags") or [],
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


def trigger_vercel_revalidation(category_slug: str, post_slug: str):
    """
    Tell Vercel to immediately refresh the homepage + category page + new post page,
    so the post appears live without waiting for ISR (1 hour) to expire.
    """
    site_url = os.getenv("SITE_URL", "").rstrip("/")
    secret   = os.getenv("REVALIDATE_SECRET", "")
    if not site_url or not secret:
        log.info("  (skipping revalidation — SITE_URL or REVALIDATE_SECRET not set)")
        return

    try:
        payload = json.dumps({"slug": post_slug, "category": category_slug}).encode()
        req = urllib.request.Request(
            f"{site_url}/api/revalidate",
            data=payload,
            method="POST",
            headers={
                "Content-Type":          "application/json",
                "x-revalidate-secret":   secret,
            },
        )
        with urllib.request.urlopen(req, timeout=10) as res:
            data = json.loads(res.read())
        log.info(f"  ✓ Revalidated: {', '.join(data.get('revalidated', []))}")
    except Exception as e:
        log.warning(f"  Could not revalidate Vercel cache: {e}")


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

    # Generate content + publish — retry up to 3 times if slug collides
    MAX_TRIES = 3
    result = None
    for attempt in range(1, MAX_TRIES + 1):
        log.info(f"Calling Claude to generate content... (attempt {attempt}/{MAX_TRIES})")
        t0 = time.time()
        post_data = generate_post(topic, category_name)
        log.info(f"Content generated in {time.time()-t0:.1f}s — title: {post_data['title']}")
        try:
            result = publish_post(post_data, category_slug, image)
            break
        except ValueError as e:
            if str(e).startswith("DUPLICATE_SLUG") and attempt < MAX_TRIES:
                log.warning(f"  Duplicate slug — picking a different topic and retrying")
                # Re-pick topic, excluding the one that just collided
                used.setdefault(category_slug, []).append(topic)
                category_slug, topic = pick_topic(cycle + attempt, used)
                category_name = category_names.get(category_slug, category_slug)
                continue
            raise

    if not result:
        raise RuntimeError(f"Could not publish after {MAX_TRIES} attempts — all topics produced duplicate slugs")

    post_slug = result.get("slug", post_data["slug"])

    # Mark topic used
    mark_topic_used(category_slug, topic, post_slug)

    # Trigger Vercel cache revalidation so the post appears IMMEDIATELY
    # on the homepage and category page (instead of waiting for ISR).
    log.info("Triggering Vercel revalidation...")
    trigger_vercel_revalidation(category_slug, post_slug)

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
