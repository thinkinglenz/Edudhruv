"""
One-time FOLLOW-UP to everyone who got the first embed-outreach email.
Most cold-email replies come from the follow-up, not the first send.

Safe by design (same as outreach.py):
  • Targets only addresses already in .outreach-sent.json (email #1 recipients).
  • Dedupes via .outreach-followup-sent.json — never double-sends.
  • DRY_RUN defaults TRUE. BATCH_SIZE limits per run. Spaced sends.
  • Compliant footer + opt-out. Plain, short, low-pressure.
  • Key from gitignored .env; Cloudflare-safe UA.

Run:  DRY_RUN=true  python automation/outreach_followup.py     # preview
      DRY_RUN=false BATCH_SIZE=15 python automation/outreach_followup.py
"""
import json, os, time, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
_envf = os.path.join(HERE, ".env")
if os.path.exists(_envf):
    for _l in open(_envf):
        _l = _l.strip()
        if _l and not _l.startswith("#") and "=" in _l:
            _k, _v = _l.split("=", 1)
            os.environ.setdefault(_k.strip(), _v.strip().strip('"').strip("'"))

RESEND_API_KEY = os.getenv("RESEND_API_KEY", "")
FROM = os.getenv("RESEND_FROM", "EduDhruv <hello@edudhruv.com>")
REPLY_TO = os.getenv("OUTREACH_REPLY_TO", "edudruv@gmail.com")
DRY_RUN = os.getenv("DRY_RUN", "true").lower() != "false"
DELAY = int(os.getenv("OUTREACH_DELAY", "45"))
BATCH = int(os.getenv("BATCH_SIZE", "0"))

CONTACTS = os.path.join(HERE, "outreach_contacts.json")
SENT1 = os.path.join(HERE, ".outreach-sent.json")           # got email #1
SENT2 = os.path.join(HERE, ".outreach-followup-sent.json")  # got follow-up

SUBJECT = "Re: A free tool for your students"

BODY = """<p>Hi {name},</p>

<p>Just following up on my earlier note — no worries at all if it's not a fit.</p>

<p>We built free, embeddable calculators your students can use right on <strong>{site}</strong>
(education-loan EMI, cost of studying abroad, and a GPA / percentage → US GPA converter).
They're one line of code, always up to date, and completely free.</p>

<p>If you'd like the embed code, just reply "yes" and I'll send it over — takes a minute to add.
Either way, wishing you and your students the best.</p>

<p>Warm regards,<br>The EduDhruv Team<br>
<a href="https://www.edudhruv.com/tools/gpa-converter">edudhruv.com/tools</a></p>

<hr style="border:none;border-top:1px solid #eee;margin:16px 0">
<p style="font-size:12px;color:#888">
EduDhruv — free study-abroad tools for Indian students. Not interested? Reply "unsubscribe" and we won't email again.
</p>"""


def load(path, default):
    try:
        return json.load(open(path))
    except Exception:
        return default


def send(to, html):
    payload = json.dumps({"from": FROM, "to": [to], "reply_to": REPLY_TO,
                          "subject": SUBJECT, "html": html}).encode()
    req = urllib.request.Request("https://api.resend.com/emails", data=payload, method="POST",
        headers={"Authorization": f"Bearer {RESEND_API_KEY}", "Content-Type": "application/json",
                 "User-Agent": "Mozilla/5.0 (compatible; EduDhruv-Outreach/1.0)"})
    urllib.request.urlopen(req, timeout=20).read()


def main():
    emailed1 = set(e.lower() for e in load(SENT1, []))
    done2 = set(e.lower() for e in load(SENT2, []))
    by_email = {c["email"].lower(): c for c in load(CONTACTS, [])}

    targets = [e for e in emailed1 if e not in done2]
    print(f"{'DRY RUN' if DRY_RUN else 'LIVE'} | {len(emailed1)} got email#1 | "
          f"{len(done2)} already followed-up | {len(targets)} to follow up now")
    if not DRY_RUN and not RESEND_API_KEY:
        print("RESEND_API_KEY not set — aborting."); return

    new = 0
    for email in targets:
        c = by_email.get(email, {})
        name = c.get("name", "there"); site = c.get("site", "your site")
        if DRY_RUN:
            print(f"  WOULD FOLLOW UP → {name} <{email}> ({site})")
        else:
            try:
                send(email, BODY.format(name=name, site=site))
                done2.add(email); new += 1
                json.dump(sorted(done2), open(SENT2, "w"), indent=2)
                print(f"  ✅ followed up → {email}")
                time.sleep(DELAY)
            except Exception as e:
                print(f"  ❌ failed → {email}: {e}")
        if BATCH and (new if not DRY_RUN else targets.index(email) + 1) >= BATCH:
            print(f"  (batch limit {BATCH} reached)"); break

    print(f"Done. {'(dry run)' if DRY_RUN else f'{new} follow-ups sent'}.")


if __name__ == "__main__":
    main()
