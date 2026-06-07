"""
EduDhruv — Scholarship Discovery Agent
=========================================
Daily agent that finds 100% funded scholarships at top universities,
researches them via Claude's web search tool, and publishes detailed
blog posts.

Schedule: Once per day at 06:00 IST (00:30 UTC) via GitHub Actions

Algorithm:
  1. Pick the highest-ranked university not yet researched
  2. Ask Claude with web_search tool to find 100% funded scholarships
  3. Claude searches the official university website + 3rd-party sources
  4. Extract structured data: name, eligibility, deadline, amount, courses
  5. Generate a 1500+ word blog post
  6. Save scholarship to `scholarships` table
  7. Save matching post to `posts` table (so it shows in /scholarship)
  8. Mark university as researched
  9. Trigger Vercel revalidation

Environment:
  ANTHROPIC_API_KEY           (sk-ant-...)
  SUPABASE_URL                (https://...)
  SUPABASE_SERVICE_ROLE_KEY   (eyJ...)
  CLAUDE_MODEL                (claude-sonnet-4-5 — web_search needs Sonnet+)
  SITE_URL                    (https://edudhruv.vercel.app)
  REVALIDATE_SECRET           (random secret for cache purge)
"""

import os
import json
import time
import logging
import re
import urllib.request
import urllib.parse
import urllib.error
from datetime import datetime, timezone, date, timedelta
from pathlib import Path

try:
    from dotenv import load_dotenv
    load_dotenv(Path(__file__).parent.parent / ".env.local")
    load_dotenv(Path(__file__).parent / ".env")
except ImportError:
    pass


# ─── CONFIG ──────────────────────────────────────────────────────────────────
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s",
                    datefmt="%Y-%m-%d %H:%M:%S")
log = logging.getLogger("scholarship")

ANTHROPIC_API_KEY    = os.getenv("ANTHROPIC_API_KEY", "")
SUPABASE_URL         = os.getenv("SUPABASE_URL") or os.getenv("NEXT_PUBLIC_SUPABASE_URL", "")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
# Web search requires Sonnet or higher (Haiku doesn't support tools/web-search yet)
CLAUDE_MODEL         = os.getenv("CLAUDE_MODEL_SCHOLARSHIP", "claude-sonnet-4-5")
MAX_TOKENS           = int(os.getenv("MAX_TOKENS", "16000"))
UNSPLASH_KEY         = os.getenv("UNSPLASH_ACCESS_KEY", "")

TODAY = date.today()  # used for deadline validation + prompt context


# ─── SUPABASE HTTP ───────────────────────────────────────────────────────────
def _req(url: str, method: str = "GET", data: dict | None = None, headers: dict | None = None) -> dict:
    body = json.dumps(data).encode() if data else None
    req = urllib.request.Request(url, data=body, method=method, headers=headers or {})
    if body:
        req.add_header("Content-Type", "application/json")
    try:
        with urllib.request.urlopen(req, timeout=300) as res:
            return json.loads(res.read())
    except urllib.error.HTTPError as e:
        err_body = e.read().decode("utf-8", errors="replace")
        log.error(f"HTTP {e.code} on {method} {url}")
        log.error(f"Response: {err_body[:600]}")
        raise


def sb_headers(extra: dict | None = None) -> dict:
    h = {"apikey": SUPABASE_SERVICE_KEY, "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}"}
    if extra: h.update(extra)
    return h


def sb_get(table: str, params: str = "") -> list[dict]:
    return _req(f"{SUPABASE_URL}/rest/v1/{table}?{params}", headers=sb_headers())


def sb_post(table: str, data: dict | list) -> list[dict]:
    return _req(f"{SUPABASE_URL}/rest/v1/{table}",
                method="POST", data=data,
                headers=sb_headers({"Prefer": "return=representation"}))


def sb_patch(table: str, where: str, data: dict) -> list[dict]:
    return _req(f"{SUPABASE_URL}/rest/v1/{table}?{where}",
                method="PATCH", data=data,
                headers=sb_headers({"Prefer": "return=representation"}))


# ─── UNIVERSITY SELECTION ────────────────────────────────────────────────────
def get_next_university() -> dict | None:
    """Pick highest-ranked university not yet researched."""
    rows = sb_get("universities",
                  "select=*&status=eq.pending&order=qs_rank.asc.nullslast&limit=1")
    return rows[0] if rows else None


def mark_researched(university_id: str):
    sb_patch("universities", f"id=eq.{university_id}",
             {"status": "researched", "researched_at": datetime.now(timezone.utc).isoformat()})


def mark_failed(university_id: str, error: str):
    sb_patch("universities", f"id=eq.{university_id}",
             {"status": "failed", "research_error": error[:500]})


