/**
 * Helper for /latest — paginated list of ALL published posts across categories.
 * Used by the "View all" links from homepage + tag pages.
 */
import type { Post } from "./types";

const IS_MOCK = !process.env.NEXT_PUBLIC_SUPABASE_URL ||
                process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder") ||
                !process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function getAllPostsPaginated(
  page: number = 1,
  pageSize: number = 24,
): Promise<{ posts: Post[]; total: number; totalPages: number }> {
  if (IS_MOCK) return { posts: [], total: 0, totalPages: 0 };

  const { supabase } = await import("./supabase");
  const from = (page - 1) * pageSize;
  const to   = from + pageSize - 1;

  const [{ data }, { count }] = await Promise.all([
    supabase
      .from("posts")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .range(from, to),
    supabase
      .from("posts")
      .select("*", { count: "exact", head: true })
      .eq("status", "published"),
  ]);

  const total = count || 0;
  return {
    posts:      (data as Post[]) || [],
    total,
    totalPages: Math.ceil(total / pageSize),
  };
}
