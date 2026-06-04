import { NextRequest, NextResponse } from "next/server";
import { IS_MOCK } from "@/lib/social";

// Log share events for analytics
export async function POST(req: NextRequest) {
  try {
    const { post_slug, platform, user } = await req.json();
    if (!post_slug || !platform) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    const allowed = ["whatsapp", "twitter", "facebook", "linkedin", "email", "copy", "native", "pinterest", "reddit", "telegram"];
    if (!allowed.includes(platform)) return NextResponse.json({ error: "Invalid platform" }, { status: 400 });

    if (IS_MOCK) {
      // Just log and return — no persistence needed in mock
      console.log(`[MOCK SHARE] ${post_slug} → ${platform}`);
      return NextResponse.json({ success: true });
    }

    const { getServiceClient } = await import("@/lib/supabase");
    const db = getServiceClient();

    let userId = null;
    if (user?.email) {
      const { data: portalUser } = await db
        .from("portal_users").select("id").eq("email", user.email.toLowerCase()).maybeSingle();
      userId = portalUser?.id || null;
    }

    await db.from("post_shares").insert([{ post_slug, platform, user_id: userId }]);
    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("Share log error:", err);
    return NextResponse.json({ success: false });
  }
}
