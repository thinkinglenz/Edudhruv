import { getServiceClient } from "@/lib/supabase";
import { CATEGORIES } from "@/lib/categories";
import { MOCK_POSTS } from "@/lib/mock-data";
import Link from "next/link";

const IS_MOCK = !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder") ||
  !process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY === "placeholder";

async function getStats() {
  if (IS_MOCK) {
    const allPosts = MOCK_POSTS as any[];
    const byCat: Record<string, number> = {};
    allPosts.forEach(p => { byCat[p.category_slug] = (byCat[p.category_slug] || 0) + 1; });

    return {
      totalPosts:       allPosts.filter(p => p.status === "published").length,
      draftPosts:       allPosts.filter(p => p.status === "draft").length,
      totalLeads:       0,
      leadsToday:       0,
      leadsWeek:        0,
      pendingComments:  2,
      approvedComments: 3,
      totalUsers:       0,
      recentPosts:      allPosts.slice(0, 6),
      recentLeads:      [],
      recentComments:   [
        { author_name: "Priya Nair", content: "Could you update the application deadline?", created_at: new Date(Date.now() - 86400000).toISOString(), post_slug: "chevening-scholarship-2025" },
        { author_name: "Sneha Reddy", content: "Which NBFC do you recommend for loans above 40L?", created_at: new Date(Date.now() - 172800000).toISOString(), post_slug: "education-loan-no-collateral" },
      ],
      postsByCategory:  byCat,
    };
  }

  const db = getServiceClient();
  const today    = new Date(); today.setHours(0, 0, 0, 0);
  const weekAgo  = new Date(Date.now() - 7 * 86400000).toISOString();

  const [
    { count: totalPosts },
    { count: draftPosts },
    { count: totalLeads },
    { count: leadsToday },
    { count: leadsWeek },
    { count: pendingComments },
    { count: approvedComments },
    { count: totalUsers },
    { data: recentPosts },
    { data: recentLeads },
    { data: recentComments },
    { data: allPosts },
  ] = await Promise.all([
    db.from("posts").select("*", { count: "exact", head: true }).eq("status", "published"),
    db.from("posts").select("*", { count: "exact", head: true }).eq("status", "draft"),
    db.from("leads").select("*", { count: "exact", head: true }),
    db.from("leads").select("*", { count: "exact", head: true }).gte("created_at", today.toISOString()),
    db.from("leads").select("*", { count: "exact", head: true }).gte("created_at", weekAgo),
    db.from("comments").select("*", { count: "exact", head: true }).eq("status", "pending"),
    db.from("comments").select("*", { count: "exact", head: true }).eq("status", "approved"),
    db.from("portal_users").select("*", { count: "exact", head: true }),
    db.from("posts").select("id,title,slug,category_slug,created_at,status").order("created_at", { ascending: false }).limit(6),
    db.from("leads").select("id,name,email,phone,status,created_at,source_post_slug").order("created_at", { ascending: false }).limit(5),
    db.from("comments").select("id,author_name,content,created_at,post_slug,status").order("created_at", { ascending: false }).limit(5),
    db.from("posts").select("category_slug").eq("status", "published"),
  ]);

  const byCategory: Record<string, number> = {};
  (allPosts || []).forEach((p: any) => { byCategory[p.category_slug] = (byCategory[p.category_slug] || 0) + 1; });

  return {
    totalPosts:       totalPosts || 0,
    draftPosts:       draftPosts || 0,
    totalLeads:       totalLeads || 0,
    leadsToday:       leadsToday || 0,
    leadsWeek:        leadsWeek || 0,
    pendingComments:  pendingComments || 0,
    approvedComments: approvedComments || 0,
    totalUsers:       totalUsers || 0,
    recentPosts:      recentPosts || [],
    recentLeads:      recentLeads || [],
    recentComments:   recentComments || [],
    postsByCategory:  byCategory,
  };
}

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit" });
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60); if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60); if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24); return `${d}d ago`;
}