# ─── CLAUDE WEB SEARCH ───────────────────────────────────────────────────────
SYSTEM_PROMPT = f"""You are a senior education counsellor at EduDhruv — India's trusted study-abroad guidance platform.

TODAY'S DATE IS {TODAY.isoformat()}. Any scholarship deadline you publish MUST be AFTER this date.

Your job: research 100% funded scholarships at a specific university, find ones that Indian students can apply for, and produce a deeply useful blog post.

Use the web_search tool aggressively. Search the official university website, official scholarship pages, and reputable sources. Verify everything against the official source URL before reporting it.

ABSOLUTE RULES:
1. NEVER publish a scholarship whose application_deadline is before {TODAY.isoformat()} — those are EXPIRED.
2. If the current cycle's deadline has passed, find the NEXT cycle's deadline (usually announced 6-12 months in advance).
3. If you cannot find ANY future deadline for this university's 100% funded scholarship, set success=false and explain.
4. Use the actual upcoming intake (e.g. Fall {TODAY.year + 1} or {TODAY.year + 1}-{TODAY.year + 2} academic year).

Quality standards:
- Indian-context lens (mention INR equivalents, Indian students who can apply, GRE/IELTS scores accepted)
- Specific, verified, useful — not generic
- Disclose if any field is uncertain (say "verify with university") rather than making up numbers
"""


