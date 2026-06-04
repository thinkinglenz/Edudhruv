import { NextRequest, NextResponse } from "next/server";
import { verifyTurnstile } from "@/lib/turnstile";
import { getServiceClient } from "@/lib/supabase";

const ADMIN_EMAIL = process.env.LEAD_NOTIFY_EMAIL || "edudruv@gmail.com";

// Rate limit: 3 advertising enquiries per IP per hour
const RATE = new Map<string, { count: number; ts: number }>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const e = RATE.get(ip);
  if (!e || now - e.ts > 3600000) { RATE.set(ip, { count: 1, ts: now }); return false; }
  if (e.count >= 3) return true;
  e.count++; return false;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Too many enquiries. Try again later." }, { status: 429 });
  }

  try {
    const body = await req.json();
    const { name, company, role, email, phone, website, interest, budget, message, captchaToken } = body;

    // Verify captcha
    const captcha = await verifyTurnstile(captchaToken, ip);
    if (!captcha.success) {
      return NextResponse.json({ error: captcha.error || "Security check failed" }, { status: 400 });
    }

    // Validate
    if (!name || !company || !email || !message || !interest || !budget) {
      return NextResponse.json({ error: "All required fields must be filled" }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const enquiry = {
      name:    String(name).trim(),
      company: String(company).trim(),
      role:    String(role || "").trim(),
      email:   String(email).toLowerCase().trim(),
      phone:   String(phone || "").trim(),
      website: String(website || "").trim(),
      interest, budget,
      message: String(message).trim(),
      ip,
      created_at: new Date().toISOString(),
    };

    // ─── Save to Supabase ─────────────────────────────────────────────
    const IS_MOCK = !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");

    if (!IS_MOCK) {
      const db = getServiceClient();
      // Save into `leads` table with a marker so admin can filter them
      await db.from("leads").insert([{
        name:    enquiry.name,
        email:   enquiry.email,
        phone:   enquiry.phone || "n/a",
        source_post_slug: "advertise-enquiry",
        destination:      `[${enquiry.interest}] ${enquiry.company} — Budget: ${enquiry.budget}`,
        status:           "new",
        notes:            `Role: ${enquiry.role}\nWebsite: ${enquiry.website}\n\n${enquiry.message}`,
      }]);
    } else {
      console.log("[MOCK] Advertise enquiry:", enquiry);
    }

    // ─── Send notification email via Resend / SendGrid ────────────────
    // Both are free up to a generous tier. Configure ONE of them.
    const sent = await sendNotification(enquiry);

    return NextResponse.json({
      success: true,
      saved: !IS_MOCK,
      emailed: sent,
    });

  } catch (err: any) {
    console.error("Advertise enquiry error:", err);
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
  }
}

// ─── Email notification (Resend preferred, SendGrid fallback) ─────────
async function sendNotification(enq: any): Promise<boolean> {
  const html = `
    <h2 style="color:#3AAFE5">🎓 New Advertising Enquiry</h2>
    <p><strong>${enq.name}</strong> from <strong>${enq.company}</strong></p>
    <table cellpadding="6" cellspacing="0" border="0" style="font-family:sans-serif;font-size:14px;">
      <tr><td><strong>Interest:</strong></td><td>${enq.interest}</td></tr>
      <tr><td><strong>Budget:</strong></td><td>${enq.budget}</td></tr>
      <tr><td><strong>Email:</strong></td><td><a href="mailto:${enq.email}">${enq.email}</a></td></tr>
      <tr><td><strong>Phone:</strong></td><td>${enq.phone || "—"}</td></tr>
      <tr><td><strong>Website:</strong></td><td>${enq.website || "—"}</td></tr>
      <tr><td><strong>Role:</strong></td><td>${enq.role || "—"}</td></tr>
    </table>
    <h3 style="color:#3AAFE5;margin-top:24px">Message</h3>
    <p style="background:#f7f7f7;padding:12px;border-radius:8px;white-space:pre-wrap">${enq.message}</p>
    <hr/>
    <p style="font-size:12px;color:#888">Submitted from EduDhruv.com · IP: ${enq.ip} · ${enq.created_at}</p>
  `;
  const subject = `🎓 Advertising enquiry — ${enq.company} (${enq.interest})`;

  // Try Resend first
  if (process.env.RESEND_API_KEY) {
    try {
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type":  "application/json",
        },
        body: JSON.stringify({
          from:     process.env.RESEND_FROM || "EduDhruv <onboarding@resend.dev>",
          to:       [ADMIN_EMAIL],
          reply_to: enq.email,
          subject,
          html,
        }),
      });
      if (r.ok) return true;
      console.warn("Resend failed:", await r.text());
    } catch (e) { console.warn("Resend error:", e); }
  }

  // Fallback to SendGrid
  if (process.env.SENDGRID_API_KEY) {
    try {
      const r = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.SENDGRID_API_KEY}`,
          "Content-Type":  "application/json",
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: ADMIN_EMAIL }] }],
          from: { email: process.env.SENDGRID_FROM || "noreply@edudhruv.com", name: "EduDhruv" },
          reply_to: { email: enq.email },
          subject,
          content: [{ type: "text/html", value: html }],
        }),
      });
      if (r.status === 202) return true;
      console.warn("SendGrid failed:", await r.text());
    } catch (e) { console.warn("SendGrid error:", e); }
  }

  // No email service configured — enquiry still saved to Supabase
  console.warn("No email service configured. Enquiry only saved to DB.");
  return false;
}
