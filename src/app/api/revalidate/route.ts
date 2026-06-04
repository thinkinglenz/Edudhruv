import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

/**
 * On-demand cache revalidation.
 * Called by the blog agent after publishing a new post to immediately
 * refresh the homepage, category pages, and sitemap (instead of waiting
 * up to 1 hour for ISR).
 *
 * POST /api/revalidate
 * Headers: x-revalidate-secret: <REVALIDATE_SECRET>
 * Body:    { paths?: string[], slug?: string, category?: string }
 *
 * Example body:
 *   {
 *     "slug":     "life-canada-indian-students-2026",
 *     "category": "indian-students-abroad"
 *   }
 */

export async function POST(req: NextRequest) {
  // Auth — only the agent should call this
  const secret = req.headers.get("x-revalidate-secret");
  const expected = process.env.REVALIDATE_SECRET;
  if (!expected || secret !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { slug, category, paths } = body as {
      slug?: string; category?: string; paths?: string[];
    };

    const revalidated: string[] = [];

    // Always revalidate the homepage + sitemap when anything changes
    revalidatePath("/");                          revalidated.push("/");
    revalidatePath("/sitemap.xml");               revalidated.push("/sitemap.xml");
    revalidatePath("/latest");                    revalidated.push("/latest");

    // Revalidate the specific category if given
    if (category) {
      revalidatePath(`/${category}`);             revalidated.push(`/${category}`);
    }

    // Revalidate the specific post URL if both slug and category given
    if (slug && category) {
      revalidatePath(`/${category}/${slug}`);     revalidated.push(`/${category}/${slug}`);
    }

    // Caller can also pass arbitrary paths to invalidate
    if (Array.isArray(paths)) {
      for (const p of paths) {
        revalidatePath(p);                        revalidated.push(p);
      }
    }

    return NextResponse.json({
      success: true,
      revalidated,
      timestamp: new Date().toISOString(),
    });

  } catch (err: any) {
    console.error("Revalidate error:", err);
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
  }
}

// Helpful health check
export async function GET() {
  return NextResponse.json({
    endpoint: "POST /api/revalidate",
    auth:     "x-revalidate-secret header",
    body:     { slug: "post-slug", category: "category-slug", paths: ["/optional", "/extra"] },
  });
}
