"""
Long-tail topic discovery via Google Autocomplete.
========================================================================
Instead of writing about broad, hyper-competitive topics ("Top 10
Universities in Canada") that a young site can never rank for, this pulls
the REAL long-tail search queries people type — using Google's public
autocomplete endpoint. Those specific, lower-competition queries are what
a new site can actually rank for.

Why autocomplete, not pytrends / the Trends API:
  - No API key, no auth.
  - Reliable public endpoint (the same one your browser's search bar uses),
    unlike pytrends which Google frequently rate-limits and breaks.
  - Returns actual user queries = ready-made long-tail keywords with real
    search demand.

Every function here is fail-safe: on any error it returns an empty list so
the caller falls back to its hardcoded topic bank. It never raises.

Standalone test:
  python automation/trends.py
"""

import json
import logging
import urllib.parse
import urllib.request

log = logging.getLogger("trends")

# India + English, so suggestions match the site's audience (Indian students).
_SUGGEST_URL = "https://suggestqueries.google.com/complete/search"

# Seed phrases per category. Each seed is fed to autocomplete; Google returns
# the popular completions (real searches). Trailing space matters — it tells
# Google to complete the NEXT word.
_SEEDS: dict[str, list[str]] = {
    "indian-students-abroad": [
        "study abroad for indian students ",
        "part time jobs for indian students in ",
        "life for indian students in ",
        "cost of studying in ",
    ],
    "top-universities": [
        "best universities in ",
        "top universities for indian students in ",
        "cheapest universities in ",
    ],
    "scholarship": [
        "scholarships for indian students in ",
        "fully funded scholarship for ",
        "how to get scholarship for ",
    ],
    "education-loan": [
        "education loan for abroad ",
        "education loan without collateral for ",
        "student loan for ",
        "best bank for education loan ",
    ],
    "student-accommodation": [
        "student accommodation in ",
        "cheap student housing in ",
        "cost of living for students in ",
    ],
    "travel-essentials": [
        "student visa for ",
        "student visa requirements for ",
        "how to apply student visa ",
    ],
}


# ─── GOOGLE TRENDS (opportunistic, timely) ────────────────────────────────
# Study-abroad DESTINATION countries + India (the source). Not "every country
# on earth" — those are the geos whose education trends matter to an Indian
# study-abroad audience. Each is one Google Trends daily-RSS request.
_TREND_GEOS = ["IN", "US", "GB", "CA", "AU", "DE", "IE", "NZ", "SG", "NL", "FR"]

# A trend only counts if it clearly relates to studying abroad — strict, so we
# skip general noise ("college football", "school shooting", sports, movies).
_TREND_RELEVANT = (
    "student visa", "study abroad", "studying abroad", "study permit",
    "scholarship", "university admission", "college admission", "study visa",
    "ielts", "toefl", "gre", "gmat", "pte", "duolingo english", "sat exam",
    "student loan", "education loan", "f-1 visa", "f1 visa", "graduate route",
    "post study work", "opt visa", "stem opt", "express entry", "student permit",
    "international student", "intake", "student housing", "tuition fee",
)


def _trends_rss(geo: str) -> list[str]:
    """Return today's trending search terms for one country (empty on error)."""
    try:
        req = urllib.request.Request(
            f"https://trends.google.com/trending/rss?geo={geo}",
            headers={"User-Agent": "Mozilla/5.0 (compatible; EduDhruvBot/1.0)"},
        )
        with urllib.request.urlopen(req, timeout=12) as res:
            xml = res.read().decode("utf-8", errors="replace")
        import re as _re
        # Each <item> has the trend term in its <title>; skip the channel title.
        return _re.findall(r"<item>.*?<title>(.*?)</title>", xml, _re.S)
    except Exception as e:
        log.warning(f"trends RSS failed for {geo}: {e}")
        return []


def trending_topics(geos: list[str] | None = None, limit: int = 10) -> list[str]:
    """
    Study-abroad-relevant terms trending TODAY across destination countries.
    Usually returns [] (most days nothing education-related trends) — that's
    intended: it's an opportunistic bonus, not the primary topic source.
    """
    seen: set[str] = set()
    out: list[str] = []
    for geo in (geos or _TREND_GEOS):
        for term in _trends_rss(geo):
            low = term.strip().lower()
            if low in seen or len(low) < 4:
                continue
            if not any(k in low for k in _TREND_RELEVANT):
                continue
            seen.add(low)
            out.append(term.strip())
            if len(out) >= limit:
                return out
    return out


def trend_to_topic(trend: str) -> str:
    """Frame a raw trending term into an on-brand, rankable blog topic."""
    import datetime
    year = datetime.datetime.now().year + 1
    return f"{trend.strip().title()}: What Indian Students Planning to Study Abroad Should Know {year}"


def _suggest(query: str) -> list[str]:
    """Hit Google autocomplete for one seed; return the raw suggestions."""
    try:
        params = urllib.parse.urlencode({
            "client": "firefox",   # returns clean JSON: ["q", ["s1","s2",...]]
            "q": query,
            "hl": "en",
            "gl": "in",            # India
        })
        req = urllib.request.Request(
            f"{_SUGGEST_URL}?{params}",
            headers={"User-Agent": "Mozilla/5.0 (compatible; EduDhruvBot/1.0)"},
        )
        with urllib.request.urlopen(req, timeout=10) as res:
            data = json.loads(res.read().decode("utf-8", errors="replace"))
        return data[1] if isinstance(data, list) and len(data) > 1 else []
    except Exception as e:
        log.warning(f"autocomplete failed for {query!r}: {e}")
        return []


def discover_longtail_topics(category_slug: str, limit: int = 25) -> list[str]:
    """
    Return a de-duplicated list of long-tail search queries for a category,
    filtered to ones relevant to Indian students studying abroad. Empty list
    on failure (caller falls back to its hardcoded topic bank).
    """
    seeds = _SEEDS.get(category_slug)
    if not seeds:
        return []

    # Keep suggestions that clearly relate to studying/education abroad, so we
    # don't drift off-topic (autocomplete can return noise).
    RELEVANT = ("student", "study", "universit", "scholarship", "loan",
                "visa", "abroad", "college", "tuition", "accommodation",
                "housing", "course", "fees", "ielts", "gre", "gmat")

    seen: set[str] = set()
    out: list[str] = []
    for seed in seeds:
        for s in _suggest(seed):
            s = s.strip()
            low = s.lower()
            if low in seen:
                continue
            if len(s) < 15:                      # too broad / single word
                continue
            if not any(k in low for k in RELEVANT):
                continue
            seen.add(low)
            out.append(s)
            if len(out) >= limit:
                return out
    return out


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format="%(message)s")
    for cat in _SEEDS:
        print(f"\n=== {cat} ===")
        for t in discover_longtail_topics(cat, limit=8):
            print(f"  • {t}")