def claude_research(university: dict) -> dict:
    """
    Call Claude with web_search + tool_use to find scholarships and produce structured output.
    Returns a dict with all fields needed for both the scholarships table and a blog post.
    """
    url = f"{university.get('official_website') or 'their official website'}"
    courses_str = ", ".join(university.get("popular_courses") or [])

    next_year = TODAY.year + 1
    prompt = f"""Today is {TODAY.isoformat()}. Research 100% FUNDED scholarships at:

  University: {university['name']}
  Country:    {university['country']}
  City:       {university.get('city', '?')}
  Website:    {url}
  Popular courses: {courses_str}

Steps:
1. Search the web for "100% funded scholarships {university['name']} international students {next_year}"
2. Visit the official scholarship/financial-aid pages on {url}
3. Search for "{university['name']} scholarship deadline {next_year}" to find the upcoming cycle
4. Find scholarships that:
   - Cover 100% of tuition + most/all living expenses (or full tuition only — still counts if amount is significant)
   - Are open to Indian students (international/non-residents)
   - **Have an application_deadline AFTER {TODAY.isoformat()}** (the current open cycle, not the closed one)
5. Pick the BEST ONE that offers the most generous coverage for Indian students.
6. **Verify the deadline date** against the official source — many websites show last year's expired deadline.
   If the official page shows "Applications closed" or a past date, the NEXT cycle deadline is usually published
   on the same page or under "When to apply" / "Important dates" / "{next_year} cycle".
7. Find ONE recent scholarship URL on the university domain to cite.

Then call the `publish_scholarship` tool with all fields filled in.

CRITICAL: If you cannot find a deadline AFTER {TODAY.isoformat()}, do NOT make one up.
Call the tool with success=false and notes="Could not verify a future deadline for this scholarship cycle."

If you cannot find any 100% funded scholarship for this university after searching, call the tool with success=false and explain why in `notes`.
"""

    schema = {
        "type": "object",
        "required": ["success"],
        "properties": {
            "success": {
                "type": "boolean",
                "description": "true if a viable scholarship was found, false if none exist or aren't open to Indians"
            },
            "scholarship_name": {
                "type": "string",
                "description": "Official name of the scholarship (e.g. 'Knight-Hennessy Scholars Program')"
            },
            "coverage_summary": {
                "type": "string",
                "description": "1 sentence summary of what's covered (e.g. 'Full tuition + living stipend + travel + health insurance')"
            },
            "amount_native": {
                "type": "string",
                "description": "Total value per year in local currency (e.g. '$78,000 USD/year' or '£45,000 GBP/year'). Use the official figure."
            },
            "amount_inr": {
                "type": "string",
                "description": "Indian Rupee equivalent (e.g. '₹65,00,000 — ₹70,00,000 per year'). Use current exchange rate."
            },
            "courses_covered": {
                "type": "array",
                "items": {"type": "string"},
                "description": "List of programs/courses this scholarship covers (e.g. ['MS Computer Science', 'MBA', 'PhD'])"
            },
            "eligibility_summary": {
                "type": "string",
                "description": "2-3 sentence summary of who can apply (academic record, citizenship, English requirements, etc)"
            },
            "indian_eligible": {
                "type": "boolean",
                "description": "Whether Indian citizens are explicitly eligible"
            },
            "application_deadline": {
                "type": "string",
                "description": "ISO date 'YYYY-MM-DD' of the application deadline. Use the most recent published deadline."
            },
            "intake": {
                "type": "string",
                "description": "Term it's for (e.g. 'Fall 2026', 'Sep 2026 intake')"
            },
            "official_url": {
                "type": "string",
                "description": "Direct URL to the scholarship page on the university's official website"
            },
            "blog_title": {
                "type": "string",
                "description": "SEO blog title 50-70 chars (e.g. 'Knight-Hennessy 2026: Full Funding at Stanford for Indian Students')"
            },
            "blog_slug": {
                "type": "string",
                "description": "URL slug, lowercase-hyphen, no special chars, max 80 chars"
            },
            "meta_description": {
                "type": "string",
                "description": "SEO meta description, 140-160 characters"
            },
            "focus_keyword": {
                "type": "string",
                "description": "Primary SEO keyword (e.g. 'Knight-Hennessy Scholarship 2026')"
            },
            "intro_html": {
                "type": "string",
                "description": "2 short HTML paragraphs (each <p>...</p>) introducing the scholarship and why Indian students should care"
            },
            "body_html": {
                "type": "string",
                "description": "Main article body as HTML. MUST be 5000+ characters (1200+ words). Use <h2>, <h3>, <p>, <ul>, <strong>. Sections: Overview, What's Covered, Eligibility for Indian Students, Application Process, Required Documents, Selection Criteria, Tips for Indian Applicants, Frequently Asked Questions. End with <h2>Frequently Asked Questions</h2> + 4+ <h3>question</h3><p>answer</p> pairs. Include the official URL as a clear CTA link.",
                "minLength": 4500
            },
            "notes": {
                "type": "string",
                "description": "Free-text notes — anything uncertain, anything to flag for the admin"
            }
        }
    }

    headers = {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
    }
    tools = [
        {"type": "web_search_20250305", "name": "web_search", "max_uses": 8},
        {
            "name":        "publish_scholarship",
            "description": "Save the researched scholarship data and blog post content",
            "input_schema": schema,
        },
    ]
    payload = {
        "model":      CLAUDE_MODEL,
        "max_tokens": MAX_TOKENS,
        "system":     SYSTEM_PROMPT,
        "tools":      tools,
        "tool_choice": {"type": "any"},   # let Claude search first, then call our tool
        "messages":   [{"role": "user", "content": prompt}],
    }

    log.info(f"  Calling {CLAUDE_MODEL} with web_search...")
    res = _req("https://api.anthropic.com/v1/messages",
               method="POST", data=payload, headers=headers)

    # Walk through ALL content blocks — Claude may search several times before publishing
    for block in res.get("content", []):
        if block.get("type") == "tool_use" and block.get("name") == "publish_scholarship":
            log.info("  ✓ Got publish_scholarship tool call")
            return block["input"]

    # If Claude searched but never called the tool, ask it once more to commit
    log.warning("  Claude searched but did not call publish_scholarship; asking again...")
    # Append the assistant's previous reply + a new user nudge
    follow_up = {**payload,
                 "messages": payload["messages"] + [
                     {"role": "assistant", "content": res["content"]},
                     {"role": "user",      "content": "Now call publish_scholarship with everything you found."}
                 ]}
    res2 = _req("https://api.anthropic.com/v1/messages",
                method="POST", data=follow_up, headers=headers)
    for block in res2.get("content", []):
        if block.get("type") == "tool_use" and block.get("name") == "publish_scholarship":
            return block["input"]
    raise ValueError(f"No publish_scholarship tool call. Last response: {json.dumps(res2)[:600]}")


# ─── IMAGE SOURCES ───────────────────────────────────────────────────────────
# Strategy for finding an authentic university image:
#   1. Curated dict — hand-picked Wikimedia URLs for top universities (most reliable)
#   2. Official website og:image — the photo THEY chose to represent themselves
#   3. Wikimedia Commons — strict-filtered search (CC-licensed)
#   4. Unsplash — last resort (generic; not the actual university)
# Once chosen, the URL is cached in universities.image_url so we never re-fetch.

