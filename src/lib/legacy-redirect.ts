/**
 * Shared helper for legacy URL patterns (old WordPress slugs) that map
 * to current posts under different category paths.
 *
 * Looks up the slug in posts table; if found, returns the canonical URL.
 * Used by /latest/[slug], /scholarships/[slug], /news/[slug], etc.
 */
import { permanentRedirect, notFound } from "next/navigation";

const IS_MOCK = !process.env.NEXT_PUBLIC_SUPABASE_URL ||
                process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");

export async function redirectToCanonicalOrNotFound(slug: string): Promise<never> {
  if (IS_MOCK) notFound();

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
      },
    });

    if (response.ok) {
      const data = await response.json();
      const post = Array.isArray(data) && data.length > 0 ? data[0] : null;

      if (post && post.category_slug && post.slug) {
        // 301 permanent redirect — passes SEO juice to canonical URL
        permanentRedirect(`/${post.category_slug}/${post.slug}`);
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
