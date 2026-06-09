-- Newsletter subscriber capture
-- Lets you build an owned audience that doesn't depend on Google traffic.
-- Wire to Mailchimp/Buttondown later via Vercel cron that exports new rows.

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id           SERIAL PRIMARY KEY,
  email        TEXT NOT NULL UNIQUE,
  name         TEXT,
  source_slug  TEXT,                    -- which post they signed up from
  source_url   TEXT,                    -- full referrer URL
  status       TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced', 'spam')),
  ip_address   TEXT,
  user_agent   TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  confirmed_at TIMESTAMPTZ                -- set after double-opt-in (future)
);

CREATE INDEX IF NOT EXISTS idx_newsletter_status_created ON newsletter_subscribers(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_newsletter_source        ON newsletter_subscribers(source_slug);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Only service role can read (PII). Public can only INSERT via the API route.
CREATE POLICY "Service role only" ON newsletter_subscribers
  USING (auth.role() = 'service_role');
