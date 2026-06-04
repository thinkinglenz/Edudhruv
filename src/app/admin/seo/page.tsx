import AdminHeader from "@/components/admin/AdminHeader";
import Pagination from "@/components/admin/Pagination";
import { CATEGORIES } from "@/lib/categories";
import { MOCK_POSTS } from "@/lib/mock-data";
import Link from "next/link";

const IS_MOCK = !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder") ||
  !process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY === "placeholder";

const PAGE_SIZE = 20;

interface PostAudit {
  id:               string;
  title:            string;
  slug:             string;
  category_slug:    string;
  meta_title?:      string;
  meta_description?: string;
  focus_keyword?:   string;
  featured_image_url?: string;
  created_at:       string;
}

async function getPostsForAudit(filter: string, page: number) {
  if (IS_MOCK) {
    let posts = MOCK_POSTS as any[];
    if (filter === "missing-meta")   posts = posts.filter(p => !p.meta_description);
    if (filter === "missing-image")  posts = posts.filter(p => !p.featured_image_url);
    if (filter === "missing-keyword") posts = posts.filter(p => !p.focus_keyword);
    if (filter === "good")           posts = posts.filter(p => p.meta_description && p.focus_keyword && p.featured_image_url);
    const start = (page - 1) * PAGE_SIZE;
    return { posts: posts.slice(start, start + PAGE_SIZE) as PostAudit[], total: posts.length };
  }
  const { getServiceClient } = await import("@/lib/supabase");
  const db = getServiceClient();
  let q = db.from("posts").select("id,title,slug,category_slug,meta_title,meta_description,focus_keyword,featured_image_url,created_at", { count: "exact" }).order("created_at", { ascending: false });
  if (filter === "missing-meta")    q = q.or("meta_description.is.null,meta_description.eq.");
  if (filter === "missing-image")   q = q.is("featured_image_url", null);
  if (filter === "missing-keyword") q = q.or("focus_keyword.is.null,focus_keyword.eq.");
  const start = (page - 1) * PAGE_SIZE;
  const { data, count } = await q.range(start, start + PAGE_SIZE - 1);
  return { posts: (data || []) as PostAudit[], total: count || 0 };
}

function scorePost(p: PostAudit): number {
  let score = 0;
  if (p.meta_title)                                            score += 15;
  if (p.meta_description && p.meta_description.length >= 120)  score += 25;
  else if (p.meta_description)                                  score += 10;
  if (p.focus_keyword)                                         score += 25;
  if (p.featured_image_url)                                    score += 20;
  if (p.title && p.title.length >= 40 && p.title.length <= 70) score += 15;
  return score;
}

