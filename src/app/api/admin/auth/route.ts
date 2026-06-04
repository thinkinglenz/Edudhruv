import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, COOKIE_MAX_AGE, makeSessionToken } from "@/lib/admin-auth";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "EduDhruv@Admin2025";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { action, password, current, next } = body;

  // ─── LOGIN ────────────────────────────────────────────────────────────
  if (action === "login") {
    if (password !== ADMIN_PASSWORD) {
      await new Promise(r => setTimeout(r, 1200));
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }
    const token = makeSessionToken(ADMIN_PASSWORD);
    const res = NextResponse.json({ success: true });
    res.cookies.set({
      name:     ADMIN_COOKIE,
      value:    token,
      httpOnly: true,
      secure:   false,
      sameSite: "lax",
      maxAge:   COOKIE_MAX_AGE,
      path:     "/",
    });
    return res;
  }

  // ─── LOGOUT ───────────────────────────────────────────────────────────
  if (action === "logout") {
    const res = NextResponse.json({ success: true });
    res.cookies.delete(ADMIN_COOKIE);
    return res;
  }

  // ─── LOGOUT EVERYWHERE ────────────────────────────────────────────────
  // Note: Without DB-backed sessions this just rotates the cookie on this device.
  // Real "logout all" requires changing ADMIN_PASSWORD in env vars + redeploy
  // (because token = hash(password), so changing the password invalidates ALL sessions).
  if (action === "logout-all") {
    const res = NextResponse.json({
      success: true,
      note: "This device signed out. To invalidate sessions on other devices, change ADMIN_PASSWORD in Vercel env vars and redeploy.",
    });
    res.cookies.delete(ADMIN_COOKIE);
    return res;
  }

  // ─── CHANGE PASSWORD ──────────────────────────────────────────────────
  if (action === "change-password") {
    if (!current || !next) {
      return NextResponse.json({ error: "current and next password required" }, { status: 400 });
    }
    if (current !== ADMIN_PASSWORD) {
      await new Promise(r => setTimeout(r, 1200));
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 });
    }
    if (next.length < 8) {
      return NextResponse.json({ error: "Password must be 8+ characters" }, { status: 400 });
    }

    // In a real prod setup with a DB, we'd write the hashed password here.
    // For this env-var based setup, we can't actually persist —
    // return success but tell the user to update ADMIN_PASSWORD on Vercel.
    return NextResponse.json({
      success: true,
      message: "Password validated. ⚠ To make this permanent, update ADMIN_PASSWORD on Vercel and redeploy. Your new password should be: " + next.replace(/./g, "•"),
    });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
