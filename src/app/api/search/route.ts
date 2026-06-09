/**
 * Site-wide search API.
 *
 *   GET /api/search?q=education+loan
 *
 * Returns grouped results across posts, scholarships, universities,
 * and static pages. Used by the SearchModal (Cmd+K) + /search page.
 */
import { NextRequest, NextResponse } from "next/server";
import { searchSite } from "@/lib/search";

export const dynamic = "force-dynamic";   // never cache search results
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") || "").slice(0, 200);
  const limitStr = req.nextUrl.searchParams.get("limit");
  const limit = limitStr ? Math.min(50, Math.max(1, parseInt(limitStr))) : 30;

  if (!q.trim()) {
    return NextResponse.json({
      query: "",
      total: 0,
      results: [],
      grouped: { posts: [], scholarships: [], universities: [], pages: [] },
      durationMs: 0,
    });
  }

  const result = await searchSite(q, limit);
  return NextResponse.json(result, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  });
}
