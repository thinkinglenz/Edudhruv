-- ─── Email-based 2FA for admin panel ───────────────────────────
-- Sends a 6-digit code to the admin's email on every login.
-- Works alongside the existing TOTP 2FA (either can be enabled).
--
-- After running this:
--   1. Run on Vercel: ensure RESEND_API_KEY is set
--   2. Email 2FA will be enabled by default (this migration sets it true)
--   3. To temporarily disable, set env var DISABLE_2FA=true on Vercel
-- ───────────────────────────────────────────────────────────────

ALTER TABLE admin_settings
  ADD COLUMN IF NOT EXISTS email_2fa_enabled  BOOLEAN     NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS email_2fa_address  TEXT,
  ADD COLUMN IF NOT EXISTS login_code_hash    TEXT,
  ADD COLUMN IF NOT EXISTS login_code_expires_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS login_code_sent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS login_code_attempts INT       NOT NULL DEFAULT 0;

-- Turn it on by default — sending codes to edudruv@gmail.com
UPDATE admin_settings
SET email_2fa_enabled = TRUE,
    email_2fa_address = 'edudruv@gmail.com'
WHERE id = 1;

-- Convenience: a function to clear the active code (after consumption)
CREATE OR REPLACE FUNCTION clear_login_code() RETURNS void AS $$
  UPDATE admin_settings
  SET login_code_hash = NULL,
      login_code_expires_at = NULL,
      login_code_attempts = 0
  WHERE id = 1;
$$ LANGUAGE sql;