# Hand-curated map of universities → verified-working Wikimedia URLs
# Add more here as you find better images for specific universities.
CURATED_IMAGES: dict[str, dict] = {
    "Massachusetts Institute of Technology": {
        "url": "https://upload.wikimedia.org/wikipedia/commons/3/3d/MIT_Main_Campus_Aerial.jpg",
        "credit": 'Photo: <a href="https://commons.wikimedia.org/wiki/File:MIT_Main_Campus_Aerial.jpg" target="_blank" rel="noopener">DrKenneth via Wikimedia Commons</a> · CC BY 3.0',
    },
    "Stanford University": {
        "url": "https://upload.wikimedia.org/wikipedia/commons/8/83/Stanford_University_Aerial_View.jpg",
        "credit": 'Photo: <a href="https://commons.wikimedia.org/wiki/File:Stanford_University_Aerial_View.jpg" target="_blank" rel="noopener">Wikimedia Commons</a>',
    },
    "Harvard University": {
        "url": "https://upload.wikimedia.org/wikipedia/commons/0/0b/Harvard_University_main_campus_aerial.JPG",
        "credit": 'Photo: <a href="https://commons.wikimedia.org/wiki/File:Harvard_University_main_campus_aerial.JPG" target="_blank" rel="noopener">Wikimedia Commons</a>',
    },
    "National University of Singapore": {
        "url": "https://upload.wikimedia.org/wikipedia/commons/2/2c/NUS_Bukit_Time_Law_Campus_from_the_air._Shot_in_2015.jpg",
        "credit": 'Photo: <a href="https://commons.wikimedia.org/wiki/File:NUS_Bukit_Time_Law_Campus_from_the_air._Shot_in_2015.jpg" target="_blank" rel="noopener">Wikimedia Commons</a>',
    },
    "University of California Berkeley": {
        "url": "https://upload.wikimedia.org/wikipedia/commons/9/9f/University_of_California_Berkeley_aerial_view_by_drone.jpg",
        "credit": 'Photo: <a href="https://commons.wikimedia.org/wiki/File:University_of_California_Berkeley_aerial_view_by_drone.jpg" target="_blank" rel="noopener">Wikimedia Commons</a>',
    },
    "Yale University": {
        "url": "https://upload.wikimedia.org/wikipedia/commons/e/e5/Yale_Central_Campus.jpg",
        "credit": 'Photo: <a href="https://commons.wikimedia.org/wiki/File:Yale_Central_Campus.jpg" target="_blank" rel="noopener">Wikimedia Commons</a>',
    },
    "Cornell University": {
        "url": "https://upload.wikimedia.org/wikipedia/commons/f/f3/Cornell_University_-_Aerial_view_of_Agriculture_campus.jpg",
        "credit": 'Photo: <a href="https://commons.wikimedia.org/wiki/File:Cornell_University_-_Aerial_view_of_Agriculture_campus.jpg" target="_blank" rel="noopener">Wikimedia Commons</a>',
    },
    "ETH Zurich": {
        "url": "https://ethz.ch/etc/designs/ethz/img/header/eth_default_og.jpg",
        "credit": 'Photo: <a href="https://ethz.ch/" target="_blank" rel="noopener">ETH Zurich (official)</a>',
    },
    "University of Oxford": {
        "url": "https://upload.wikimedia.org/wikipedia/commons/3/3d/Radcliffe_Camera%2C_Oxford.jpg",
        "credit": 'Photo: <a href="https://commons.wikimedia.org/wiki/File:Radcliffe_Camera,_Oxford.jpg" target="_blank" rel="noopener">Radcliffe Camera, Oxford via Wikimedia Commons</a>',
    },
    "University of Cambridge": {
        "url": "https://upload.wikimedia.org/wikipedia/commons/4/46/Kings_College_Cambridge_Chapel_from_the_river.jpg",
        "credit": 'Photo: <a href="https://commons.wikimedia.org/wiki/File:Kings_College_Cambridge_Chapel_from_the_river.jpg" target="_blank" rel="noopener">King\'s College Chapel, Cambridge via Wikimedia Commons</a>',
    },
    "Imperial College London": {
        "url": "https://upload.wikimedia.org/wikipedia/commons/9/97/Royal_School_of_Mines_Imperial_College_London_2020_01.jpg",
        "credit": 'Photo: <a href="https://commons.wikimedia.org/wiki/File:Royal_School_of_Mines_Imperial_College_London_2020_01.jpg" target="_blank" rel="noopener">Royal School of Mines, Imperial College London via Wikimedia Commons</a>',
    },
}

# Filter out non-campus images returned by Commons search
_BAD_KEYWORDS = ("logo", "seal", "crest", "map", "diagram", "plan", "chart", "graph",
                 "_old", "historical", "vintage", "1800", "blueprint", "drawing",
                 "illustration", "sketch", "painting", "portrait")

# Match historical year patterns like "_1924" or "1880s"
_HISTORICAL_YEAR_RE = re.compile(r"(?:^|[^0-9])(18\d\d|19[0-7]\d)s?(?:[^0-9]|$)")

