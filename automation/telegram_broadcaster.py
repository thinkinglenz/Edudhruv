"""
EduDhruv Telegram Broadcaster
==============================

Posts new scholarships from the Supabase `scholarships` table to a
Telegram channel. Tracks last-broadcast timestamp so we only send
genuinely new entries.

Setup (one-time):
  1. Create a Telegram bot via @BotFather → get TELEGRAM_BOT_TOKEN
  2. Create a public Telegram channel (e.g. @EduDhruvScholarships)
  3. Add the bot as an admin in your channel
  4. Run once with --get-chat-id to find the channel ID, OR use @<channel_username>
  5. Add to GitHub Secrets:
       TELEGRAM_BOT_TOKEN  = 1234567890:ABC...
       TELEGRAM_CHANNEL_ID = @EduDhruvScholarships  (or -1001234567890)
  6. The .github/workflows/telegram.yml cron runs every 6 hours

Free, no Telegram premium, no rate limits at our volume.
"""

import os, json, time, urllib.request, urllib.parse, urllib.error
from datetime import datetime, timezone
from pathlib import Path

try:
    from dotenv import load_dotenv
    load_dotenv(Path(__file__).parent.parent / ".env.local")
except ImportError:
    pass

import logging
logging.basicConfig(level=logging.INFO,
                    format="%(asctime)s [%(levelname)s] %(message)s",
                    datefmt="%Y-%m-%d %H:%M:%S")
log = logging.getLogger("telegram")

BOT_TOKEN    = os.getenv("TELEGRAM_BOT_TOKEN", "")
CHANNEL_ID   = os.getenv("TELEGRAM_CHANNEL_ID", "")
SUPABASE_URL = (os.getenv("SUPABASE_URL") or os.getenv("NEXT_PUBLIC_SUPABASE_URL", "")).rstrip("/")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
SITE_URL     = os.getenv("SITE_URL", "https://www.edudhruv.com").rstrip("/")

# State file — tracks the last scholarship id we broadcast
STATE_FILE = Path(__file__).parent / ".telegram_state.json"


def _http(url, method="GET", data=None, headers=None):
    body = json.dumps(data).encode() if data else None
    req = urllib.request.Request(url, data=body, method=method, headers=headers or {})
    if body: req.add_header("Content-Type", "application/json")
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        log.error(f"HTTP {e.code} on {url[:80]}")
        log.error(f"Body: {e.read().decode('utf-8', 'replace')[:300]}")
        raise


def supabase_get(table, params):
    return _http(f"{SUPABASE_URL}/rest/v1/{table}?{params}",
                 headers={"apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}"})


def get_state():
    if STATE_FILE.exists():
        try: return json.loads(STATE_FILE.read_text())
        except: pass
    return {"last_broadcast_id": None, "last_broadcast_at": None}


def save_state(state):
    STATE_FILE.write_text(json.dumps(state, indent=2))


def country_flag(country: str) -> str:
    """Simple emoji flag for top countries."""
    flags = {
        "USA": "🇺🇸", "United States": "🇺🇸",
        "UK": "🇬🇧", "United Kingdom": "🇬🇧",
        "Canada": "🇨🇦", "Australia": "🇦🇺",
        "Germany": "🇩🇪", "Singapore": "🇸🇬",
        "Netherlands": "🇳🇱", "Switzerland": "🇨🇭",
        "France": "🇫🇷", "Japan": "🇯🇵",
        "China": "🇨🇳", "Hong Kong": "🇭🇰",
    }
    for k, v in flags.items():
        if k.lower() in country.lower():
            return v
    return "🌍"


def format_deadline(iso):
    if not iso: return "Rolling deadline"
    try:
        d = datetime.fromisoformat(iso.replace("Z", "+00:00"))
        days = (d.date() - datetime.now(timezone.utc).date()).days
        date_str = d.strftime("%d %b %Y")
        if days < 0: return f"⏰ {date_str} (closed)"
        if days == 0: return f"⏰ {date_str} (TODAY!)"
        if days <= 30: return f"⚠️ {date_str} ({days}d left)"
        return f"📅 {date_str} ({days}d left)"
    except: return "Rolling deadline"


