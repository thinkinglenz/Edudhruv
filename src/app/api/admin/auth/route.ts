import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, COOKIE_MAX_AGE, makeSessionToken } from "@/lib/admin-auth";
import { getAdminSettings, updateAdminSettings, consumeBackupCode } from "@/lib/admin-2fa";
import { generateSecret, generateProvisioningURI, verifyTOTP, generateBackupCodes } from "@/lib/totp";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "EduDhruv@Admin2025";

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

    // Check if 2FA is enabled
    const settings = await getAdminSettings();
    if (settings.totp_enabled) {
      // Issue PARTIAL session — only /admin/login allowed until 2FA verified
      const res = NextResponse.json({ success: true, requires2FA: true });
      setCookie(res, makeSessionToken(ADMIN_PASSWORD, "pwd_pending"));
      return res;
    }

    // No 2FA — issue full session
    const res = NextResponse.json({ success: true, requires2FA: false });
    setCookie(res, makeSessionToken(ADMIN_PASSWORD, "admin_ok"));
    return res;
  }

  // ──────────────────────────────────────────────────────────────
  // STEP 2 — Verify TOTP code (or backup code)
  // ──────────────────────────────────────────────────────────────
  if (action === "verify-2fa") {
    if (!code) return NextResponse.json({ error: "Code required" }, { status: 400 });

    const settings = await getAdminSettings();
    if (!settings.totp_enabled || !settings.totp_secret) {
      return NextResponse.json({ error: "2FA is not enabled" }, { status: 400 });
    }

    // Try TOTP first
    let valid = verifyTOTP(settings.totp_secret, code);

    // Then try backup code
    if (!valid) {
      const ok = await consumeBackupCode(code);
      if (ok) valid = true;
    }

    if (!valid) {
      await new Promise(r => setTimeout(r, 800));
      return NextResponse.json({ error: "Invalid or expired code" }, { status: 401 });
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
    });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
