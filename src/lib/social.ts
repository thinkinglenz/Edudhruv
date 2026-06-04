// Social engagement helpers — works in mock mode + Supabase mode

export interface Comment {
  id: string;
  post_slug: string;
  user_id: string | null;
  parent_id: string | null;
  author_name: string;
  author_email: string;
  content: string;
  status: "pending" | "approved" | "spam" | "trash";
  likes_count: number;
  created_at: string;
  replies?: Comment[];
}

export interface PostStats {
  post_slug: string;
  view_count: number;
  share_count: number;
  like_count: number;
  bookmark_count: number;
  comment_count: number;
  avg_rating: number;
  rating_count: number;
}

export const IS_MOCK = !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder") ||
  !process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY === "placeholder";

// ─── Mock storage (in-memory) ────────────────────────────────────────────
const MOCK_COMMENTS: Comment[] = [
  {
    id: "demo-1",
    post_slug: "mpower-financing-student-loan-review-2025-6",
    user_id: "demo-user-1",
    parent_id: null,
    author_name: "Rahul Sharma",
    author_email: "rahul@example.com",
    content: "Very helpful article! I applied for MPOWER loan and got approved within 2 weeks. The process was smooth.",
    status: "approved",
    likes_count: 12,
    created_at: "2026-05-20T10:00:00Z",
  },
  {
    id: "demo-2",
    post_slug: "mpower-financing-student-loan-review-2025-6",
    user_id: "demo-user-2",
    parent_id: null,
    author_name: "Priya Nair",
    author_email: "priya@example.com",
    content: "Could you compare MPOWER with Prodigy Finance? I'm torn between the two.",
    status: "approved",
    likes_count: 8,
    created_at: "2026-05-22T14:30:00Z",
  },
];

const MOCK_STATS: Record<string, PostStats> = {};

// ─── Public API ──────────────────────────────────────────────────────────

export async function getComments(postSlug: string): Promise<Comment[]> {
  if (IS_MOCK) {
    return MOCK_COMMENTS
      .filter(c => c.post_slug === postSlug && c.status === "approved")
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }
  const { getServiceClient } = await import("./supabase");
  const { data } = await getServiceClient()
    .from("comments")
    .select("*")
    .eq("post_slug", postSlug)
    .eq("status", "approved")
    .order("created_at", { ascending: false });
  return (data as Comment[]) || [];
}

export async function getPostStats(postSlug: string): Promise<PostStats> {
  const empty: PostStats = {
    post_slug: postSlug, view_count: 0, share_count: 0, like_count: 0,
    bookmark_count: 0, comment_count: 0, avg_rating: 0, rating_count: 0,
  };
  if (IS_MOCK) {
    if (!MOCK_STATS[postSlug]) {
      MOCK_STATS[postSlug] = {
        ...empty,
        view_count:   Math.floor(Math.random() * 500) + 100,
        like_count:   Math.floor(Math.random() * 30) + 5,
        share_count:  Math.floor(Math.random() * 50) + 10,
        comment_count: MOCK_COMMENTS.filter(c => c.post_slug === postSlug && c.status === "approved").length,
        avg_rating:   parseFloat((4 + Math.random()).toFixed(1)),
        rating_count: Math.floor(Math.random() * 40) + 10,
      };
    }
    return MOCK_STATS[postSlug];
  }
  const { getServiceClient } = await import("./supabase");
  const { data } = await getServiceClient()
    .from("post_stats")
    .select("*")
    .eq("post_slug", postSlug)
    .maybeSingle();
  return (data as PostStats) || empty;
}

// Mock-mode helpers exposed for the comment API
export function addMockComment(c: Omit<Comment, "id" | "created_at" | "likes_count" | "status"> & { status?: Comment["status"] }) {
  MOCK_COMMENTS.push({
    ...c,
    id:          `mock-${Date.now()}`,
    likes_count: 0,
    status:      c.status || "approved", // auto-approve in mock mode
    created_at:  new Date().toISOString(),
  });
}
