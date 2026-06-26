import Link from "next/link";
import { getRecentPosts, getPostsByCategoryMap } from "@/lib/supabase";
import { CATEGORIES, getCategoryBySlug } from "@/lib/categories";
import PostCard from "@/components/blog/PostCard";
import LeadForm from "@/components/blog/LeadForm";
import HeroBanner from "@/components/home/HeroBanner";
import CategorySection from "@/components/home/CategorySection";
import ScholarshipsWidget from "@/components/home/ScholarshipsWidget";
import { getRecentScholarships } from "@/lib/scholarships";
import RotatingBanner, { ListMyAIBanner, ThinkingLenzBanner } from "@/components/ads/RotatingBanner";

// Revalidate every 5 min as a fallback. The blog agent ALSO calls
// /api/revalidate immediately after publishing, so new posts appear
// instantly — this is just a safety net.
export const revalidate = 300;

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
  const [recentPosts, categoryPosts, scholarships] = await Promise.all([
    getRecentPosts(8),
    getPostsByCategoryMap(HOMEPAGE_CATEGORIES, 4),
    getRecentScholarships(6),
  ]);
  const heroPosts  = recentPosts.slice(0, 5);
  const latestGrid = recentPosts.slice(5);

  return (
    <>
      {/* ── Hero rotating banner ────────────────────────────────────── */}
      <HeroBanner posts={heroPosts} sponsored={SPONSORED_SLIDES} />

      {/* ── Main content + RHS sidebar ─────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-0">
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
      {/* ── 💯 Scholarships widget — auto-discovered daily ─────────── */}
      {scholarships.length > 0 && (
        <div className="bg-gradient-to-b from-yellow-50/40 to-transparent">
          <ScholarshipsWidget scholarships={scholarships} />
        </div>
      )}

      {/* ── 🧮 Free Tools — drive engagement + bookmarks ───────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-end justify-between flex-wrap gap-3 mb-6">
          <div>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-2"
                  style={{ background: "#EBF7FD", color: "#3AAFE5" }}>
              🧮 Free Tools
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold" style={{ color: "#333" }}>
              Plan your study abroad in 60 seconds
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Honest calculators built for Indian students — no signup, no data collected
            </p>
          </div>
          <Link href="/tools" className="text-sm font-bold hover:underline whitespace-nowrap" style={{ color: "#3AAFE5" }}>
            View all tools →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/tools/education-loan-emi-calculator"
                className="group block bg-white rounded-2xl border-2 border-gray-100 p-6 hover:shadow-lg hover:border-brand transition-all">
            <div className="text-5xl mb-3">💰</div>
            <h3 className="font-extrabold text-lg text-gray-900 mb-1 group-hover:text-brand">
              Education Loan EMI Calculator
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Calculate monthly EMI for any loan amount, rate, and tenure. Compare 5 lender rates side-by-side.
            </p>
            <span className="inline-flex items-center gap-1 text-sm font-bold" style={{ color: "#3AAFE5" }}>
              Calculate EMI →
            </span>
          </Link>

          <Link href="/tools/cost-of-studying-abroad-calculator"
                className="group block bg-white rounded-2xl border-2 border-gray-100 p-6 hover:shadow-lg hover:border-brand transition-all">
            <div className="text-5xl mb-3">🌍</div>
            <h3 className="font-extrabold text-lg text-gray-900 mb-1 group-hover:text-brand">
              Cost of Studying Abroad Calculator
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Total cost in INR for 6 countries — tuition + living + visa + flights + EMI estimate.
            </p>
            <span className="inline-flex items-center gap-1 text-sm font-bold" style={{ color: "#F5A71A" }}>
              Estimate cost →
            </span>
          </Link>
        </div>
      </section>

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

      {/* ── Advertise CTA — for sponsors / universities ─────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div
          className="rounded-3xl p-8 sm:p-12 text-center text-white shadow-xl relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #1a1a4a 0%, #3AAFE5 50%, #F5A71A 100%)" }}
        >
          <div className="relative z-10 max-w-3xl mx-auto">
            <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-semibold uppercase tracking-widest mb-4">
              📣 For Universities, Lenders & Sponsors
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold mb-4 leading-tight">
              Reach 100,000+ Indian Students<br className="hidden sm:inline" />
              Researching Study Abroad
            </h2>
            <p className="text-base sm:text-lg text-white/90 mb-6 max-w-2xl mx-auto">
              Banner ads, sponsored articles, featured listings. Partner with India's
              trusted education guidance platform — pricing from <strong>₹25,000</strong>.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/advertise"
                className="inline-flex items-center justify-center gap-2 bg-white font-bold px-7 py-3 rounded-xl hover:bg-gray-50 transition-colors shadow-lg"
                style={{ color: "#1a1a4a" }}
              >
                See Advertising Packages →
              </Link>
              <a
                href="mailto:edudruv@gmail.com?subject=Advertising%20enquiry"
                className="inline-flex items-center justify-center gap-2 border-2 border-white/60 text-white font-semibold px-7 py-3 rounded-xl hover:bg-white/10 transition-colors"
              >
                Quick email enquiry
              </a>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 mt-6 text-white/70 text-xs">
              <span>✓ 100K+ monthly visitors</span>
              <span>✓ 85% Indian student audience</span>
              <span>✓ 12K newsletter subscribers</span>
              <span>✓ 24h response</span>
            </div>
          </div>
        </div>
      </section>

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
