import AdminHeader from "@/components/admin/AdminHeader";
import SocialTabs from "@/components/admin/SocialTabs";
import SocialPublisher, { PostForShare } from "@/components/admin/SocialPublisher";

export const dynamic = "force-dynamic";

const IS_MOCK = !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder") ||
  !process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY === "placeholder";

async function getRecentPosts(): Promise<PostForShare[]> {
  if (IS_MOCK) return [];
  const { getServiceClient } = await import("@/lib/supabase");
  const { data } = await getServiceClient()
    .from("posts")
    .select("slug,title,excerpt,category_slug,featured_image_url,published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(100);
  return (data || []) as PostForShare[];
}

export default async function SocialPublishPage() {
  const posts = await getRecentPosts();
  const siteUrl = (process.env.SITE_URL || "https://www.edudhruv.com").replace(/\/$/, "");

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader
        title="Social Sharing"
        subtitle="Compose & share posts to LinkedIn, X, Facebook, WhatsApp"
      />
      <SocialTabs />

      <div className="flex-1 p-6 overflow-auto">
        {posts.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
            <p className="text-5xl mb-3">📝</p>
            <h3 className="text-white font-bold text-lg mb-2">No published posts yet</h3>
            <p className="text-gray-400 text-sm">Publish a post first, then come back to share it.</p>
          </div>
        ) : (
          <>
            {/* Quick help */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-4 flex items-start gap-3">
              <span className="text-xl flex-shrink-0">💡</span>
              <div className="text-sm">
                <p className="text-gray-300 font-medium">How this works</p>
                <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">
                  Pick a post → click a platform button → edit the auto-generated caption → click <strong>Copy text</strong> then <strong>Open [Platform]</strong>.
                  Captions are tailored per platform: short for X (280 chars), professional for LinkedIn, warm for Facebook.
                </p>
              </div>
            </div>

            <SocialPublisher posts={posts} siteUrl={siteUrl} />
          </>
        )}
      </div>
    </div>
  );
}
