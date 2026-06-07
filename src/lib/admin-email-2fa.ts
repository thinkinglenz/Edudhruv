/**
 * Email-based 2FA for the admin panel.
 *
 * Flow:
 *  1. User enters password → server generates 6-digit code, hashes it,
 *     stores in admin_settings, emails the plain code to email_2fa_address
 *  2. User reads email, enters code → server hashes it again, compares
 *  3. Code expires in 10 min, max 5 attempts, can be resent every 60s
 *
 * Why we hash:
 *   If the DB leaks, the active login code is useless — can't be used
 *   without knowing the email inbox too.
 */
import crypto from "crypto";

const CODE_LIFETIME_MS = 10 * 60 * 1000;     // 10 min
const RESEND_COOLDOWN_MS = 60 * 1000;        // 60 sec between sends
const MAX_ATTEMPTS = 5;

const IS_MOCK = !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder") ||
  !process.env.SUPABASE_SERVICE_ROLE_KEY;

/** Generate a cryptographically-random 6-digit code */
export function generateCode(): string {
  const n = crypto.randomInt(0, 1_000_000);
  return n.toString().padStart(6, "0");
}

/** SHA-256 hash with a stable site-wide salt */
export function hashCode(code: string): string {
  const salt = process.env.ADMIN_SESSION_TOKEN || "edudhruv-default-salt-please-change";
  return crypto.createHash("sha256").update(`${salt}|${code.trim()}`).digest("hex");
}

interface EmailSettings {
  email_2fa_enabled: boolean;
  email_2fa_address: string | null;
  login_code_hash:   string | null;
  login_code_expires_at: string | null;
  login_code_sent_at: string | null;
  login_code_attempts: number;
}

export async function getEmailSettings(): Promise<EmailSettings> {
  if (IS_MOCK) {
    return {
      email_2fa_enabled: false,
      email_2fa_address: null,
      login_code_hash: null,
      login_code_expires_at: null,
      login_code_sent_at: null,
      login_code_attempts: 0,
    };
  }
  const { getServiceClient } = await import("@/lib/supabase");
  const { data } = await getServiceClient()
    .from("admin_settings")
    .select("email_2fa_enabled,email_2fa_address,login_code_hash,login_code_expires_at,login_code_sent_at,login_code_attempts")
    .eq("id", 1)
    .maybeSingle();

  return {
    email_2fa_enabled: !!data?.email_2fa_enabled,
    email_2fa_address: data?.email_2fa_address || null,
    login_code_hash:   data?.login_code_hash || null,
    login_code_expires_at: data?.login_code_expires_at || null,
    login_code_sent_at: data?.login_code_sent_at || null,
    login_code_attempts: data?.login_code_attempts ?? 0,
  };
}

/** Store a freshly-generated code (hashed) for later verification */
export async function storeCode(plainCode: string): Promise<boolean> {
  if (IS_MOCK) return false;
  const { getServiceClient } = await import("@/lib/supabase");
  const now = new Date();
  const { error } = await getServiceClient()
    .from("admin_settings")
    .update({
      login_code_hash:       hashCode(plainCode),
      login_code_expires_at: new Date(now.getTime() + CODE_LIFETIME_MS).toISOString(),
      login_code_sent_at:    now.toISOString(),
      login_code_attempts:   0,
      updated_at:            now.toISOString(),
    })
    .eq("id", 1);
  if (error) console.error("storeCode error:", error);
  return !error;
}

export async function clearCode(): Promise<void> {
  if (IS_MOCK) return;
  const { getServiceClient } = await import("@/lib/supabase");
  await getServiceClient()
    .from("admin_settings")
    .update({
      login_code_hash: null,
      login_code_expires_at: null,
      login_code_attempts: 0,
    })
    .eq("id", 1);
}

export async function incrementAttempts(): Promise<void> {
  if (IS_MOCK) return;
  const { getServiceClient } = await import("@/lib/supabase");
  const s = await getEmailSettings();
  await getServiceClient()
    .from("admin_settings")
    .update({ login_code_attempts: s.login_code_attempts + 1 })
    .eq("id", 1);
}

/**
 * Verify a submitted code.
 * @returns "ok" | "expired" | "wrong" | "locked" | "no-code"
 */