export default async function SeoPage({ searchParams }: { searchParams: { filter?: string; page?: string } }) {
  const filter = searchParams.filter || "all";
  const page   = parseInt(searchParams.page || "1");
  const { posts, total } = await getPostsForAudit(filter, page);

  // Stats across all posts (not just paginated)
  const allPosts = MOCK_POSTS as any[];
  const withMeta     = allPosts.filter(p => p.meta_description && p.meta_description.length > 0).length;
  const withImage    = allPosts.filter(p => p.featured_image_url).length;
  const withKeyword  = allPosts.filter(p => p.focus_keyword && p.focus_keyword.length > 0).length;
  const totalAll     = allPosts.length;
  const missingMeta  = totalAll - withMeta;

  // Total avg SEO score
  const avgScore = totalAll > 0
    ? Math.round(allPosts.reduce((sum, p) => sum + scorePost(p as any), 0) / totalAll)
    : 0;

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader
        title="SEO Audit"
        subtitle={`Avg score: ${avgScore}/100 · ${withMeta}/${totalAll} have meta · ${withImage}/${totalAll} have images`}
      />

      <div className="flex-1 p-6 space-y-6 overflow-auto">

        {/* ── Top stats ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Avg SEO Score",       value: `${avgScore}/100`,            color: avgScore >= 70 ? "#10B981" : avgScore >= 50 ? "#F5A71A" : "#EF4444", icon: "📊" },
            { label: "With Meta Desc",       value: `${withMeta}/${totalAll}`,    color: "#3AAFE5", icon: "✅" },
            { label: "Missing Meta",         value: missingMeta,                  color: "#EF4444", icon: "⚠️" },
            { label: "With Focus Keyword",   value: `${withKeyword}/${totalAll}`, color: "#8B5CF6", icon: "🎯" },
          ].map(s => (
            <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="text-xl mb-1">{s.icon}</div>
              <div className="text-2xl font-extrabold" style={{ color: s.color }}>{s.value}</div>
              <div className="text-[11px] text-gray-500 mt-0.5 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Tool links ── */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h2 className="text-white font-bold mb-3">🔗 SEO Tools</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { label: "Sitemap",        href: "/sitemap.xml",                                                                      icon: "🗺", ext: false },
              { label: "robots.txt",     href: "/robots.txt",                                                                       icon: "🤖", ext: false },
              { label: "ads.txt",        href: "/ads.txt",                                                                          icon: "📄", ext: false },
              { label: "Search Console", href: "https://search.google.com/search-console",                                          icon: "📊", ext: true },
              { label: "Analytics",      href: "https://analytics.google.com",                                                      icon: "📈", ext: true },
              { label: "PageSpeed",      href: "https://pagespeed.web.dev/analysis?url=https://www.edudhruv.com",                  icon: "⚡", ext: true },
              { label: "Schema Test",    href: "https://validator.schema.org",                                                      icon: "✔", ext: true },
              { label: "Mobile Test",    href: "https://search.google.com/test/mobile-friendly",                                    icon: "📱", ext: true },
            ].map(l => (
              <a key={l.label} href={l.href} target={l.ext ? "_blank" : "_self"}
                className="bg-gray-800 hover:bg-gray-700 rounded-xl px-3 py-2.5 flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors">
                <span>{l.icon}</span>
                <span className="font-medium">{l.label}</span>
                {l.ext && <span className="ml-auto text-gray-600 text-xs">↗</span>}
              </a>
            ))}
          </div>
        </div>

        {/* ── Filter tabs ── */}
        <div>
          <h2 className="text-white font-bold mb-3">Post-by-Post Audit</h2>
          <div className="flex gap-1 bg-gray-900 border border-gray-800 rounded-xl p-1 w-fit flex-wrap">
            {[
              { key: "all",             label: `All (${totalAll})` },
              { key: "missing-meta",    label: `Missing Meta (${missingMeta})` },
              { key: "missing-image",   label: `No Image (${totalAll - withImage})` },
              { key: "missing-keyword", label: `No Keyword (${totalAll - withKeyword})` },
            ].map(t => (
              <Link key={t.key} href={t.key === "all" ? "/admin/seo" : `/admin/seo?filter=${t.key}`}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filter === t.key ? "text-white" : "text-gray-400 hover:text-white"
                }`}
                style={filter === t.key ? { background: "#3AAFE5" } : {}}>
                {t.label}
              </Link>
            ))}
          </div>
        </div>

        {/* ── Audit table ── */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-800">
              <tr>
                {["Post","Focus Keyword","Meta Description","Score"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs text-gray-400 font-semibold uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {posts.length === 0 ? (
                <tr><td colSpan={4} className="px-4 py-12 text-center text-gray-500">No posts match this filter</td></tr>
              ) : posts.map(p => {
                const hasMeta    = !!p.meta_description;
                const hasKW      = !!p.focus_keyword;
                const metaLen    = (p.meta_description || "").length;
                const score      = scorePost(p);
                const scoreColor = score >= 80 ? "text-green-400" : score >= 50 ? "text-yellow-400" : "text-red-400";
                const cat = CATEGORIES.find(c => c.slug === p.category_slug);
                return (
                  <tr key={p.id} className="border-t border-gray-800 hover:bg-gray-800/30">
                    <td className="px-4 py-3 max-w-md">
                      <p className="text-white text-sm font-medium line-clamp-1">{p.title}</p>
                      <p className="text-gray-500 text-xs font-mono mt-0.5">/{p.category_slug}/{p.slug}</p>
                      {cat && <span className={`inline-block text-[10px] px-1.5 py-0.5 rounded-full font-medium mt-1.5 ${cat.color}`}>{cat.name}</span>}
                    </td>
                    <td className="px-4 py-3">
                      {hasKW ? (
                        <span className="text-green-400 text-xs">✓ {p.focus_keyword}</span>
                      ) : (
                        <span className="text-red-400 text-xs">✗ Missing</span>
                      )}
                    </td>
                    <td className="px-4 py-3 max-w-sm">
                      {hasMeta ? (
                        <div>
                          <p className="text-gray-300 text-xs line-clamp-2">{p.meta_description}</p>
                          <p className={`text-[10px] mt-1 ${metaLen >= 120 && metaLen <= 160 ? "text-green-400" : "text-yellow-400"}`}>
                            {metaLen} chars · {metaLen < 120 ? "too short" : metaLen > 160 ? "too long" : "optimal"}
                          </p>
                        </div>
                      ) : <span className="text-red-400 text-xs">✗ Missing</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-lg font-bold ${scoreColor}`}>{score}%</span>
                      <a href={`/${p.category_slug}/${p.slug}`} target="_blank"
                        className="block text-xs mt-0.5 hover:underline" style={{ color: "#3AAFE5" }}>View →</a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <Pagination
          page={page}
          totalItems={total}
          pageSize={PAGE_SIZE}
          basePath="/admin/seo"
          extraParams={filter !== "all" ? { filter } : {}}
        />

        {/* ── Schema status ── */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h2 className="text-white font-bold mb-4">📋 Active Schema Markup</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              { type: "Organization",   note: "Sitewide",        active: true },
              { type: "WebSite",        note: "SearchAction",    active: true },
              { type: "Article",        note: "Per post",        active: true },
              { type: "FAQPage",        note: "Auto from H3s",   active: true },
              { type: "BreadcrumbList", note: "Post pages",      active: true },
              { type: "CollectionPage", note: "Category pages",  active: true },
              { type: "Person",         note: "Author schema",   active: false },
              { type: "Review",         note: "University reviews", active: false },
              { type: "HowTo",          note: "Step-by-step",    active: false },
              { type: "ImageObject",    note: "Featured images", active: true },
            ].map(s => (
              <div key={s.type} className={`rounded-xl p-3 border text-center ${
                s.active ? "border-green-800 bg-green-950/30" : "border-gray-800 bg-gray-800/30"
              }`}>
                <p className={`text-xs font-bold ${s.active ? "text-green-400" : "text-gray-500"}`}>{s.type}</p>
                <p className="text-[10px] text-gray-500 mt-0.5">{s.note}</p>
                <p className={`text-[10px] mt-1 font-medium ${s.active ? "text-green-400" : "text-gray-600"}`}>
                  {s.active ? "✓ Active" : "○ Not set"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
