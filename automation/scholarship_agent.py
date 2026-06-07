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
import urllib.error
from datetime import datetime, timezone
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
SYSTEM_PROMPT = """You are a senior education counsellor at EduDhruv — India's trusted study-abroad guidance platform.

Your job: research 100% funded scholarships at a specific university, find ones that Indian students can apply for, and produce a deeply useful blog post.

Use the web_search tool aggressively. Search the official university website, official scholarship pages, and reputable sources. Verify everything against the official source URL before reporting it.

Quality standards:
- Indian-context lens (mention INR equivalents, Indian students who can apply, GRE/IELTS scores accepted)
- 2025/2026 data (current cycle only — ignore anything older)
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

    prompt = f"""Research 100% FUNDED scholarships at:

  University: {university['name']}
  Country:    {university['country']}
  City:       {university.get('city', '?')}
  Website:    {url}
  Popular courses: {courses_str}

Steps:
1. Search the web for "100% funded scholarships {university['name']} international students 2026"
2. Visit the official scholarship/financial-aid pages on {url}
3. Find scholarships that:
   - Cover 100% of tuition + most/all living expenses (or full tuition only — still counts if amount is significant)
   - Are open to Indian students (international/non-residents)
   - Have an upcoming 2025-2026 or 2026-2027 deadline
4. Pick the BEST ONE that offers the most generous coverage for Indian students.
5. Verify the deadline, amount, and eligibility against the official source.
6. Find ONE recent scholarship URL on the university domain to cite.

Then call the `publish_scholarship` tool with all fields filled in.

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

    # 3. Save the blog post
    post = {
        "title":                sch["blog_title"],
        "slug":                 slug,
        "content":              full_content,
        "excerpt":              sch.get("meta_description", "")[:280],
        "category_slug":        "scholarship",
        "meta_title":           sch["blog_title"][:70],
        "meta_description":     sch.get("meta_description", "")[:160],
        "focus_keyword":        sch.get("focus_keyword", "")[:100],
        "featured_image_url":   None,   # will fall back to default header
        "featured_image_alt":   sch["scholarship_name"],
        "featured_image_credit": None,
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

    # 3. Save
    slug = save_scholarship_and_post(uni, sch)

    # 4. Mark done
    mark_researched(uni["id"])

    # 5. Refresh cache
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