# Common university name → key tokens that must appear in the filename for it to be relevant.
# E.g. "University of Oxford" → ["oxford"] (NOT "university" — too generic)
def _key_tokens(name: str) -> list[str]:
    """Extract distinguishing tokens from a university name."""
    stopwords = {"university", "of", "the", "and", "college", "school",
                 "institute", "academy", "national"}
    tokens = [t.lower() for t in re.findall(r"[A-Za-z]+", name)
              if len(t) > 2 and t.lower() not in stopwords]
    # Also add the acronym (MIT, NUS, ETH...) so "Massachusetts Institute of Technology" → ["MIT", "Massachusetts", "Technology"]
    caps = "".join(c for c in name if c.isupper())
    if 2 <= len(caps) <= 5:
        tokens.append(caps.lower())
    return tokens


def _matches_university(filename: str, tokens: list[str]) -> bool:
    """Does this filename actually reference the target university?"""
    lower = filename.lower()
    return any(t in lower for t in tokens)


def _is_good_campus_photo(filename: str, tokens: list[str]) -> bool:
    """Filter: must be a JPG, must reference the university, must not be a map/logo/historical."""
    lower = filename.lower()
    if not (lower.endswith(".jpg") or lower.endswith(".jpeg")):
        return False  # skip SVG/PNG logos
    if any(bad in lower for bad in _BAD_KEYWORDS):
        return False
    if _HISTORICAL_YEAR_RE.search(lower):
        return False  # skip 19XX-pre-1980 photos
    if tokens and not _matches_university(lower, tokens):
        return False
    return True


def wikimedia_commons_image(query: str, university_name: str | None = None) -> dict | None:
    """Search Wikimedia Commons for a CC-licensed campus photo of the named university."""
    tokens = _key_tokens(university_name) if university_name else []
    try:
        params = urllib.parse.urlencode({
            "action": "query",
            "format": "json",
            "prop": "imageinfo",
            "generator": "search",
            "iiprop": "url|extmetadata|size",
            "gsrnamespace": 6,
            "gsrsearch": query,
            "gsrlimit": 20,
        })
        req = urllib.request.Request(
            f"https://commons.wikimedia.org/w/api.php?{params}",
            headers={"User-Agent": "EduDhruvScholarshipAgent/1.0 (edudruv@gmail.com)"},
        )
        with urllib.request.urlopen(req, timeout=10) as res:
            data = json.loads(res.read())

        pages = data.get("query", {}).get("pages", {}) or {}
        sorted_pages = sorted(pages.values(), key=lambda p: p.get("index", 99))

        for page in sorted_pages:
            title = page.get("title", "")
            if not _is_good_campus_photo(title, tokens):
                continue
            info = (page.get("imageinfo") or [{}])[0]
            url = info.get("url")
            # Skip tiny images
            if (info.get("width") or 0) < 800:
                continue
            md  = info.get("extmetadata", {})
            license_name = md.get("LicenseShortName", {}).get("value", "")
            artist_html  = md.get("Artist", {}).get("value", "Wikimedia Commons")
            artist_text = re.sub(r"<[^>]+>", "", artist_html).strip()[:80]

            log.info(f"  ✓ Featured image: Wikimedia Commons — {title[:80]}")
            return {
                "url": url,
                "alt": title.replace("File:", "").rsplit(".", 1)[0].replace("_", " "),
                "credit": (
                    f'Photo: <a href="https://commons.wikimedia.org/wiki/{urllib.parse.quote(title)}" '
                    f'target="_blank" rel="noopener">{artist_text or "Wikimedia Commons"}</a> · {license_name}'
                ),
            }
        return None
    except Exception as e:
        log.warning(f"  Wikimedia Commons error: {e}")
        return None


def wikipedia_main_image(university_name: str) -> dict | None:
    """Fetch the canonical pageimage from the university's Wikipedia article."""
    try:
        title = university_name.replace(" ", "_")
        params = urllib.parse.urlencode({
            "action": "query",
            "format": "json",
            "prop": "pageimages",
            "piprop": "original",
            "titles": title,
        })
        req = urllib.request.Request(
            f"https://en.wikipedia.org/w/api.php?{params}",
            headers={"User-Agent": "EduDhruvScholarshipAgent/1.0 (edudruv@gmail.com)"},
        )
        with urllib.request.urlopen(req, timeout=10) as res:
            data = json.loads(res.read())
        for page in data.get("query", {}).get("pages", {}).values():
            orig = page.get("original", {})
            url = orig.get("source")
            if url and (url.lower().endswith(".jpg") or url.lower().endswith(".jpeg")):
                log.info(f"  ✓ Featured image: Wikipedia pageimage for {university_name}")
                return {
                    "url": url,
                    "alt": f"{university_name} campus",
                    "credit": f'Photo: <a href="https://en.wikipedia.org/wiki/{title}" target="_blank" rel="noopener">Wikipedia</a>',
                }
        return None
    except Exception as e:
        log.warning(f"  Wikipedia pageimage error: {e}")
        return None


