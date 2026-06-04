import { NextRequest, NextResponse } from "next/server";
import { IS_MOCK } from "@/lib/social";

const MOCK_RATINGS = new Map<string, number>(); // "email:slug" -> rating

export async function POST(req: NextRequest) {
  try {
    const { post_slug, rating, review, user } = await req.json();
    if (!user?.email) return NextResponse.json({ error: "Login required" }, { status: 401 });
    if (!post_slug || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Invalid rating (1-5)" }, { status: 400 });
    }

    if (IS_MOCK) {
      MOCK_RATINGS.set(`${user.email}:${post_slug}`, rating);
      return NextResponse.json({ success: true, message: "Thanks for rating!" });
    }

    const { getServiceClient } = await import("@/lib/supabase");
    const db = getServiceClient();
    const { data: portalUser } = await db
      .from("portal_users").select("id").eq("email", user.email.toLowerCase()).maybeSingle();
    if (!portalUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

    await db.from("post_ratings").upsert([{
      post_slug,
      user_id:    portalUser.id,
      user_email: user.email.toLowerCase(),
      rating,
      review:     review?.trim() || null,
    }], { onConflict: "post_slug,user_id" });

    return NextResponse.json({ success: true, message: "Thanks for rating!" });

  } catch (err) {
    console.error("Rating error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Get user's existing rating
export async function GET(req: NextRequest) {
  const slug  = req.nextUrl.searchParams.get("slug");
  const email = req.nextUrl.searchParams.get("email");
  if (!slug || !email) return NextResponse.json({ rating: null });

  if (IS_MOCK) {
    return NextResponse.json({ rating: MOCK_RATINGS.get(`${email}:${slug}`) || null });
  }

  const { getServiceClient } = await import("@/lib/supabase");
  const db = getServiceClient();
  const { data: portalUser } = await db
    .from("portal_users").select("id").eq("email", email.toLowerCase()).maybeSingle();
  if (!portalUser) return NextResponse.json({ rating: null });

  const { data } = await db
    .from("post_ratings").select("rating")
    .eq("post_slug", slug).eq("user_id", portalUser.id).maybeSingle();
  return NextResponse.json({ rating: data?.rating || null });
}
