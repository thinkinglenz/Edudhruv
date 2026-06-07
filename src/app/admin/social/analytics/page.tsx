import AdminHeader from "@/components/admin/AdminHeader";
import SocialTabs from "@/components/admin/SocialTabs";
import Link from "next/link";

export const dynamic = "force-dynamic";

const IS_MOCK = !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder") ||
  !process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY === "placeholder";

// ─── DATA FETCHERS ───────────────────────────────────────────────────────
async function getSocialData() {
  if (IS_MOCK) {
    return {
      totals: { likes: 0, shares: 0, bookmarks: 0, comments: 0, ratings: 0, avgRating: 0 },
      topLiked: [], topShared: [], topRated: [],
      sharesByPlatform: [], recentShares: [],
    };
  }
  const { getServiceClient } = await import("@/lib/supabase");
  const sb = getServiceClient();

  // Aggregate stats across all posts
  const { data: allStats } = await sb
    .from("post_stats")
    .select("post_slug,view_count,share_count,like_count,bookmark_count,comment_count,avg_rating,rating_count");

  const stats = allStats || [];
  const totals = stats.reduce((acc: any, s: any) => ({
    likes:     acc.likes     + (s.like_count     || 0),
    shares:    acc.shares    + (s.share_count    || 0),
    bookmarks: acc.bookmarks + (s.bookmark_count || 0),
    comments:  acc.comments  + (s.comment_count  || 0),
    ratings:   acc.ratings   + (s.rating_count   || 0),
    views:     (acc.views || 0) + (s.view_count   || 0),
  }), { likes: 0, shares: 0, bookmarks: 0, comments: 0, ratings: 0, views: 0 });

  const ratedPosts = stats.filter((s: any) => (s.rating_count || 0) > 0);
  const avgRating = ratedPosts.length
    ? ratedPosts.reduce((a: number, s: any) => a + Number(s.avg_rating), 0) / ratedPosts.length
    : 0;

  // Top 10 by likes
  const topLikedSlugs = [...stats].sort((a: any, b: any) => (b.like_count || 0) - (a.like_count || 0))
    .filter((s: any) => s.like_count > 0).slice(0, 10);

  // Top 10 by shares
  const topSharedSlugs = [...stats].sort((a: any, b: any) => (b.share_count || 0) - (a.share_count || 0))
    .filter((s: any) => s.share_count > 0).slice(0, 10);

  // Top 10 by avg rating (min 2 ratings)
  const topRatedSlugs = [...stats]
    .filter((s: any) => (s.rating_count || 0) >= 2)
    .sort((a: any, b: any) => Number(b.avg_rating) - Number(a.avg_rating))
    .slice(0, 10);

  // Fetch post titles for the top slugs
  const allTopSlugs = Array.from(new Set([
    ...topLikedSlugs.map((s: any) => s.post_slug),
    ...topSharedSlugs.map((s: any) => s.post_slug),
    ...topRatedSlugs.map((s: any) => s.post_slug),
  ]));
  const { data: postRows } = allTopSlugs.length
    ? await sb.from("posts").select("slug,title,category_slug").in("slug", allTopSlugs)
    : { data: [] };
  const postMap = new Map<string, any>((postRows || []).map((p: any) => [p.slug, p]));

  const hydrate = (rows: any[]) => rows.map((r: any) => ({
    ...r,
    title: postMap.get(r.post_slug)?.title || r.post_slug,
    category_slug: postMap.get(r.post_slug)?.category_slug || "uncategorized",
  }));

  // Share platform breakdown
  const { data: shareRows } = await sb
    .from("post_shares")
    .select("platform")
    .order("created_at", { ascending: false });

  const platformCounts: Record<string, number> = {};
  (shareRows || []).forEach((s: any) => {
    platformCounts[s.platform] = (platformCounts[s.platform] || 0) + 1;
  });
  const sharesByPlatform = Object.entries(platformCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([platform, count]) => ({ platform, count }));

  // Recent 20 shares
  const { data: recentShares } = await sb
    .from("post_shares")
    .select("post_slug,platform,created_at")
    .order("created_at", { ascending: false })
    .limit(20);

  // Hydrate recent shares with titles
  const recentSlugs = Array.from(new Set((recentShares || []).map((s: any) => s.post_slug)));
  const { data: recentPostRows } = recentSlugs.length
    ? await sb.from("posts").select("slug,title,category_slug").in("slug", recentSlugs)
    : { data: [] };
  const recentMap = new Map<string, any>((recentPostRows || []).map((p: any) => [p.slug, p]));
  const recentSharesHydrated = (recentShares || []).map((s: any) => ({
    ...s,
    title: recentMap.get(s.post_slug)?.title || s.post_slug,
    category_slug: recentMap.get(s.post_slug)?.category_slug || "uncategorized",
  }));

  return {
    totals: { ...totals, avgRating: Math.round(avgRating * 10) / 10 },
    topLiked:  hydrate(topLikedSlugs),
    topShared: hydrate(topSharedSlugs),
    topRated:  hydrate(topRatedSlugs),
    sharesByPlatform,
    recentShares: recentSharesHydrated,
  };
}

