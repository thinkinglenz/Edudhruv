/**
 * Lead Magnet endpoint — gates a downloadable HTML/print-friendly resource
 * behind email signup.
 *
 *   POST /api/lead-magnet
 *   Body: { email, name, magnet_slug }
 *
 * On success: returns { success: true, download_url }
 * Stores the email in newsletter_subscribers + fires admin notification.
 *
 * Magnets are static HTML files served from /public/lead-magnets/ that
 * print well to PDF (Cmd+P → Save as PDF).
 */
import { NextRequest, NextResponse } from "next/server";

const MAGNETS = new Set([
  "100-funded-scholarships-master-list",
  "education-loan-comparison-2027",
  "ms-cs-usa-application-checklist",
  "mba-applications-timeline-2027",
]);

const ADMIN_EMAIL = process.env.LEAD_NOTIFY_EMAIL || "edudruv@gmail.com";

function isValidEmail(s: string): boolean {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(s);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, name, magnet_slug } = body as Record<string, string>;

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }
    if (!name || name.trim().length < 2) {
      return NextResponse.json({ error: "Name required" }, { status: 400 });
    }
    if (!magnet_slug || !MAGNETS.has(magnet_slug)) {
      return NextResponse.json({ error: "Invalid magnet" }, { status: 400 });
    }

    // Save to newsletter table (idempotent via upsert)
    const IS_MOCK = !process.env.NEXT_PUBLIC_SUPABASE_URL ||
                    !process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!IS_MOCK) {
      try {
        const { getServiceClient } = await import("@/lib/supabase");
        const sb = getServiceClient();
        await sb.from("newsletter_subscribers").upsert({
          email:        email.toLowerCase().trim(),
          name:         name.trim(),
          source_slug:  `magnet-${magnet_slug}`,
          source_url:   req.headers.get("referer") || null,
          status:       "active",
        }, { onConflict: "email" });
      } catch (e) {
        console.warn("[lead-magnet] supabase save error:", e);
      }
    }

    // Notify admin via Resend
    if (process.env.RESEND_API_KEY) {
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from:    process.env.RESEND_FROM || "EduDhruv <onboarding@resend.dev>",
          to:      [ADMIN_EMAIL],
          subject: `📥 Lead magnet downloaded: ${magnet_slug}`,
          html: `<p>${name} (${email}) downloaded <strong>${magnet_slug}</strong>.</p>`,
        }),
      }).catch(() => {});

      // Also send the download to the user
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from:    process.env.RESEND_FROM || "EduDhruv <onboarding@resend.dev>",
          to:      [email],
          subject: "Your free guide is ready 📥",
          html: `
<div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto">
  <h2 style="color:#3AAFE5">Hi ${name},</h2>
  <p>Your free guide is ready to download — and you can save it as PDF anytime:</p>
  <p style="text-align:center;margin:24px 0">
    <a href="https://www.edudhruv.com/lead-magnets/${magnet_slug}"
       style="display:inline-block;background:#3AAFE5;color:white;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:bold">
      📥 Open guide
    </a>
  </p>
  <p style="color:#666;font-size:13px">
    💡 <strong>Save as PDF:</strong> Open the link → Cmd+P (Mac) or Ctrl+P (Windows) → "Save as PDF". The guide is print-formatted.
  </p>
  <hr style="border:0;border-top:1px solid #eee;margin:24px 0">
  <p style="color:#888;font-size:13px">
    You're also subscribed to our Sunday digest of new scholarships + study-abroad deadlines.
    Unsubscribe anytime by replying with "unsubscribe".
  </p>
</div>`,
        }),
      }).catch(() => {});
    }

    return NextResponse.json({
      success:      true,
      download_url: `/lead-magnets/${magnet_slug}`,
    });
  } catch (e: any) {
    console.error("[lead-magnet] handler error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
