"""
One-time embed-outreach emailer (free-backlink tactic).
========================================================================
Sends a short, personalized email offering EduDhruv's free embeddable
calculators to a hand-picked list of education sites. Each embed a site
adds carries a backlink to EduDhruv.

SAFETY / COMPLIANCE (deliberate design):
  • ONE-TIME send, not a cron — re-running never re-emails someone
    (a sent-log at automation/.outreach-sent.json dedupes).
  • DRY_RUN defaults to TRUE — prints what it *would* send, sends nothing,
    until you set DRY_RUN=false.
  • Every email includes EduDhruv's identity + a one-line opt-out
    (CAN-SPAM / CASL / GDPR basics) and is personalized (name + site).
  • Sends spaced out (OUTREACH_DELAY secs) to protect deliverability.
  • No personal name — signs "The EduDhruv Team".
  • Sends via Resend (RESEND_API_KEY). Uses a VERIFIED @edudhruv.com
    sender (RESEND_FROM) — without a verified domain, emails hit spam.

Contacts: automation/outreach_contacts.json  (see .example.json).
  Format: [{ "name": "...", "email": "...", "site": "..." }, ...]

Run:  DRY_RUN=true  python automation/outreach.py      # preview
      DRY_RUN=false python automation/outreach.py       # actually send
"""
import json
import os
import time
import urllib.request

RESEND_API_KEY = os.getenv("RESEND_API_KEY", "")
# MUST be a verified domain sender in Resend, else it lands in spam.
FROM = os.getenv("RESEND_FROM", "EduDhruv <hello@edudhruv.com>")
REPLY_TO = os.getenv("OUTREACH_REPLY_TO", "edudruv@gmail.com")
DRY_RUN = os.getenv("DRY_RUN", "true").lower() != "false"
DELAY = int(os.getenv("OUTREACH_DELAY", "45"))  # seconds between sends

HERE = os.path.dirname(os.path.abspath(__file__))
CONTACTS = os.path.join(HERE, "outreach_contacts.json")
SENT_LOG = os.path.join(HERE, ".outreach-sent.json")

SUBJECT = "A free tool for your students (embed it, no cost)"

# {name} and {site} are personalized per contact. No personal name is used.
BODY_TEMPLATE = """<p>Hi {name},</p>

<p>I'm reaching out from <strong>EduDhruv</strong>, a free study-abroad resource
for Indian students. I came across <strong>{site}</strong> and thought this might
be genuinely useful for your audience.</p>

<p>We built free, embeddable calculators your readers can use right on your site:</p>
<ul>
  <li>Education Loan EMI Calculator</li>
  <li>Cost of Studying Abroad Calculator</li>
  <li>Study Abroad ROI Calculator</li>
</ul>

<p>They're one line of code to add, stay up to date automatically, and are
completely free — grab the embed code here:<br>
<a href="https://www.edudhruv.com/tools/education-loan-emi-calculator">https://www.edudhruv.com/tools/education-loan-emi-calculator</a></p>

<p>No catch — just a useful, free tool for your students. Happy to help if you'd
like a hand setting it up.</p>

<p>Warm regards,<br>The EduDhruv Team<br>
<a href="https://www.edudhruv.com">edudhruv.com</a></p>

<hr style="border:none;border-top:1px solid #eee;margin:16px 0">
<p style="font-size:12px;color:#888">
You received this one-time email because {site} publishes study-abroad content and
we thought a free tool would help. EduDhruv, study-abroad guidance for Indian
students. Not interested? Just reply "unsubscribe" and we won't email again.
</p>"""


def load_json(path, default):
    try:
        with open(path) as f:
            return json.load(f)
    except Exception:
        return default


def send_resend(to, subject, html):
    payload = json.dumps({
        "from": FROM, "to": [to], "reply_to": REPLY_TO,
        "subject": subject, "html": html,
    }).encode()
    req = urllib.request.Request(
        "https://api.resend.com/emails", data=payload, method="POST",
        headers={"Authorization": f"Bearer {RESEND_API_KEY}",
                 "Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=20) as r:
        return json.loads(r.read())


def main():
    contacts = load_json(CONTACTS, [])
    if not contacts:
        print(f"No contacts. Create {CONTACTS} (see .example.json).")
        return
    sent = set(load_json(SENT_LOG, []))

    print(f"{'DRY RUN — nothing will send' if DRY_RUN else 'LIVE SEND'} | "
          f"{len(contacts)} contacts | {len(sent)} already emailed")
    if not DRY_RUN and not RESEND_API_KEY:
        print("RESEND_API_KEY not set — aborting."); return

    new = 0
    for c in contacts:
        email = (c.get("email") or "").strip().lower()
        name = c.get("name") or "there"
        site = c.get("site") or "your site"
        if not email or "@" not in email:
            print(f"  skip (bad email): {c}"); continue
        if email in sent:
            print(f"  skip (already emailed): {email}"); continue

        html = BODY_TEMPLATE.format(name=name, site=site)
        if DRY_RUN:
            print(f"  WOULD SEND → {name} <{email}> ({site})")
            continue
        try:
            send_resend(email, SUBJECT, html)
            sent.add(email); new += 1
            print(f"  ✅ sent → {email}")
            with open(SENT_LOG, "w") as f:
                json.dump(sorted(sent), f, indent=2)
            time.sleep(DELAY)  # space out for deliverability
        except Exception as e:
            print(f"  ❌ failed → {email}: {e}")

    print(f"Done. {'(dry run)' if DRY_RUN else f'{new} newly sent'}.")


if __name__ == "__main__":
    main()
