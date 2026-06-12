/**
 * Bulk-assign Unsplash images to published posts that don't have one.
 *
 *   POST /api/admin/auto-images
 *   Headers: x-revalidate-secret: <REVALIDATE_SECRET>
 *   Body:    { dry_run?: boolean, limit?: number }
 *
 * Runs on Vercel where UNSPLASH_ACCESS_KEY is set. Picks a query based
 * on the post's category + first 3 title words, fetches a random
 * landscape Unsplash photo, saves to Supabase.
 *
 * Returns: { updated, skipped, errors, samples }
 */
import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, verifySession } from "@/lib/admin-auth";

export const runtime    = "nodejs";
export const dynamic    = "force-dynamic";
export const maxDuration = 60;  // up to 60s per request

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "EduDhruv@Admin2025";

function isAuthenticated(req: NextRequest): boolean {
  // Accept either the revalidate secret (for cron/script use) or admin cookie (for UI button)
  const secret = req.headers.get("x-revalidate-secret");
  if (process.env.REVALIDATE_SECRET && secret === process.env.REVALIDATE_SECRET) return true;
  const cookie = req.cookies.get(ADMIN_COOKIE)?.value;
  if (cookie && verifySession(cookie, ADMIN_PASSWORD, "admin_ok")) return true;
  return false;
}

const CATEGORY_QUERIES: Record<string, string> = {
  "education-loan":         "indian student bank finance loan",
  "scholarship":            "university scholarship graduation student",
  "top-universities":       "university campus building architecture",
  "indian-students-abroad": "indian student travel abroad",
  "student-accommodation":  "student dormitory apartment housing",
  "travel-essentials":      "student travel airport luggage",
};

interface UnsplashResp {
  urls: { regular: string; small: string };
  alt_description: string | null;
  user: { name: string; links: { html: string } };
}

async function unsplashOne(query: string): Promise<{ url: string; alt: string; credit: string } | null> {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) return null;
  const url = `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&orientation=landscape&content_filter=high`;
  try {
    const r = await fetch(url, {
      headers: { Authorization: `Client-ID ${key}` },
      cache: "no-store",
    });
    if (!r.ok) {
      console.warn(`[auto-images] Unsplash HTTP ${r.status} for '${query}'`);
      return null;
    }
    const d = (await r.json()) as UnsplashResp;
    return {
      url:    d.urls.regular,
      alt:    (d.alt_description || query).slice(0, 200),
      credit: `Photo by <a href="${d.user.links.html}?utm_source=edudhruv&utm_medium=referral" target="_blank" rel="noopener">${d.user.name}</a> on <a href="https://unsplash.com?utm_source=edudhruv&utm_medium=referral" target="_blank" rel="noopener">Unsplash</a>`,
    };
  } catch (e) {
    console.warn("[auto-images] Unsplash error:", e);
    return null;
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const dryRun = body.dry_run === true;
  const limit  = Math.min(Math.max(parseInt(body.limit) || 50, 1), 100);

  const { getServiceClient } = await import("@/lib/supabase");
  const sb = getServiceClient();

  // Find posts missing featured_image_url (published only)
  const { data: posts, error } = await sb
    .from("posts")
    .select("id,slug,category_slug,title")
    .eq("status", "published")
    .is("featured_image_url", null)
    .limit(limit);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (!posts || posts.length === 0) {
    return NextResponse.json({ updated: 0, message: "No posts missing images" });
  }

  if (dryRun) {
    return NextResponse.json({
      would_update: posts.length,
      samples: posts.slice(0, 5).map((p: any) => `${p.category_slug}/${p.slug}`),
    });
  }

  const updated: string[] = [];
  const errors: { slug: string; error: string }[] = [];

  for (const p of posts) {
    const baseQ = CATEGORY_QUERIES[p.category_slug] || "education student";
    const titleHead = p.title.split(/\s+/).slice(0, 3).join(" ");

    // Try in order: title+category → category alone → generic education
    // Unsplash returns null for over-specific multi-word queries.
    const queries = [
      `${titleHead} ${baseQ}`,
      baseQ,
      "education student",
    ];

    let img = null;
    for (const q of queries) {
      img = await unsplashOne(q);
      if (img) break;
      await new Promise(r => setTimeout(r, 300));  // small backoff between retries
    }

    if (!img) {
      errors.push({ slug: p.slug, error: "Unsplash returned no image (tried 3 queries)" });
      continue;
    }

    const { error: updErr } = await sb
      .from("posts")
      .update({
        featured_image_url:    img.url,
        featured_image_alt:    img.alt,
        featured_image_credit: img.credit,
      })
      .eq("id", p.id);

    if (updErr) {
      errors.push({ slug: p.slug, error: updErr.message });
    } else {
      updated.push(p.slug);
    }

    // Stay under Unsplash's 50 req/hr free-tier rate limit — slow gentle pacing
    await new Promise(r => setTimeout(r, 700));
  }

  return NextResponse.json({
    updated:  updated.length,
    failed:   errors.length,
    samples:  updated.slice(0, 10),
    errors:   errors.slice(0, 10),
  });
}
