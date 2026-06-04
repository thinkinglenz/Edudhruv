import { NextRequest, NextResponse } from "next/server";
import { IS_MOCK, getComments, addMockComment } from "@/lib/social";

// Rate limiter: 5 comments/IP/hour
const RATE = new Map<string, { count: number; ts: number }>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const e = RATE.get(ip);
  if (!e || now - e.ts > 3600000) { RATE.set(ip, { count: 1, ts: now }); return false; }
  if (e.count >= 5) return true;
  e.count++;
  return false;
}

// Simple profanity / spam check
const SPAM_KEYWORDS = ["viagra", "casino", "crypto airdrop", "free money", "click here >>", "buy followers"];
function isSpam(text: string): boolean {
  const lower = text.toLowerCase();
  if (SPAM_KEYWORDS.some(kw => lower.includes(kw))) return true;
  // Too many links
  const linkCount = (text.match(/https?:\/\//g) || []).length;
  if (linkCount > 2) return true;
  // ALL CAPS spam
  const upperRatio = (text.match(/[A-Z]/g) || []).length / Math.max(text.length, 1);
  if (text.length > 30 && upperRatio > 0.7) return true;
  return false;
}

// ─── GET /api/social/comments?slug=... ───────────────────────────────────
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });

  const comments = await getComments(slug);
  return NextResponse.json({ comments });
}

// ─── POST /api/social/comments ──────────────────────────────────────────
export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Too many comments. Try again in an hour." }, { status: 429 });
  }

  try {
    const { post_slug, content, parent_id, user } = await req.json();

    if (!user || !user.email || !user.name) {
      return NextResponse.json({ error: "Login required to comment" }, { status: 401 });
    }
    if (!post_slug || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (content.length < 2 || content.length > 5000) {
      return NextResponse.json({ error: "Comment must be 2-5000 characters" }, { status: 400 });
    }

    const status = isSpam(content) ? "spam" : "pending"; // all comments go to moderation
    const ua = req.headers.get("user-agent") || "";

    if (IS_MOCK) {
      // Mock mode: auto-approve (since admin can't moderate without DB)
      addMockComment({
        post_slug,
        user_id:      user.email,   // use email as ID in mock
        parent_id:    parent_id || null,
        author_name:  user.name,
        author_email: user.email,
        content:      content.trim(),
        status:       "approved",   // auto-approve in mock
      });
      return NextResponse.json({
        success: true,
        message: "Comment posted!",
        autoApproved: true,
      });
    }

    // Supabase mode
    const { getServiceClient } = await import("@/lib/supabase");
    const db = getServiceClient();

    // Find user by email to link
    const { data: portalUser } = await db
      .from("portal_users")
      .select("id")
      .eq("email", user.email.toLowerCase())
      .maybeSingle();

    const { error } = await db.from("comments").insert([{
      post_slug,
      user_id:      portalUser?.id || null,
      parent_id:    parent_id || null,
      author_name:  user.name,
      author_email: user.email.toLowerCase(),
      content:      content.trim(),
      status,
      ip_address:   ip,
      user_agent:   ua,
    }]);

    if (error) {
      console.error("Comment insert error:", error);
      return NextResponse.json({ error: "Could not save comment" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: status === "pending"
        ? "Comment submitted! Will appear after moderation."
        : "Your comment was flagged as spam. If this is a mistake, please contact us.",
      autoApproved: false,
    });

  } catch (err) {
    console.error("Comment API error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
