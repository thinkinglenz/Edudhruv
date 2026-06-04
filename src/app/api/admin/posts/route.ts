import { NextRequest, NextResponse } from "next/server";

const IS_MOCK = !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder") ||
  !process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY === "placeholder";

// Admin auth — already protected by middleware, but check cookie defensively
function isAuthenticated(req: NextRequest): boolean {
  const cookie = req.cookies.get("edudhruv_admin_v1")?.value;
  const pw = process.env.ADMIN_PASSWORD || "EduDhruv@Admin2025";
  const expected = btoa(`edudhruv::${pw}::admin_ok`).replace(/=/g, "");
  return cookie === expected;
}

export async function POST(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (IS_MOCK) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });

  try {
    const body = await req.json();
    const { title, slug, content, category_slug } = body;
    if (!title || !slug || !category_slug) {
      return NextResponse.json({ error: "title, slug, category_slug required" }, { status: 400 });
    }

    const { getServiceClient } = await import("@/lib/supabase");
    const db = getServiceClient();

    // Check slug uniqueness
    const { data: existing } = await db.from("posts").select("id").eq("slug", slug).maybeSingle();
    if (existing) {
      return NextResponse.json({ error: `Slug "${slug}" already exists. Pick a different slug.` }, { status: 409 });
    }

    const { data, error } = await db.from("posts").insert([{
      title:              body.title,
      slug:               body.slug,
      content:            body.content || "",
      excerpt:            body.excerpt || "",
      category_slug:      body.category_slug,
      meta_title:         body.meta_title || body.title,
      meta_description:   body.meta_description || "",
      focus_keyword:      body.focus_keyword || "",
      featured_image_url: body.featured_image_url || null,
      featured_image_alt: body.featured_image_alt || null,
      reading_time:       body.reading_time || 5,
      tags:               body.tags || [],
      status:             body.status || "draft",
    }]).select().single();

    if (error) {
      console.error("Insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Trigger Vercel revalidation so the new post appears immediately
    triggerRevalidation(body.category_slug, body.slug).catch(() => {});

    return NextResponse.json({ success: true, post: data });

  } catch (err: any) {
    console.error("Admin posts POST error:", err);
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
  }
}

async function triggerRevalidation(category: string, slug: string) {
  const url = process.env.SITE_URL || "";
  const secret = process.env.REVALIDATE_SECRET || "";
  if (!url || !secret) return;
  try {
    await fetch(`${url}/api/revalidate`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-revalidate-secret": secret },
      body: JSON.stringify({ slug, category }),
    });
  } catch {}
}
