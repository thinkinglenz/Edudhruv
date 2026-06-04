import { NextRequest, NextResponse } from "next/server";
import { IS_MOCK } from "@/lib/social";

// In-memory mock storage: { "userEmail:postSlug:type" -> true }
const MOCK_REACTIONS = new Map<string, boolean>();

export async function POST(req: NextRequest) {
  try {
    const { post_slug, type, user, action } = await req.json();
    // action: "add" | "remove"
    // type:   "like" | "bookmark" | "helpful"

    if (!user?.email) {
      return NextResponse.json({ error: "Login required" }, { status: 401 });
    }
    if (!post_slug || !type || !["like", "bookmark", "helpful"].includes(type)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    if (IS_MOCK) {
      const key = `${user.email}:${post_slug}:${type}`;
      if (action === "remove") MOCK_REACTIONS.delete(key);
      else MOCK_REACTIONS.set(key, true);
      return NextResponse.json({ success: true, active: MOCK_REACTIONS.has(key) });
    }

    const { getServiceClient } = await import("@/lib/supabase");
    const db = getServiceClient();

    const { data: portalUser } = await db
      .from("portal_users").select("id").eq("email", user.email.toLowerCase()).maybeSingle();
    if (!portalUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (action === "remove") {
      await db.from("post_reactions").delete()
        .eq("post_slug", post_slug)
        .eq("user_id", portalUser.id)
        .eq("type", type);
      return NextResponse.json({ success: true, active: false });
    }

    await db.from("post_reactions").upsert([{
      post_slug, user_id: portalUser.id, type,
    }], { onConflict: "post_slug,user_id,type" });

    return NextResponse.json({ success: true, active: true });

  } catch (err) {
    console.error("Reaction error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Check user's reaction state
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  const email = req.nextUrl.searchParams.get("email");
  if (!slug || !email) return NextResponse.json({ liked: false, bookmarked: false });

  if (IS_MOCK) {
    return NextResponse.json({
      liked:      MOCK_REACTIONS.has(`${email}:${slug}:like`),
      bookmarked: MOCK_REACTIONS.has(`${email}:${slug}:bookmark`),
    });
  }

  const { getServiceClient } = await import("@/lib/supabase");
  const db = getServiceClient();
  const { data: portalUser } = await db
    .from("portal_users").select("id").eq("email", email.toLowerCase()).maybeSingle();
  if (!portalUser) return NextResponse.json({ liked: false, bookmarked: false });

  const { data } = await db
    .from("post_reactions").select("type")
    .eq("post_slug", slug).eq("user_id", portalUser.id);

  const types = (data || []).map((r: { type: string }) => r.type);
  return NextResponse.json({
    liked: types.includes("like"),
    bookmarked: types.includes("bookmark"),
  });
}
