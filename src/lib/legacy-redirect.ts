/**
 * Shared helper for legacy URL patterns (old WordPress slugs) that map
 * to current posts under different category paths.
 *
 * Looks up the slug in posts table; if found, returns the canonical URL.
 * Used by /latest/[slug], /scholarships/[slug], /news/[slug], etc.
 */
import { permanentRedirect, notFound } from "next/navigation";

const IS_MOCK = !process.env.NEXT_PUBLIC_SUPABASE_URL ||
                process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder") ||
                !process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function redirectToCanonicalOrNotFound(slug: string): Promise<never> {
  if (IS_MOCK) notFound();

  const { supabase } = await import("./supabase");
  // Lookup against PUBLISHED posts only — drafts get 404
  const { data } = await supabase
    .from("posts")
    .select("category_slug,slug,status")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (data && data.category_slug && data.slug) {
    // 301 permanent redirect — passes SEO juice to canonical URL
    permanentRedirect(`/${data.category_slug}/${data.slug}`);
  }

  notFound();
}