// ─── PLATFORM META ───────────────────────────────────────────────────────
const PLATFORM_META: Record<string, { label: string; icon: string; color: string }> = {
  whatsapp:  { label: "WhatsApp",  icon: "💬", color: "#25D366" },
  facebook:  { label: "Facebook",  icon: "f",  color: "#1877F2" },
  twitter:   { label: "Twitter/X", icon: "𝕏",  color: "#000000" },
  linkedin:  { label: "LinkedIn",  icon: "in", color: "#0A66C2" },
  email:     { label: "Email",     icon: "✉️", color: "#EA4335" },
  copy:      { label: "Copy Link", icon: "🔗", color: "#6B7280" },
  native:    { label: "Native Share", icon: "📤", color: "#3AAFE5" },
  pinterest: { label: "Pinterest", icon: "P",  color: "#E60023" },
  reddit:    { label: "Reddit",    icon: "↑",  color: "#FF4500" },
  telegram:  { label: "Telegram",  icon: "✈",  color: "#0088CC" },
};

function fmtRel(iso: string): string {
  const ago = (Date.now() - new Date(iso).getTime()) / 1000;
  if (ago < 60)     return `${Math.floor(ago)}s ago`;
  if (ago < 3600)   return `${Math.floor(ago / 60)}m ago`;
  if (ago < 86400)  return `${Math.floor(ago / 3600)}h ago`;
  return `${Math.floor(ago / 86400)}d ago`;
}

