/**
 * Newsletter signup endpoint.
 *
 * POST /api/newsletter
 * Body: { email, name?, source_slug?, source_url? }
 *
 * Stores in Supabase newsletter_subscribers table. You can later wire
 * a Vercel cron that syncs new rows to Mailchimp/Buttondown/ConvertKit.
 *
 * Also fires off a notification email to the admin via Resend so you
 * know someone signed up.
 */
import { NextRequest, NextResponse } from "next/server";

const IS_MOCK = !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  !process.env.SUPABASE_SERVICE_ROLE_KEY;

const ADMIN_EMAIL = process.env.LEAD_NOTIFY_EMAIL || "edudruv@gmail.com";

function isValidEmail(s: string): boolean {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(s);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, name, source_slug, source_url } = body as Record<string, string>;

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }
    if (email.length > 254) {
      return NextResponse.json({ error: "Email too long" }, { status: 400 });
    }

    if (IS_MOCK) {
      // In dev — pretend success
      return NextResponse.json({ success: true, mock: true });
    }

    const { getServiceClient } = await import("@/lib/supabase");
    const sb = getServiceClient();
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || null;
    const ua = req.headers.get("user-agent") || null;

    const { error } = await sb
      .from("newsletter_subscribers")
      .upsert(
        {
          email:       email.toLowerCase().trim(),
          name:        name?.trim() || null,
          source_slug: source_slug || null,
          source_url:  source_url || null,
          ip_address:  ip,
          user_agent:  ua,
          status:      "active",
        },
        { onConflict: "email", ignoreDuplicates: false },
      );

    if (error) {
      console.error("[newsletter] supabase error:", error);
      // Don't expose details — just succeed (idempotent UX)
    }

    // Fire-and-forget admin notification (don't block response)
    if (process.env.RESEND_API_KEY) {
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM || "EduDhruv <onboarding@resend.dev>",
          to: [ADMIN_EMAIL],
          subject: `🎉 New newsletter signup: ${email}`,
          html: `
<div style="font-family:system-ui,sans-serif">
  <h2>New subscriber</h2>
  <p><strong>Email:</strong> ${email}</p>
  ${name ? `<p><strong>Name:</strong> ${name}</p>` : ""}
  ${source_slug ? `<p><strong>From post:</strong> ${source_slug}</p>` : ""}
  ${source_url ? `<p><strong>Page:</strong> <a href="${source_url}">${source_url}</a></p>` : ""}
  <hr>
  <p style="color:#666;font-size:12px">View all subscribers in your Supabase newsletter_subscribers table.</p>
</div>`,
        }),
      }).catch(() => {});
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("[newsletter] handler error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
