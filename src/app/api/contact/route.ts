/**
 * Contact form endpoint.
 *
 *   POST /api/contact
 *   Body: { name, email, subject, message, type? }
 *
 * Fires a Resend email to ADMIN_EMAIL. Stores nothing in DB (no PII).
 * Cloudflare Turnstile token verified if NEXT_PUBLIC_TURNSTILE_SITE_KEY set.
 */
import { NextRequest, NextResponse } from "next/server";

const ADMIN_EMAIL = process.env.LEAD_NOTIFY_EMAIL || "edudruv@gmail.com";

function isValidEmail(s: string): boolean {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(s);
}

async function verifyTurnstile(token: string | undefined): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;          // Turnstile not configured — allow
  if (!token)  return false;
  try {
    const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${encodeURIComponent(secret)}&response=${encodeURIComponent(token)}`,
    });
    const data = await r.json();
    return !!data.success;
  } catch { return false; }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { name, email, subject, message, type, captcha } = body as Record<string, string>;

    if (!name || name.trim().length < 2) {
      return NextResponse.json({ error: "Name required" }, { status: 400 });
    }
    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }
    if (!message || message.trim().length < 10) {
      return NextResponse.json({ error: "Message must be at least 10 characters" }, { status: 400 });
    }
    if (message.length > 5000) {
      return NextResponse.json({ error: "Message too long (5000 chars max)" }, { status: 400 });
    }

    // Spam check
    const captchaOk = await verifyTurnstile(captcha);
    if (!captchaOk) {
      return NextResponse.json({ error: "Captcha verification failed" }, { status: 400 });
    }

    // Honeypot detection (any unexpected fields = bot)
    if ((body as any).website || (body as any).url) {
      // Silently succeed but don't email
      return NextResponse.json({ success: true });
    }

    const safeName    = name.trim().slice(0, 100);
    const safeEmail   = email.trim().toLowerCase().slice(0, 254);
    const safeSubject = (subject || "General enquiry").trim().slice(0, 200);
    const safeMessage = message.trim().slice(0, 5000);
    const safeType    = (type || "general").trim().slice(0, 50);

    // Send via Resend
    if (process.env.RESEND_API_KEY) {
      const escape = (s: string) => s.replace(/</g, "&lt;").replace(/>/g, "&gt;");
      try {
        const r = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from:     process.env.RESEND_FROM || "EduDhruv Contact <onboarding@resend.dev>",
            to:       [ADMIN_EMAIL],
            reply_to: safeEmail,
            subject:  `[Contact] ${safeSubject} — from ${safeName}`,
            html: `
<div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto">
  <h2 style="color:#3AAFE5">New contact form submission</h2>
  <table style="width:100%;border-collapse:collapse;margin:16px 0">
    <tr><td style="padding:6px 12px 6px 0;color:#666;width:120px">Name:</td>      <td><strong>${escape(safeName)}</strong></td></tr>
    <tr><td style="padding:6px 12px 6px 0;color:#666">Email:</td>                 <td><a href="mailto:${escape(safeEmail)}">${escape(safeEmail)}</a></td></tr>
    <tr><td style="padding:6px 12px 6px 0;color:#666">Subject:</td>               <td>${escape(safeSubject)}</td></tr>
    <tr><td style="padding:6px 12px 6px 0;color:#666">Type:</td>                  <td>${escape(safeType)}</td></tr>
  </table>
  <h3 style="margin-top:24px">Message</h3>
  <div style="background:#f5f9fc;border-left:3px solid #3AAFE5;padding:14px 18px;white-space:pre-wrap">${escape(safeMessage)}</div>
  <p style="color:#999;font-size:12px;margin-top:24px">Reply directly to this email to respond to ${escape(safeName)}.</p>
</div>`,
          }),
        });
        if (!r.ok) {
          const err = await r.text();
          console.warn("[contact] Resend failed:", r.status, err.slice(0, 200));
          return NextResponse.json({ error: "Email delivery failed — please try again" }, { status: 500 });
        }
      } catch (e: any) {
        console.warn("[contact] Resend error:", e?.message);
        return NextResponse.json({ error: "Email delivery failed — please try again" }, { status: 500 });
      }
    } else {
      // No Resend key — log to server (visible in Vercel logs)
      console.log(`[contact] FROM=${safeName} <${safeEmail}> SUBJECT="${safeSubject}" TYPE=${safeType}\n${safeMessage}`);
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("[contact] handler error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