// ─── PAGE ────────────────────────────────────────────────────────────────
export default async function SocialPage() {
  const data = await getSocialData();
  const { totals, topLiked, topShared, topRated, sharesByPlatform, recentShares } = data;

  const hasAnyData = totals.likes + totals.shares + totals.ratings + totals.comments > 0;
  const maxPlatformCount = sharesByPlatform[0]?.count || 1;

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader
        title="Social Sharing"
        subtitle="Analytics — likes, shares, ratings received on posts"
      />
      <SocialTabs />

      <div className="flex-1 p-6 overflow-auto space-y-6">
        {/* ── Top stats ───────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard icon="👍" label="Total Likes"    value={totals.likes}     color="#3AAFE5" />
          <StatCard icon="📤" label="Total Shares"   value={totals.shares}    color="#F5A71A" />
          <StatCard icon="🔖" label="Bookmarks"      value={totals.bookmarks} color="#8B5CF6" />
          <StatCard icon="💬" label="Comments"       value={totals.comments}  color="#10B981" />
          <StatCard icon="⭐" label="Ratings"        value={totals.ratings}   color="#EAB308" />
          <StatCard icon="📊" label="Avg Rating"     value={totals.avgRating > 0 ? `${totals.avgRating}/5` : "—"} color="#EC4899" />
        </div>

        {!hasAnyData && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
            <p className="text-5xl mb-3">📊</p>
            <h3 className="text-white font-bold text-lg mb-2">No engagement data yet</h3>
            <p className="text-gray-400 text-sm max-w-md mx-auto">
              Once readers start liking, sharing, and rating your posts, you'll see analytics here.
              Make sure social sharing buttons are showing on post pages and engagement is tracked.
            </p>
          </div>
        )}

        {hasAnyData && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* ── Share platform breakdown ───────────────────── */}
              <Card title="📤 Shares by Platform">
                {sharesByPlatform.length === 0 ? (
                  <p className="text-gray-500 text-sm">No shares logged yet.</p>
                ) : (
                  <ul className="space-y-3">
                    {sharesByPlatform.map(({ platform, count }) => {
                      const meta = PLATFORM_META[platform] || { label: platform, icon: "•", color: "#888" };
                      const pct = Math.round((count / maxPlatformCount) * 100);
                      return (
                        <li key={platform}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="flex items-center gap-2 text-sm">
                              <span className="w-6 h-6 rounded text-white text-xs font-bold flex items-center justify-center"
                                    style={{ background: meta.color }}>
                                {meta.icon}
                              </span>
                              <span className="text-gray-200">{meta.label}</span>
                            </span>
                            <span className="text-sm font-bold text-white">{count}</span>
                          </div>
                          <div className="h-2 bg-gray-800 rounded overflow-hidden">
                            <div className="h-full rounded transition-all"
                                 style={{ width: `${pct}%`, background: meta.color }} />
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </Card>

              {/* ── Recent share activity ──────────────────────── */}
              <Card title="🕐 Recent Share Activity">
                {recentShares.length === 0 ? (
                  <p className="text-gray-500 text-sm">No recent shares.</p>
                ) : (
                  <ul className="space-y-2 max-h-80 overflow-y-auto">
                    {recentShares.map((s: any, i: number) => {
                      const meta = PLATFORM_META[s.platform] || { label: s.platform, icon: "•", color: "#888" };
                      return (
                        <li key={i} className="flex items-center gap-3 text-sm py-1.5 border-b border-gray-800 last:border-0">
                          <span className="w-6 h-6 rounded text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0"
                                style={{ background: meta.color }}>
                            {meta.icon}
                          </span>
                          <Link href={`/${s.category_slug}/${s.post_slug}`} target="_blank"
                                className="flex-1 min-w-0 text-gray-300 hover:text-white truncate">
                            {s.title}
                          </Link>
                          <span className="text-xs text-gray-500 flex-shrink-0">{fmtRel(s.created_at)}</span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </Card>
            </div>

            {/* ── Top posts grids ───────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card title="👍 Most Liked Posts">
                <PostList rows={topLiked} metric="like_count" suffix="likes" />
              </Card>
              <Card title="📤 Most Shared Posts">
                <PostList rows={topShared} metric="share_count" suffix="shares" />
              </Card>
              <Card title="⭐ Highest Rated Posts">
                <PostList rows={topRated} metric="avg_rating" suffix="/5" secondary="rating_count" />
              </Card>
            </div>
          </>
        )}

        {/* ── Where do you set this up? ───────────────────────── */}
        <Card title="ℹ️ Want to drive more shares?">
          <ul className="space-y-2 text-sm text-gray-400">
            <li>• Configure Facebook auto-posting → <Link href="/admin/settings" className="text-brand hover:underline" style={{ color: "#3AAFE5" }}>Settings → Social</Link></li>
            <li>• Add WhatsApp Business number for direct shares → Same place</li>
            <li>• Set up Open Graph images for better social previews (already wired)</li>
            <li>• Encourage ratings — posts with ⭐⭐⭐⭐⭐ get more engagement</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

// ─── COMPONENTS ──────────────────────────────────────────────────────────
function StatCard({ icon, label, value, color }: { icon: string; label: string; value: number | string; color: string }) {
  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-2xl font-extrabold" style={{ color }}>
        {typeof value === "number" ? value.toLocaleString("en-IN") : value}
      </div>
      <div className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">{label}</div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
      <div className="px-5 py-3 bg-gray-800 border-b border-gray-700">
        <h2 className="text-white font-semibold text-sm">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function PostList({ rows, metric, suffix, secondary }: {
  rows: any[]; metric: string; suffix: string; secondary?: string;
}) {
  if (!rows || rows.length === 0) {
    return <p className="text-gray-500 text-sm">No data yet.</p>;
  }
  return (
    <ol className="space-y-2.5">
      {rows.map((r: any, i: number) => (
        <li key={r.post_slug} className="flex items-start gap-3 text-sm">
          <span className="w-5 text-center text-gray-500 font-bold text-xs flex-shrink-0 pt-0.5">
            {i + 1}
          </span>
          <Link href={`/${r.category_slug}/${r.post_slug}`} target="_blank"
                className="flex-1 min-w-0 text-gray-300 hover:text-white line-clamp-2">
            {r.title}
          </Link>
          <span className="text-xs font-bold flex-shrink-0 pt-0.5" style={{ color: "#3AAFE5" }}>
            {r[metric]}{suffix}
            {secondary && <span className="text-gray-500 ml-1">({r[secondary]})</span>}
          </span>
        </li>
      ))}
    </ol>
  );
}
