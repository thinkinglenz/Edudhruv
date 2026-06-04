import { NextRequest, NextResponse } from "next/server";

const IS_MOCK = !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder") ||
  !process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY === "placeholder";

function isAuthenticated(req: NextRequest): boolean {
  const cookie = req.cookies.get("edudhruv_admin_v1")?.value;
  const pw = process.env.ADMIN_PASSWORD || "EduDhruv@Admin2025";
  const expected = btoa(`edudhruv::${pw}::admin_ok`).replace(/=/g, "");
  return cookie === expected;
}

// PATCH /api/admin/posts/[id] — update existing post
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (IS_MOCK) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });

  try {
    const body = await req.json();
    const { getServiceClient } = await import("@/lib/supabase");
    const db = getServiceClient();

    const update: any = {};
    const allowed = ["title", "slug", "content", "excerpt", "category_slug",
                     "meta_title", "meta_description", "focus_keyword",
                     "featured_image_url", "featured_image_alt",
                     "reading_time", "tags", "status"];
    for (const k of allowed) if (k in body) update[k] = body[k];

    const { data, error } = await db.from("posts")
      .update(update)
      .eq("id", params.id)
      .select().single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Revalidate the post URL + homepage + category
    if (data) {
      const url = process.env.SITE_URL || "";
      const secret = process.env.REVALIDATE_SECRET || "";
      if (url && secret) {
        fetch(`${url}/api/revalidate`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-revalidate-secret": secret },
          body: JSON.stringify({ slug: data.slug, category: data.category_slug }),
        }).catch(() => {});
      }
    }

    return NextResponse.json({ success: true, post: data });

  } catch (err: any) {
    console.error("PATCH post error:", err);
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
  }
}

// DELETE /api/admin/posts/[id]
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (IS_MOCK) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });

  try {
    const { getServiceClient } = await import("@/lib/supabase");
    const db = getServiceClient();
    const { error } = await db.from("posts").delete().eq("id", params.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
  }
}
