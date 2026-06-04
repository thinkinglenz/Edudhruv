import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
import { verifyTurnstile } from "@/lib/turnstile";

const RATE_LIMIT = new Map<string, { count: number; ts: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = RATE_LIMIT.get(ip);
  if (!entry || now - entry.ts > 3600000) {
    RATE_LIMIT.set(ip, { count: 1, ts: now });
    return false;
  }
  if (entry.count >= 3) return true;
  entry.count++;
  return false;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const body = await req.json();
    const { name, email, phone, source_post_slug, destination, captchaToken } = body;

    // ─── Cloudflare Turnstile verification ─────────────────────────────
    const captcha = await verifyTurnstile(captchaToken, ip);
    if (!captcha.success) {
      return NextResponse.json({ error: captcha.error || "Security check failed" }, { status: 400 });
    }

    // Basic validation
    if (!name || !email || !phone) {
      return NextResponse.json({ error: "name, email, phone required" }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    if (!/^\+?[\d\s\-()]{7,15}$/.test(phone)) {
      return NextResponse.json({ error: "Invalid phone" }, { status: 400 });
    }

    const isMock = !process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY === "placeholder";
    if (isMock) {
      console.log("[MOCK] Lead received:", { name, email, phone, source_post_slug });
      return NextResponse.json({ success: true });
    }

    const db = getServiceClient();

    // Duplicate check (same email in last 24h)
    const { data: existing } = await db
      .from("leads")
      .select("id")
      .eq("email", email.toLowerCase())
      .gte("created_at", new Date(Date.now() - 86400000).toISOString())
      .maybeSingle();

    if (existing) {
      // Still return 200 so user doesn't know
      return NextResponse.json({ success: true });
    }

    // Save lead
    await db.from("leads").insert([{
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      source_post_slug: source_post_slug || null,
      destination: destination || null,
      status: "new",
    }]);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Lead API error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