def build_message(sch: dict) -> str:
    flag       = country_flag(sch["country"])
    uni        = sch["university_name"]
    name       = sch["scholarship_name"]
    amount     = sch.get("amount_inr") or sch.get("amount_native") or ""
    deadline   = format_deadline(sch.get("application_deadline"))
    courses    = sch.get("courses_covered") or []
    eligibility = (sch.get("eligibility_summary") or "")[:250]
    slug       = sch.get("post_slug")
    full_url   = f"{SITE_URL}/scholarship/{slug}" if slug else SITE_URL

    msg = (
        f"💯 *100% FUNDED SCHOLARSHIP*\n"
        f"\n"
        f"{flag} *{name}*\n"
        f"🎓 _{uni}_\n"
        f"\n"
    )
    if amount:   msg += f"💰 *Amount:* {amount}\n"
    if deadline: msg += f"{deadline}\n"
    if courses:  msg += f"📚 *Courses:* {', '.join(courses[:4])}\n"
    msg += "\n"
    if eligibility:
        msg += f"✅ *Eligible:* {eligibility}\n\n"
    msg += f"👉 [Full guide on EduDhruv]({full_url})\n"
    msg += f"\n#Scholarship #StudyAbroad #IndianStudents"
    return msg


def send_telegram(message: str, photo_url: str | None = None) -> bool:
    if not BOT_TOKEN or not CHANNEL_ID:
        log.error("Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHANNEL_ID env var")
        return False

    api_base = f"https://api.telegram.org/bot{BOT_TOKEN}"

    try:
        if photo_url:
            data = {
                "chat_id":    CHANNEL_ID,
                "photo":      photo_url,
                "caption":    message[:1024],   # Telegram photo caption limit
                "parse_mode": "Markdown",
            }
            r = _http(f"{api_base}/sendPhoto", method="POST", data=data)
        else:
            data = {
                "chat_id":    CHANNEL_ID,
                "text":       message,
                "parse_mode": "Markdown",
                "disable_web_page_preview": False,
            }
            r = _http(f"{api_base}/sendMessage", method="POST", data=data)

        ok = r.get("ok", False)
        if not ok:
            log.error(f"Telegram error: {r}")
        return ok
    except Exception as e:
        log.error(f"Send error: {e}")
        return False


def get_new_scholarships(last_id, limit=5):
    """Get scholarships created after last_id (or top N if first run)."""
    params = "select=*&status=eq.active&order=created_at.desc&limit=" + str(limit)
    rows = supabase_get("scholarships", params)
    if not last_id:
        return list(reversed(rows))   # First run — post oldest first
    # Filter to only those created AFTER last broadcast
    new = []
    for r in rows:
        if r["id"] == last_id: break
        new.append(r)
    return list(reversed(new))


def main():
    log.info("═" * 60)
    log.info("EduDhruv Telegram Broadcaster")
    log.info(f"Channel: {CHANNEL_ID}")
    log.info("═" * 60)

    for k, v in {"TELEGRAM_BOT_TOKEN": BOT_TOKEN, "TELEGRAM_CHANNEL_ID": CHANNEL_ID,
                 "SUPABASE_URL": SUPABASE_URL, "SUPABASE_SERVICE_ROLE_KEY": SUPABASE_KEY}.items():
        if not v:
            log.error(f"Missing required env var: {k}")
            raise SystemExit(1)

    state    = get_state()
    last_id  = state.get("last_broadcast_id")
    log.info(f"Last broadcast id: {last_id or '(none — first run)'}")

    new_scholarships = get_new_scholarships(last_id, limit=5)
    log.info(f"Found {len(new_scholarships)} new scholarships to broadcast")

    if not new_scholarships:
        log.info("✓ No new scholarships — done.")
        return

    for i, sch in enumerate(new_scholarships):
        log.info(f"  [{i + 1}/{len(new_scholarships)}] {sch['scholarship_name'][:60]}")
        message   = build_message(sch)
        photo_url = sch.get("featured_image_url")
        if send_telegram(message, photo_url):
            log.info(f"     ✓ Sent")
            state["last_broadcast_id"] = sch["id"]
            state["last_broadcast_at"] = datetime.now(timezone.utc).isoformat()
            save_state(state)
            if i < len(new_scholarships) - 1:
                time.sleep(3)  # Avoid Telegram flood limits
        else:
            log.warning(f"     ✗ Failed — stopping to avoid spam")
            break

    log.info(f"✅ Done — broadcast {len(new_scholarships)} scholarships")


if __name__ == "__main__":
    main()
