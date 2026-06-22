/**
 * Shared helper for legacy URL patterns (old WordPress slugs) that map
 * to current posts under different category paths.
 *
 * Looks up the slug in posts table; if found, returns the canonical URL.
 * Used by /latest/[slug], /scholarships/[slug], /news/[slug], etc.
 *
 * Optimizations:
 * - In-memory cache: 1hr TTL for redirect lookups
 * - Reduces Supabase queries on repeated crawler hits
 * - Serves 54 GSC-fixed URLs efficiently
 */
import { permanentRedirect, notFound } from "next/navigation";

const IS_MOCK = !process.env.NEXT_PUBLIC_SUPABASE_URL ||
                process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");

// Simple in-memory cache with 1-hour TTL
const redirectCache = new Map<string, { url: string; timestamp: number }>();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

function getCachedRedirect(slug: string): string | null {
  const cached = redirectCache.get(slug);
  if (!cached) return null;

  const isExpired = Date.now() - cached.timestamp > CACHE_TTL_MS;
  if (isExpired) {
    redirectCache.delete(slug);
    return null;
  }

  return cached.url;
}

function setCachedRedirect(slug: string, url: string): void {
  redirectCache.set(slug, { url, timestamp: Date.now() });
}

export async function redirectToCanonicalOrNotFound(slug: string): Promise<never> {
  if (IS_MOCK) notFound();

  // Check cache first
  const cachedUrl = getCachedRedirect(slug);
  if (cachedUrl) {
    permanentRedirect(cachedUrl);
  }

  // Use REST API directly for more reliable query execution
  const url = new URL(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/posts`
  );
  url.searchParams.set("slug", `eq.${slug}`);
  url.searchParams.set("status", "eq.published");
  url.searchParams.set("select", "category_slug,slug");

  try {
    const response = await fetch(url.toString(), {
      headers: {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
        // Prefer cached responses from Supabase edge CDN
        "Prefer": "return=minimal",
      },
    });

    if (response.ok) {
      const data = await response.json();
      const post = Array.isArray(data) && data.length > 0 ? data[0] : null;

      if (post && post.category_slug && post.slug) {
        const redirectUrl = `/${post.category_slug}/${post.slug}`;
        // Cache for future requests
        setCachedRedirect(slug, redirectUrl);
        // 301 permanent redirect — passes SEO juice to canonical URL
        permanentRedirect(redirectUrl);
      }
    }
  } catch (err) {
    // Re-throw Next.js redirect/notFound errors
    if (err instanceof Error && (err.message === "NEXT_REDIRECT" || err.message === "NEXT_NOT_FOUND")) {
      throw err;
    }
    // Network error, fall through to notFound()
  }

  notFound();
}