def website_og_image(website_url: str, university_name: str) -> dict | None:
    """Pull og:image from the university's official homepage."""
    if not website_url:
        return None
    try:
        req = urllib.request.Request(website_url, headers={
            "User-Agent": "Mozilla/5.0 (compatible; EduDhruvBot/1.0; +https://edudhruv.com)",
            "Accept": "text/html,application/xhtml+xml",
        })
        with urllib.request.urlopen(req, timeout=10) as res:
            # Read only first 500KB — og:image is in <head>
            html = res.read(500_000).decode("utf-8", errors="replace")

        # Try og:image (property=og:image content=URL OR content=URL property=og:image)
        patterns = [
            r'<meta[^>]+property=["\']og:image["\'][^>]+content=["\']([^"\'>]+)["\']',
            r'<meta[^>]+content=["\']([^"\'>]+)["\'][^>]+property=["\']og:image["\']',
            r'<meta[^>]+name=["\']twitter:image["\'][^>]+content=["\']([^"\'>]+)["\']',
        ]
        img_url = None
        for p in patterns:
            m = re.search(p, html, re.I)
            if m:
                img_url = m.group(1).strip()
                break

        if not img_url:
            return None

        # Resolve relative URLs against the homepage
        img_url = urllib.parse.urljoin(website_url, img_url)

        # Sanity check — must be an image URL, not an SVG seal
        if any(bad in img_url.lower() for bad in ("logo", "icon", ".svg")):
            log.info(f"  Website og:image looks like a logo — skipping: {img_url[:80]}")
            return None

        log.info(f"  ✓ Featured image: {university_name}'s own website og:image")
        host = urllib.parse.urlparse(website_url).netloc
        return {
            "url": img_url,
            "alt": f"{university_name} campus",
            "credit": f'Image courtesy of <a href="{website_url}" target="_blank" rel="noopener">{host}</a>',
        }
    except Exception as e:
        log.warning(f"  Could not fetch og:image from {website_url}: {e}")
        return None


def unsplash_image(query: str) -> dict | None:
    """Last-resort: random Unsplash image (not the actual university)."""
    if not UNSPLASH_KEY:
        return None
    try:
        q = urllib.parse.quote(f"{query} university campus")
        url = f"https://api.unsplash.com/photos/random?query={q}&orientation=landscape&content_filter=high"
        req = urllib.request.Request(url, headers={"Authorization": f"Client-ID {UNSPLASH_KEY}"})
        with urllib.request.urlopen(req, timeout=10) as res:
            data = json.loads(res.read())
        log.info(f"  ✓ Featured image: Unsplash fallback for '{query}'")
        return {
            "url": data["urls"]["regular"],
            "alt": data.get("alt_description") or query,
            "credit": (
                f'Photo by <a href="{data["user"]["links"]["html"]}?utm_source=edudhruv&utm_medium=referral" '
                f'target="_blank" rel="noopener">{data["user"]["name"]}</a> on Unsplash'
            ),
        }
    except Exception as e:
        log.warning(f"  Unsplash error: {e}")
        return None


def get_university_image(university: dict) -> dict | None:
    """
    Try multiple sources in order of authenticity:
      0. Cached image_url in DB (set previously OR overridden by admin)
      1. Hand-curated CURATED_IMAGES dict (top universities)
      2. og:image from official website (the photo THEY chose)
      3. Wikimedia Commons strict search
      4. Wikipedia article pageimage (often a seal — checked last)
      5. Unsplash fallback (generic)
    """
    name = university["name"]
    country = university.get("country", "")

    # 0. Cached (or admin-overridden)
    if university.get("image_url"):
        log.info(f"  ✓ Using cached image for {name}")
        return {
            "url": university["image_url"],
            "alt": f"{name} campus",
            "credit": university.get("image_credit"),
        }

    # 1. Curated dict
    if name in CURATED_IMAGES:
        log.info(f"  ✓ Using curated image for {name}")
        c = CURATED_IMAGES[name]
        return {"url": c["url"], "alt": f"{name} campus", "credit": c["credit"]}

    # 2. Official website og:image
    img = website_og_image(university.get("official_website", ""), name)
    if img:
        return img

    # 3. Wikimedia Commons strict search
    log.info(f"  Searching Wikimedia Commons for {name}...")
    for q in [f"{name} campus aerial", f"{name} campus", f"{name} main building", name]:
        img = wikimedia_commons_image(q, university_name=name)
        if img:
            return img

    # 4. Wikipedia pageimage (often a seal but worth trying)
    img = wikipedia_main_image(name)
    if img:
        return img

    # 5. Unsplash fallback
    log.info(f"  Falling back to Unsplash for {name}")
    return unsplash_image(f"{name} {country}")