export default async function AdminPage() {
  const s = await getStats();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top bar */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-white font-bold text-lg">Dashboard</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {IS_MOCK
              ? "⚠️  Mock mode — connect Supabase for live counts"
              : "✅ Real-time data from Supabase"}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/posts/new" className="text-sm font-semibold px-4 py-2 rounded-lg text-white" style={{ background: "#3AAFE5" }}>
            + New Post
          </Link>
          <a href="/" target="_blank" className="text-sm text-gray-400 hover:text-white px-4 py-2 border border-gray-700 rounded-lg">
            View Site →
          </a>
        </div>
      </div>

      <div className="flex-1 p-6 space-y-6 overflow-auto">
        {/* ── Top stat cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {[
            { label: "Published", value: s.totalPosts,       icon: "📝", color: "#3AAFE5" },
            { label: "Drafts",    value: s.draftPosts,       icon: "📄", color: "#9CA3AF" },
            { label: "Leads",     value: s.totalLeads,       icon: "👥", color: "#10B981" },
            { label: "Today",     value: s.leadsToday,       icon: "🔥", color: "#F5A71A" },
            { label: "Pending",   value: s.pendingComments,  icon: "💬", color: "#EAB308" },
            { label: "Users",     value: s.totalUsers,       icon: "👤", color: "#8B5CF6" },
          ].map(c => (
            <div key={c.label} className="bg-gray-900 rounded-xl border border-gray-800 p-4">
              <div className="text-xl mb-1">{c.icon}</div>
              <div className="text-2xl font-extrabold" style={{ color: c.color }}>{c.value}</div>
              <div className="text-[11px] text-gray-500 mt-0.5 uppercase tracking-wider">{c.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ── Posts by category ── */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-white">📊 Posts by Category</h2>
              <Link href="/admin/posts" className="text-xs text-brand hover:underline" style={{ color: "#3AAFE5" }}>View all →</Link>
            </div>
            <div className="space-y-2">
              {CATEGORIES.map(cat => {
                const count = s.postsByCategory[cat.slug] || 0;
                const max = Math.max(...Object.values(s.postsByCategory), 1);
                const pct = Math.round((count / max) * 100);
                return (
                  <Link href={`/admin/posts?category=${cat.slug}`} key={cat.slug} className="block hover:bg-gray-800/50 rounded-lg px-2 py-1 -mx-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">{cat.icon} {cat.name}</span>
                      <span className="font-semibold text-white">{count}</span>
                    </div>
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: "#3AAFE5" }} />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* ── Integration status ── */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
            <h2 className="font-bold text-white mb-4">⚡ Integration Status</h2>
            <div className="space-y-2.5">
              {[
                { label: "Supabase",          ok: !IS_MOCK,                                              hint: "/admin/settings" },
                { label: "Google Analytics",   ok: !!process.env.NEXT_PUBLIC_GA_ID?.startsWith("G-"),    hint: "/admin/settings" },
                { label: "Google AdSense",     ok: !!process.env.NEXT_PUBLIC_ADSENSE_ID,                hint: "/admin/settings" },
                { label: "Amazon Associates",  ok: !!process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_ID,       hint: "/admin/settings" },
                { label: "Claude (Priya AI)",  ok: !!process.env.ANTHROPIC_API_KEY?.startsWith("sk-"),  hint: "/admin/settings" },
                { label: "Unsplash Images",    ok: !!process.env.UNSPLASH_ACCESS_KEY,                   hint: "/admin/settings" },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-3">
                  <span className="text-base flex-shrink-0">{item.ok ? "✅" : "⚠️"}</span>
                  <span className="text-sm text-gray-300 flex-1">{item.label}</span>
                  {!item.ok && <Link href={item.hint} className="text-xs text-yellow-400 hover:underline">Configure →</Link>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Recent comments + leads ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent comments */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-white">💬 Recent Comments</h2>
              <Link href="/admin/comments" className="text-xs hover:underline" style={{ color: "#3AAFE5" }}>Moderate →</Link>
            </div>
            {s.recentComments.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-6">No comments yet</p>
            ) : (
              <ul className="space-y-3">
                {s.recentComments.slice(0, 4).map((c: any, i: number) => (
                  <li key={c.id || i} className="border-b border-gray-800 last:border-0 pb-3 last:pb-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-white">{c.author_name}</span>
                      <span className="text-xs text-gray-500">· {timeAgo(c.created_at)}</span>
                      {c.status === "pending" && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-yellow-900/60 text-yellow-400 font-semibold">PENDING</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 line-clamp-2">{c.content}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Recent leads */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-white">👥 Recent Leads</h2>
              <Link href="/admin/leads" className="text-xs hover:underline" style={{ color: "#3AAFE5" }}>View all →</Link>
            </div>
            {s.recentLeads.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-6">
                {IS_MOCK ? "Connect Supabase to see real leads" : "No leads yet — share the site!"}
              </p>
            ) : (
              <ul className="space-y-3">
                {s.recentLeads.slice(0, 4).map((l: any) => (
                  <li key={l.id} className="border-b border-gray-800 last:border-0 pb-3 last:pb-0">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white">{l.name}</p>
                        <p className="text-xs text-gray-500 truncate">{l.email} · {l.phone}</p>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-900/60 text-blue-400 font-semibold capitalize whitespace-nowrap">{l.status}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* ── Recent posts table ── */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-white">📰 Recent Posts</h2>
            <Link href="/admin/posts" className="text-xs hover:underline" style={{ color: "#3AAFE5" }}>View all →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  {["Title","Category","Date","Action"].map(h => (
                    <th key={h} className="text-left py-2 pr-4 text-xs text-gray-500 font-medium uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(s.recentPosts as any[]).map(p => {
                  const cat = CATEGORIES.find(c => c.slug === p.category_slug);
                  return (
                    <tr key={p.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                      <td className="py-2.5 pr-4 text-gray-200 max-w-md truncate">{p.title}</td>
                      <td className="py-2.5 pr-4">
                        {cat && <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cat.color}`}>{cat.name}</span>}
                      </td>
                      <td className="py-2.5 pr-4 text-gray-500 text-xs whitespace-nowrap">{p.created_at ? fmt(p.created_at) : "—"}</td>
                      <td className="py-2.5">
                        <a href={`/${p.category_slug}/${p.slug}`} target="_blank" className="text-xs hover:underline" style={{ color: "#3AAFE5" }}>View →</a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Quick actions ── */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
          <h2 className="font-bold text-white mb-4">⚡ Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {[
              ["📝", "New Post",         "/admin/posts/new"],
              ["🖼️", "Manage Banners",   "/admin/banners"],
              ["💬", "Moderate Comments","/admin/comments"],
              ["🤖", "Run Blog Agent",   "/admin/agent"],
              ["🔍", "SEO Audit",        "/admin/seo"],
              ["⚙️", "Settings",         "/admin/settings"],
            ].map(([icon, label, href]) => (
              <Link key={href} href={href}
                className="bg-gray-800 hover:bg-gray-700 rounded-xl p-3 flex flex-col items-center text-center transition-colors">
                <span className="text-2xl mb-1">{icon}</span>
                <span className="text-xs text-gray-300 font-medium">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
