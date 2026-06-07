import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, COOKIE_MAX_AGE, makeSessionToken } from "@/lib/admin-auth";
import { getAdminSettings, updateAdminSettings, consumeBackupCode } from "@/lib/admin-2fa";
import { generateSecret, generateProvisioningURI, verifyTOTP, generateBackupCodes } from "@/lib/totp";
import {
  generateCode,
  storeCode,
  verifyEmailCode,
  sendCodeEmail,
  canResend,
  maskEmail,
  getEmailSettings,
} from "@/lib/admin-email-2fa";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "EduDhruv@Admin2025";

// Emergency escape hatch — set DISABLE_2FA=true on Vercel to skip ALL 2FA
const DISABLE_2FA = process.env.DISABLE_2FA === "true";

function setCookie(res: NextResponse, value: string) {
  res.cookies.set({
    name:     ADMIN_COOKIE,
    value,
    httpOnly: true,
    secure:   false,           // localhost-safe; Vercel auto-enables HTTPS
    sameSite: "lax",
    maxAge:   COOKIE_MAX_AGE,
    path:     "/",
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { action, password, current, next: nextPwd, code, secret } = body;

  // ──────────────────────────────────────────────────────────────
  // STEP 1 — Password login
  // ──────────────────────────────────────────────────────────────
  if (action === "login") {
    if (password !== ADMIN_PASSWORD) {
      await new Promise(r => setTimeout(r, 1200));
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    // Emergency bypass — only used if admin loses email/authenticator access
    if (DISABLE_2FA) {
      const res = NextResponse.json({ success: true, requires2FA: false });
      setCookie(res, makeSessionToken(ADMIN_PASSWORD, "admin_ok"));
      return res;
    }

    // Check if any 2FA is enabled
    const settings = await getAdminSettings();

    // ── Email 2FA preferred when available ─────────────────────
    if (settings.email_2fa_enabled && settings.email_2fa_address) {
      const code = generateCode();
      await storeCode(code);
      const sent = await sendCodeEmail(code, settings.email_2fa_address);

      const res = NextResponse.json({
        success: true,
        requires2FA: true,
        method: "email",
        emailHint: maskEmail(settings.email_2fa_address),
        warning: sent ? undefined : "Email could not be sent — check Vercel logs for the code (RESEND_API_KEY may be missing)",
      });
      setCookie(res, makeSessionToken(ADMIN_PASSWORD, "pwd_pending"));
      return res;
    }

    // ── TOTP fallback ──────────────────────────────────────────
    if (settings.totp_enabled) {
      const res = NextResponse.json({ success: true, requires2FA: true, method: "totp" });
      setCookie(res, makeSessionToken(ADMIN_PASSWORD, "pwd_pending"));
      return res;
    }

    // No 2FA — issue full session
    const res = NextResponse.json({ success: true, requires2FA: false });
    setCookie(res, makeSessionToken(ADMIN_PASSWORD, "admin_ok"));
    return res;
  }

  // ──────────────────────────────────────────────────────────────
  // STEP 1.5 — Resend email code (rate-limited 60s)
  // ──────────────────────────────────────────────────────────────
  if (action === "resend-code") {
    const settings = await getAdminSettings();
    if (!settings.email_2fa_enabled || !settings.email_2fa_address) {
      return NextResponse.json({ error: "Email 2FA is not enabled" }, { status: 400 });
    }
    const rl = await canResend();
    if (!rl.ok) {
      return NextResponse.json(
        { error: `Wait ${rl.secondsLeft}s before requesting a new code` },
        { status: 429 }
      );
    }
    const code = generateCode();
    await storeCode(code);
    const sent = await sendCodeEmail(code, settings.email_2fa_address);
    return NextResponse.json({
      success: true,
      emailHint: maskEmail(settings.email_2fa_address),
      warning: sent ? undefined : "Email send failed — check server logs",
    });
  }

  // ──────────────────────────────────────────────────────────────
  // STEP 2 — Verify TOTP code (or backup code)
  // ──────────────────────────────────────────────────────────────
  if (action === "verify-2fa") {
    if (!code) return NextResponse.json({ error: "Code required" }, { status: 400 });

    const settings = await getAdminSettings();
    if (!settings.totp_enabled && !settings.email_2fa_enabled) {
      return NextResponse.json({ error: "2FA is not enabled" }, { status: 400 });
    }

    let valid = false;
    let errorMsg = "Invalid or expired code";

    // 1) Try email code first if enabled
    if (settings.email_2fa_enabled) {
      const result = await verifyEmailCode(code);
      if (result === "ok") valid = true;
      else if (result === "expired") errorMsg = "Code expired — request a new one";
      else if (result === "locked")  errorMsg = "Too many attempts — request a new code";
    }

    // 2) Try TOTP if email failed AND TOTP is enabled
    if (!valid && settings.totp_enabled && settings.totp_secret) {
      if (verifyTOTP(settings.totp_secret, code)) valid = true;
    }

    // 3) Try backup code (works for either method)
    if (!valid) {
      const ok = await consumeBackupCode(code);
      if (ok) valid = true;
    }

    if (!valid) {
      await new Promise(r => setTimeout(r, 800));
      return NextResponse.json({ error: errorMsg }, { status: 401 });
    }

    // Upgrade to full session
    const res = NextResponse.json({ success: true });
    setCookie(res, makeSessionToken(ADMIN_PASSWORD, "admin_ok"));
    return res;
  }

  // ──────────────────────────────────────────────────────────────
  // LOGOUT
  // ──────────────────────────────────────────────────────────────
  if (action === "logout" || action === "logout-all") {
    const res = NextResponse.json({ success: true });
    res.cookies.delete(ADMIN_COOKIE);
    return res;
  }

  // ──────────────────────────────────────────────────────────────
  // CHANGE PASSWORD (requires full session — checked by middleware)
  // ──────────────────────────────────────────────────────────────
  if (action === "change-password") {
    if (!current || !nextPwd) {
      return NextResponse.json({ error: "current and next password required" }, { status: 400 });
    }
    if (current !== ADMIN_PASSWORD) {
      await new Promise(r => setTimeout(r, 1200));
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 });
    }
    if (nextPwd.length < 8) {
      return NextResponse.json({ error: "Password must be 8+ characters" }, { status: 400 });
    }
    return NextResponse.json({
      success: true,
      message: "Password validated. ⚠ Update ADMIN_PASSWORD on Vercel and redeploy to make it permanent.",
    });
  }

  // ──────────────────────────────────────────────────────────────
  // 2FA — Begin setup (generate secret + QR code)
  // ──────────────────────────────────────────────────────────────
  if (action === "begin-2fa") {
    const newSecret = generateSecret();
    const uri       = generateProvisioningURI(newSecret, "admin@edudhruv");
    // Don't save yet — only on verify-and-enable
    return NextResponse.json({
      success: true,
      secret:  newSecret,
      uri,
    });
  }

  // ──────────────────────────────────────────────────────────────
  // 2FA — Verify code with new secret + enable
  // ──────────────────────────────────────────────────────────────
  if (action === "enable-2fa") {
    if (!secret || !code) {
      return NextResponse.json({ error: "Secret and code required" }, { status: 400 });
    }
    const valid = verifyTOTP(secret, code);
    if (!valid) {
      return NextResponse.json({ error: "Code didn't match — make sure your authenticator app is in sync" }, { status: 401 });
    }
    const backupCodes = generateBackupCodes(10);
    const ok = await updateAdminSettings({
      totp_secret:  secret,
      totp_enabled: true,
      backup_codes: backupCodes,
    });
    if (!ok) {
      return NextResponse.json({ error: "Could not save 2FA settings — is Supabase configured?" }, { status: 500 });
    }
    return NextResponse.json({
      success:     true,
      backupCodes,
      message:     "2FA enabled! Save your backup codes somewhere safe.",
    });
  }

  // ──────────────────────────────────────────────────────────────
  // 2FA — Disable
  // ──────────────────────────────────────────────────────────────
  if (action === "disable-2fa") {
    if (!password || password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Password required to disable 2FA" }, { status: 401 });
    }
    const ok = await updateAdminSettings({
      totp_secret:  null,
      totp_enabled: false,
      backup_codes: [],
    });
    if (!ok) return NextResponse.json({ error: "Could not disable" }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  // ──────────────────────────────────────────────────────────────
  // 2FA — Status
  // ──────────────────────────────────────────────────────────────
  if (action === "status-2fa") {
    const s = await getAdminSettings();
    return NextResponse.json({
      enabled:           s.totp_enabled,
      backupCodesCount:  s.backup_codes.length,
      emailEnabled:      s.email_2fa_enabled,
      emailAddress:      s.email_2fa_address ? maskEmail(s.email_2fa_address) : null,
    });
  }

  // ──────────────────────────────────────────────────────────────
  // EMAIL 2FA — Enable / disable / change address
  // ──────────────────────────────────────────────────────────────
  if (action === "enable-email-2fa") {
    const email = body.email as string | undefined;
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }
    const ok = await updateAdminSettings({
      email_2fa_enabled: true,
      email_2fa_address: email,
    });
    if (!ok) return NextResponse.json({ error: "Could not save" }, { status: 500 });

    // Send a test code immediately so admin can confirm email works
    const testCode = generateCode();
    await storeCode(testCode);
    const sent = await sendCodeEmail(testCode, email);
    return NextResponse.json({
      success: true,
      testSent: sent,
      message: sent
        ? `Email 2FA enabled. A test code was sent to ${maskEmail(email)} — check your inbox.`
        : "Email 2FA enabled BUT email send failed. Check RESEND_API_KEY on Vercel.",
    });
  }

  if (action === "disable-email-2fa") {
    if (!password || password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Password required" }, { status: 401 });
    }
    const ok = await updateAdminSettings({
      email_2fa_enabled: false,
      email_2fa_address: null,
    });
    if (!ok) return NextResponse.json({ error: "Could not disable" }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