def cache_university_image(university_id: str, img: dict) -> None:
    """Save the chosen image to universities.image_url so we never re-fetch."""
    try:
        sb_patch("universities", f"id=eq.{university_id}",
                 {"image_url": img["url"], "image_credit": img.get("credit") or ""})
    except Exception as e:
        # Column may not exist yet (run migration-university-images.sql) — non-fatal
        log.warning(f"  Could not cache image to universities table: {e}")


# ─── DEADLINE VALIDATION ─────────────────────────────────────────────────────
def validate_deadline(deadline_str: str | None) -> tuple[bool, str]:
    """
    Returns (is_valid, reason). A valid deadline is:
      - A parseable ISO date YYYY-MM-DD
      - In the future (after today)
    Empty/null is also rejected — we don't want "rolling" without a date.
    """
    if not deadline_str:
        return False, "missing deadline"
    try:
        dl = date.fromisoformat(deadline_str.strip()[:10])
    except (ValueError, AttributeError):
        return False, f"unparseable date '{deadline_str}'"
    if dl < TODAY:
        return False, f"deadline {dl.isoformat()} is in the PAST (today is {TODAY.isoformat()})"
    if dl > TODAY + timedelta(days=730):
        return False, f"deadline {dl.isoformat()} is suspiciously far in the future"
    return True, ""


# ─── SAVE TO DB ──────────────────────────────────────────────────────────────
def save_scholarship_and_post(university: dict, sch: dict) -> str:
    """Save scholarship row and blog post row. Returns post slug."""
    slug = sch["blog_slug"] or sch["scholarship_name"].lower().replace(" ", "-")
    slug = re.sub(r"[^a-z0-9-]", "", slug)[:80]

    # 1. Insert into scholarships table
    sch_row = {
        "university_id":       university["id"],
        "university_name":     university["name"],
        "country":             university["country"],
        "scholarship_name":    sch["scholarship_name"],
        "coverage_percentage": 100,
        "amount_inr":          sch.get("amount_inr", ""),
        "amount_native":       sch.get("amount_native", ""),
        "courses_covered":     sch.get("courses_covered", []),
        "eligibility_summary": sch.get("eligibility_summary", ""),
        "indian_eligible":     bool(sch.get("indian_eligible", True)),
        "application_deadline": sch.get("application_deadline"),
        "intake":              sch.get("intake", ""),
        "official_url":        sch.get("official_url", ""),
        "post_slug":           slug,
        "status":              "active",
    }
    sb_post("scholarships", [sch_row])

    # 2. Build the full blog post HTML
    intro = sch.get("intro_html", "")
    body  = sch.get("body_html", "")

    # Quick-facts info box at top of post
    facts_box = f"""<div style="background:#EBF7FD;border-left:4px solid #3AAFE5;padding:18px 22px;margin:24px 0;border-radius:0 8px 8px 0;">
  <h3 style="margin:0 0 12px;color:#3AAFE5;font-size:1.05rem;">📊 Quick Facts</h3>
  <table style="width:100%;font-size:0.92rem;border-collapse:collapse;">
    <tr><td style="padding:4px 12px 4px 0;color:#555;width:35%;"><strong>University</strong></td><td>{university['name']}</td></tr>
    <tr><td style="padding:4px 12px 4px 0;color:#555;"><strong>Country</strong></td><td>{university['country']}</td></tr>
    <tr><td style="padding:4px 12px 4px 0;color:#555;"><strong>Coverage</strong></td><td>{sch.get('coverage_summary', '100% funded')}</td></tr>
    <tr><td style="padding:4px 12px 4px 0;color:#555;"><strong>Amount</strong></td><td>{sch.get('amount_native', '—')} ({sch.get('amount_inr', '')})</td></tr>
    <tr><td style="padding:4px 12px 4px 0;color:#555;"><strong>Deadline</strong></td><td>{sch.get('application_deadline', 'See official page')}</td></tr>
    <tr><td style="padding:4px 12px 4px 0;color:#555;"><strong>Intake</strong></td><td>{sch.get('intake', '—')}</td></tr>
    <tr><td style="padding:4px 12px 4px 0;color:#555;vertical-align:top;"><strong>Courses</strong></td><td>{', '.join(sch.get('courses_covered', []) or ['Multiple'])}</td></tr>
    <tr><td style="padding:4px 12px 4px 0;color:#555;"><strong>Official link</strong></td><td><a href="{sch.get('official_url', '#')}" target="_blank" rel="noopener" style="color:#3AAFE5;font-weight:600;">View on {university['name']} website →</a></td></tr>
  </table>
</div>"""

    full_content = intro + "\n" + facts_box + "\n" + body

    # 3. Fetch an authentic university image (cached → curated → website → Commons → Unsplash)
    image = get_university_image(university)
    if image and not university.get("image_url"):
        # First time we found this image — cache it for next run + admin override
        cache_university_image(university["id"], image)

    # 4. Save the blog post
    post = {
        "title":                sch["blog_title"],
        "slug":                 slug,
        "content":              full_content,
        "excerpt":              sch.get("meta_description", "")[:280],
        "category_slug":        "scholarship",
        "meta_title":           sch["blog_title"][:70],
        "meta_description":     sch.get("meta_description", "")[:160],
        "focus_keyword":        sch.get("focus_keyword", "")[:100],
        "featured_image_url":   image["url"]    if image else None,
        "featured_image_alt":   image["alt"]    if image else sch["scholarship_name"],
        "featured_image_credit": image["credit"] if image else None,
        "reading_time":         8,
        "tags":                 ["scholarship", "100% funded", university["country"], university["name"]],
        "status":               "published",
    }
    sb_post("posts", [post])
    log.info(f"  ✓ Published post: /scholarship/{slug}")
    return slug