export async function verifyEmailCode(plainCode: string):
  Promise<"ok" | "expired" | "wrong" | "locked" | "no-code">
{
  const s = await getEmailSettings();
  if (!s.login_code_hash || !s.login_code_expires_at) return "no-code";
  if (s.login_code_attempts >= MAX_ATTEMPTS) return "locked";
  if (new Date(s.login_code_expires_at) < new Date()) return "expired";

  const submittedHash = hashCode(plainCode);
  if (submittedHash !== s.login_code_hash) {
    await incrementAttempts();
    return "wrong";
  }
  // Success — burn the code so it can't be reused
  await clearCode();
  return "ok";
}

/** Returns true if a resend is allowed (cooldown elapsed) */
export async function canResend(): Promise<{ ok: boolean; secondsLeft: number }> {
  const s = await getEmailSettings();
  if (!s.login_code_sent_at) return { ok: true, secondsLeft: 0 };
  const elapsed = Date.now() - new Date(s.login_code_sent_at).getTime();
  if (elapsed >= RESEND_COOLDOWN_MS) return { ok: true, secondsLeft: 0 };
  return { ok: false, secondsLeft: Math.ceil((RESEND_COOLDOWN_MS - elapsed) / 1000) };
}

/** Mask email for display: "edudruv@gmail.com" → "ed•••@gmail.com" */
export function maskEmail(email: string | null): string {
  if (!email) return "your email";
  const [user, domain] = email.split("@");
  if (!domain) return email;
  const visible = user.slice(0, 2);
  return `${visible}${"•".repeat(Math.max(3, user.length - 2))}@${domain}`;
}

/** Send the code via Resend (or SendGrid fallback). Returns true if sent. */
export async function sendCodeEmail(code: string, toEmail: string): Promise<boolean> {
  const subject = `EduDhruv Admin · Login code: ${code}`;
  const html = `
<div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:24px;background:#0f172a;color:#e5e7eb;border-radius:16px">
  <div style="text-align:center;margin-bottom:20px">
    <span style="font-weight:800;font-size:22px;color:white">EDU</span><span style="font-weight:800;font-size:22px;color:#3AAFE5">DHRUV</span><span style="color:#F5A71A;margin-left:4px">★</span>
  </div>
  <p style="font-size:14px;color:#94a3b8;margin:0 0 8px">Someone tried to log into your admin panel:</p>
  <div style="background:#1e293b;border:2px solid #3AAFE5;border-radius:12px;padding:24px;text-align:center;margin:16px 0">
    <p style="font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:2px;margin:0 0 8px">Your login code</p>
    <p style="font-family:'SF Mono',monospace;font-size:38px;font-weight:800;letter-spacing:8px;color:white;margin:0">${code}</p>
    <p style="font-size:11px;color:#64748b;margin:12px 0 0">Expires in 10 minutes</p>
  </div>
  <p style="font-size:12px;color:#64748b;margin:16px 0 0;line-height:1.6">
    🔒 Never share this code with anyone. EduDhruv staff will never ask for it.<br>
    If you didn't try to log in, someone has your password — change it immediately.
  </p>
</div>`.trim();

  const from = process.env.RESEND_FROM || "EduDhruv Admin <onboarding@resend.dev>";

  // Try Resend first
  if (process.env.RESEND_API_KEY) {
    try {
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ from, to: [toEmail], subject, html }),
      });
      if (r.ok) return true;
      console.warn("[email-2fa] Resend failed:", await r.text());
    } catch (e) {
      console.warn("[email-2fa] Resend error:", e);
    }
  }

  // SendGrid fallback
  if (process.env.SENDGRID_API_KEY) {
    try {
      const r = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.SENDGRID_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: toEmail }] }],
          from: { email: process.env.SENDGRID_FROM || "noreply@edudhruv.com", name: "EduDhruv Admin" },
          subject,
          content: [{ type: "text/html", value: html }],
        }),
      });
      if (r.status === 202) return true;
      console.warn("[email-2fa] SendGrid failed:", await r.text());
    } catch (e) {
      console.warn("[email-2fa] SendGrid error:", e);
    }
  }

  // Last resort — log to server (visible in Vercel logs) so admin can recover
  console.error(`[email-2fa] NO EMAIL PROVIDER CONFIGURED. Code for ${toEmail}: ${code}`);
  return false;
}
