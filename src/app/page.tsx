import Link from "next/link";
import { getRecentPosts, getPostsByCategoryMap } from "@/lib/supabase";
import { CATEGORIES, getCategoryBySlug } from "@/lib/categories";
import PostCard from "@/components/blog/PostCard";
import LeadForm from "@/components/blog/LeadForm";
import CategorySlider from "@/components/home/CategorySlider";
import HeroBanner from "@/components/home/HeroBanner";
import CategorySection from "@/components/home/CategorySection";
import RotatingBanner, { ListMyAIBanner, ThinkingLenzBanner } from "@/components/ads/RotatingBanner";

export const revalidate = 3600;

const SPONSORED_SLIDES: never[] = [];
const HOMEPAGE_CATEGORIES = [
  "education-loan",
  "scholarship",
  "top-universities",
  "indian-students-abroad",
  "student-accommodation",
  "travel-essentials",
];

export default async function HomePage() {
  const recentPosts   = await getRecentPosts(8);
  const heroPosts     = recentPosts.slice(0, 5);
  const latestGrid    = recentPosts.slice(5);
  const categoryPosts = await getPostsByCategoryMap(HOMEPAGE_CATEGORIES, 4);

  return (
    <>
      {/* ── Category slider ─────────────────────────────────────────── */}
      <CategorySlider active="all" />

      {/* ── Hero rotating banner ────────────────────────────────────── */}
      <HeroBanner posts={heroPosts} sponsored={SPONSORED_SLIDES} />

      {/* ── Main content + RHS sidebar ─────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 items-start">

          {/* ── Left: Latest Articles + filler banner ─────────────── */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg" style={{ color: "#555555" }}>Latest Articles</h2>
              <Link href="/latest" className="text-sm font-medium hover:underline" style={{ color: "#3AAFE5" }}>
                View all →
              </Link>
            </div>

            {/* 4 post cards — 2x2 grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(latestGrid.length > 0 ? latestGrid : recentPosts.slice(0, 4)).map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>

            {/* Inline ThinkingLenz banner — fills empty space, balances sidebar */}
            <ThinkingLenzBanner size="leaderboard" />

            {/* "More from EduDhruv" small section — adds visual mass */}
            <div className="rounded-xl border border-gray-100 p-6 bg-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold" style={{ color: "#555555" }}>📚 More Articles</h3>
                <Link href="/latest" className="text-xs font-medium hover:underline" style={{ color: "#3AAFE5" }}>
                  See all →
                </Link>
              </div>
              <ul className="space-y-3 divide-y divide-gray-50">
                {recentPosts.slice(4, 8).map((post) => {
                  const cat = CATEGORIES.find(c => c.slug === post.category_slug);
                  return (
                    <li key={post.id} className="pt-3 first:pt-0">
                      <Link href={`/${post.category_slug}/${post.slug}`}
                            className="flex gap-3 items-start hover:bg-gray-50 rounded-lg -mx-2 px-2 py-1.5 transition-colors">
                        <span className="text-xl flex-shrink-0">{cat?.icon || "📄"}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 line-clamp-2 hover:text-brand" style={{ color: "#333" }}>
                            {post.title}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {cat?.name || post.category_slug} · {post.reading_time || 5} min read
                          </p>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* CTA button to all articles */}
            <div className="text-center pt-2">
              <Link
                href="/latest"
                className="inline-block border-2 font-semibold px-8 py-2.5 rounded-xl text-sm transition-colors hover:bg-blue-50"
                style={{ borderColor: "#3AAFE5", color: "#3AAFE5" }}
              >
                View All Articles →
              </Link>
            </div>
          </div>

          {/* ── RHS Sidebar ─────────────────────────────────────────── */}
          <aside className="space-y-6">
            {/* TOP: Rotating banner — both brands cycle here */}
            <RotatingBanner size="sidebar" interval={5000} />

            {/* Lead form */}
            <div className="rounded-xl p-5 border"
                 style={{ background: "#EBF7FD", borderColor: "#3AAFE5" }}>
              <h3 className="font-bold text-lg mb-1" style={{ color: "#3AAFE5" }}>
                🎓 Get Free Guidance
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                Our counsellor Priya calls you within 24 hours. No fees, ever.
              </p>
              <LeadForm />
            </div>

            {/* Browse Topics */}
            <div className="bg-white border border-gray-100 rounded-xl p-5">
              <h3 className="font-bold text-sm uppercase tracking-wider mb-3 pb-2 border-b border-gray-100"
                  style={{ color: "#555555" }}>
                Browse Topics
              </h3>
              <ul className="space-y-2">
                {CATEGORIES.filter(c => c.slug !== "latest").map(cat => (
                  <li key={cat.slug}>
                    <Link href={`/${cat.slug}`}
                          className="flex items-center justify-between text-sm text-gray-600 hover:text-brand py-0.5 group">
                      <span className="flex items-center gap-2">
                        <span>{cat.icon}</span>
                        <span className="group-hover:underline">{cat.name}</span>
                      </span>
                      <span className="text-gray-300 group-hover:text-brand">›</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* MIDDLE: ListMyAI fixed banner */}
            <ListMyAIBanner size="sidebar" />
          </aside>
        </div>
      </div>

      {/* ── CATEGORY SECTIONS ─────────────────────────────────────── */}
      {HOMEPAGE_CATEGORIES.map((slug, i) => {
        const cat = getCategoryBySlug(slug);
        const posts = categoryPosts[slug] || [];
        if (!cat || posts.length === 0) return null;
        return (
          <div key={slug}>
            <CategorySection category={cat} posts={posts} />
            {/* Rotating leaderboard banner after sections 2 and 4 */}
            {i === 1 && (
              <div className="max-w-6xl mx-auto px-4 py-4">
                <RotatingBanner size="leaderboard" interval={6000} />
              </div>
            )}
            {i === 3 && (
              <div className="max-w-6xl mx-auto px-4 py-4">
                <ListMyAIBanner size="leaderboard" />
              </div>
            )}
          </div>
        );
      })}

      {/* ── Category visual grid ──────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-14 pt-6">
        <h2 className="text-lg font-bold mb-4" style={{ color: "#555555" }}>Browse by Topic</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {CATEGORIES.filter(c => c.slug !== "latest").map(cat => (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              className={`flex flex-col items-center text-center p-4 rounded-xl border border-transparent hover:border-gray-200 hover:shadow-sm transition-all ${cat.color}`}
            >
              <span className="text-2xl mb-1.5">{cat.icon}</span>
              <span className="text-xs font-semibold leading-tight">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Final big rotating banner before footer ─────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-10">
        <ThinkingLenzBanner size="leaderboard" />
      </div>
    </>
  );
}
