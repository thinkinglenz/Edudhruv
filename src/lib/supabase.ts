import { createClient } from "@supabase/supabase-js";
import type { Post } from "./types";
import { MOCK_POSTS } from "./mock-data";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// Use mock data when Supabase is not configured (local dev / preview)
const IS_MOCK = !supabaseUrl || supabaseUrl.includes("placeholder");

export const supabase = IS_MOCK
  ? (null as any)
  : createClient(supabaseUrl, supabaseAnonKey);

export function getServiceClient() {
  if (IS_MOCK) return null as any;
  return createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false },
  });
}

// ─── POSTS ────────────────────────────────────────────────────────────────

export async function getRecentPosts(limit = 6): Promise<Post[]> {
  if (IS_MOCK) return MOCK_POSTS.slice(0, limit);
  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(limit);
  return data || [];
}

export async function getPostsByCategory(
  categorySlug: string,
  page = 1,
  pageSize = 12
): Promise<{ posts: Post[]; total: number }> {
  if (IS_MOCK) {
    const filtered = MOCK_POSTS.filter((p) => p.category_slug === categorySlug);
    const from = (page - 1) * pageSize;
    return { posts: filtered.slice(from, from + pageSize), total: filtered.length };
  }
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const [{ data, error }, { count }] = await Promise.all([
    supabase
      .from("posts")
      .select("*")
      .eq("category_slug", categorySlug)
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .range(from, to),
    supabase
      .from("posts")
      .select("*", { count: "exact", head: true })
      .eq("category_slug", categorySlug)
      .eq("status", "published"),
  ]);
  if (error) throw error;
  return { posts: data || [], total: count || 0 };
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (IS_MOCK) return MOCK_POSTS.find((p) => p.slug === slug) || null;
  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();
  return data || null;
}

export async function getRelatedPosts(
  categorySlug: string,
  currentSlug: string,
  limit = 3
): Promise<Post[]> {
  if (IS_MOCK) {
    return MOCK_POSTS.filter(
      (p) => p.category_slug === categorySlug && p.slug !== currentSlug
    ).slice(0, limit);
  }
  const { data } = await supabase
    .from("posts")
    .select("id, title, slug, excerpt, category_slug, featured_image_url, created_at, reading_time")
    .eq("category_slug", categorySlug)
    .eq("status", "published")
    .neq("slug", currentSlug)
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data as Post[]) || [];
}

/** Returns top N posts for each category — for homepage category sections */
export async function getPostsByCategoryMap(
  categorySlugs: string[],
  perCategory = 4
): Promise<Record<string, Post[]>> {
  const result: Record<string, Post[]> = {};
  for (const slug of categorySlugs) {
    if (IS_MOCK) {
      result[slug] = MOCK_POSTS.filter(p => p.category_slug === slug).slice(0, perCategory);
    } else {
      const { data } = await supabase
        .from("posts")
        .select("*")
        .eq("category_slug", slug)
        .eq("status", "published")
        .order("created_at", { ascending: false })
        .limit(perCategory);
      result[slug] = (data as Post[]) || [];
    }
  }
  return result;
}

export async function getAllPublishedSlugs(): Promise<
  { category_slug: string; slug: string }[]
> {
  if (IS_MOCK) return MOCK_POSTS.map(({ category_slug, slug }) => ({ category_slug, slug }));
  const { data } = await supabase
    .from("posts")
    .select("category_slug, slug")
    .eq("status", "published");
  return data || [];
}

// ─── TAGS ────────────────────────────────────────────────────────────────
// Tag pages live at /tag/[slug] and rank for long-tail keyword variations
// that don't fit cleanly into our 6 main categories.

/** Convert a tag string to a URL-safe slug (matches /tag/[slug] route). */
export function tagToSlug(tag: string): string {
  return tag.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

/** Get the readable label back from a tag slug (best-effort). */
export function slugToTagLabel(slug: string): string {
  return slug.split("-").map(w => w[0].toUpperCase() + w.slice(1)).join(" ");
}

/** Get all unique tags from published posts with counts (for /tag landing + sitemap). */
export async function getAllTagsWithCounts(): Promise<{ tag: string; slug: string; count: number }[]> {
  if (IS_MOCK) return [];
  const { data } = await supabase
    .from("posts")
    .select("tags")
    .eq("status", "published");
  const counts: Record<string, { tag: string; count: number }> = {};
  for (const row of data || []) {
    for (const t of ((row as any).tags || []) as string[]) {
      const slug = tagToSlug(t);
      if (!slug) continue;
      if (!counts[slug]) counts[slug] = { tag: t, count: 0 };
      counts[slug].count++;
    }
  }
  return Object.entries(counts)
    .map(([slug, v]) => ({ slug, ...v }))
    .filter(t => t.count >= 1)
    .sort((a, b) => b.count - a.count);
}

/** Get all posts tagged with a given tag-slug (matches case-insensitively). */
export async function getPostsByTag(tagSlug: string): Promise<Post[]> {
  if (IS_MOCK) return [];
  // Supabase doesn't support a direct case-insensitive array contains on the
  // tags column, so we fetch by `cs` (contains) on the original tag strings.
  // First find which raw tag values match this slug.
  const allTags = await getAllTagsWithCounts();
  const match = allTags.find(t => t.slug === tagSlug);
  if (!match) return [];
  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("status", "published")
    .contains("tags", [match.tag])
    .order("created_at", { ascending: false })
    .limit(60);
  return (data as Post[]) || [];
}

// ─── LEADS ────────────────────────────────────────────────────────────────

export async function saveLead(lead: {
  name: string;
  email: string;
  phone: string;
  source_post_slug?: string;
  destination?: string;
}) {
  if (IS_MOCK) {
    console.log("[MOCK] Lead saved:", lead);
    return { id: "mock-id", ...lead };
  }
  const { data, error } = await getServiceClient()
    .from("leads")
    .insert([{ ...lead, status: "new" }])
    .select()
    .single();
  if (error) throw error;
  return data;
}