# ─── REVALIDATE ──────────────────────────────────────────────────────────────
def trigger_revalidation(slug: str):
    site_url = os.getenv("SITE_URL", "").rstrip("/")
    secret   = os.getenv("REVALIDATE_SECRET", "")
    if not site_url or not secret:
        log.info("  (no revalidation — SITE_URL or REVALIDATE_SECRET not set)")
        return
    try:
        payload = json.dumps({
            "slug":     slug,
            "category": "scholarship",
            "paths":    ["/", "/sitemap.xml", "/scholarships"]
        }).encode()
        req = urllib.request.Request(f"{site_url}/api/revalidate", data=payload, method="POST",
            headers={"Content-Type": "application/json", "x-revalidate-secret": secret})
        with urllib.request.urlopen(req, timeout=10) as r:
            log.info(f"  ✓ Revalidated: {json.loads(r.read()).get('revalidated', [])}")
    except Exception as e:
        log.warning(f"  Could not revalidate: {e}")


# ─── MAIN ────────────────────────────────────────────────────────────────────
def main():
    log.info("═" * 60)
    log.info("EduDhruv Scholarship Discovery Agent")
    log.info(f"Model: {CLAUDE_MODEL} | Time: {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    log.info("═" * 60)

    # Env check
    for k in ["ANTHROPIC_API_KEY", "SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"]:
        if not os.getenv(k) and not (k == "SUPABASE_URL" and SUPABASE_URL):
            log.error(f"Missing env var: {k}")
            raise SystemExit(1)

    # 1. Pick next university
    uni = get_next_university()
    if not uni:
        log.info("✓ No pending universities — nothing to do.")
        return

    log.info(f"University: {uni['name']} ({uni['country']}, QS #{uni.get('qs_rank', '?')})")

    # 2. Research it
    try:
        sch = claude_research(uni)
    except Exception as e:
        log.error(f"  Research failed: {e}")
        mark_failed(uni["id"], str(e))
        raise

    if not sch.get("success"):
        log.warning(f"  No viable scholarship found: {sch.get('notes', '?')}")
        sb_patch("universities", f"id=eq.{uni['id']}",
                 {"status": "skipped", "research_error": sch.get("notes", "")[:500]})
        return

    log.info(f"  ✓ Found: {sch.get('scholarship_name', '?')}")
    log.info(f"  Deadline: {sch.get('application_deadline', '?')}")

    # 3. Validate the deadline is in the future — refuse expired scholarships
    ok, why = validate_deadline(sch.get("application_deadline"))
    if not ok:
        msg = f"REJECTED — {why}"
        log.warning(f"  {msg}")
        sb_patch("universities", f"id=eq.{uni['id']}",
                 {"status": "skipped", "research_error": msg[:500]})
        log.info(f"  University marked as skipped. Re-run will pick the next one.")
        return

    # 4. Save
    slug = save_scholarship_and_post(uni, sch)

    # 5. Mark done
    mark_researched(uni["id"])

    # 6. Refresh cache
    trigger_revalidation(slug)

    log.info(f"✅ Done — https://edudhruv.com/scholarship/{slug}")


if __name__ == "__main__":
    import traceback
    try:
        main()
    except SystemExit:
        raise
    except Exception as e:
        log.error("═" * 60)
        log.error(f"AGENT FAILED: {type(e).__name__}: {e}")
        log.error(traceback.format_exc())
        log.error("═" * 60)
        raise SystemExit(1)
