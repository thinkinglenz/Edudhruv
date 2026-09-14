"""
Sponsored-partnership PITCH campaign (revenue, not free tools).
Offers universities / ed-tech / consultants a paid Sponsored Feature on
EduDhruv: labeled sponsored article + social post + homepage feature +
(sponsored-attributed) link. Optional promo campaigns.

⚠️ SAFE BY DESIGN — this pitch deliberately does NOT sell dofollow "SEO"
backlinks (Google link-scheme penalty risk) or fake "recommended university"
placements (misleads students / AdSense violation). Everything is sold as
clearly-labeled sponsored content with rel="sponsored" links.

Reads pitch_contacts.json  ([{name, email, org}])  — provide your own list.
Same engine as outreach.py: Resend, gitignored .env key, Cloudflare-safe UA,
DRY_RUN default, BATCH_SIZE, spaced sends, dedupe sent-log, opt-out footer.

Run:  DRY_RUN=true  python automation/pitch_outreach.py
      DRY_RUN=false BATCH_SIZE=10 python automation/pitch_outreach.py
"""
import json, os, time, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
_envf = os.path.join(HERE, ".env")
if os.path.exists(_envf):
    for _l in open(_envf):
        _l = _l.strip()
        if _l and not _l.startswith("#") and "=" in _l:
            _k, _v = _l.split("=", 1); os.environ.setdefault(_k.strip(), _v.strip().strip('"').strip("'"))

RESEND_API_KEY = os.getenv("RESEND_API_KEY", "")
FROM = os.getenv("PITCH_FROM", "EduDhruv Partnerships <hello@edudhruv.com>")
REPLY_TO = os.getenv("OUTREACH_REPLY_TO", "edudruv@gmail.com")
DRY_RUN = os.getenv("DRY_RUN", "true").lower() != "false"
DELAY = int(os.getenv("OUTREACH_DELAY", "45"))
BATCH = int(os.getenv("BATCH_SIZE", "0"))

CONTACTS = os.path.join(HERE, "pitch_contacts.json")
SENT = os.path.join(HERE, ".pitch-sent.json")

SUBJECT = "Reach Indian applicants — sponsored feature on EduDhruv"

BODY = """<p>Hi {name},</p>

<p>EduDhruv is a growing study-abroad resource for Indian students. We run
<strong>sponsored partnerships</strong> to help institutions like <strong>{org}</strong>
reach Indian applicants directly:</p>

<ul>
  <li>A dedicated <strong>sponsored feature article</strong> about your programs / campus (clearly labeled)</li>
  <li>A <strong>social media post</strong> across our channels (Facebook, Instagram, Telegram)</li>
  <li>A <strong>homepage feature</strong> spot</li>
  <li>A link to your website</li>
  <li>Optional: we can <strong>run promotional campaigns</strong> on your behalf</li>
</ul>

<p>Packages start at <strong>$100</strong>. If you'd like details or a sample feature,
just reply and I'll share them.</p>

<p>Warm regards,<br>The EduDhruv Team<br>
<a href="https://www.edudhruv.com">edudhruv.com</a></p>

<hr style="border:none;border-top:1px solid #eee;margin:16px 0">
<p style="font-size:12px;color:#888">
EduDhruv — study-abroad guidance for Indian students. Prefer not to hear about partnerships?
Reply "unsubscribe" and we won't email again.
</p>"""


def load(path, default):
    try: return json.load(open(path))
    except Exception: return default


def send(to, html):
    payload = json.dumps({"from": FROM, "to": [to], "reply_to": REPLY_TO,
                          "subject": SUBJECT, "html": html}).encode()
    req = urllib.request.Request("https://api.resend.com/emails", data=payload, method="POST",
        headers={"Authorization": f"Bearer {RESEND_API_KEY}", "Content-Type": "application/json",
                 "User-Agent": "Mozilla/5.0 (compatible; EduDhruv-Partnerships/1.0)"})
    urllib.request.urlopen(req, timeout=20).read()


def main():
    contacts = load(CONTACTS, [])
    if not contacts:
        print(f"No contacts. Create {CONTACTS}: [{{'name','email','org'}}]."); return
    sent = set(e.lower() for e in load(SENT, []))
    print(f"{'DRY RUN' if DRY_RUN else 'LIVE'} | {len(contacts)} contacts | {len(sent)} already pitched")
    if not DRY_RUN and not RESEND_API_KEY:
        print("RESEND_API_KEY not set — aborting."); return
    new = 0
    for c in contacts:
        email = (c.get("email") or "").strip().lower()
        if not email or "@" not in email or email in sent: continue
        name = c.get("name", "there"); org = c.get("org", "your institution")
        if DRY_RUN:
            print(f"  WOULD PITCH → {name} <{email}> ({org})")
        else:
            try:
                send(email, BODY.format(name=name, org=org)); sent.add(email); new += 1
                json.dump(sorted(sent), open(SENT, "w"), indent=2)
                print(f"  ✅ pitched → {email}"); time.sleep(DELAY)
            except Exception as e:
                print(f"  ❌ failed → {email}: {e}")
        cnt = new if not DRY_RUN else (new + 1)
        if BATCH and cnt >= BATCH:
            print(f"  (batch limit {BATCH} reached)"); break
    print(f"Done. {'(dry run)' if DRY_RUN else f'{new} pitched'}.")


if __name__ == "__main__":
    main()
