import AdminHeader from "@/components/admin/AdminHeader";
import { BANNERS } from "@/lib/banners";
import Link from "next/link";

const IS_MOCK = !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder") ||
  !process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY === "placeholder";

interface ShareRow { platform: string; count: number; }
interface BannerStats { brand: string; clicks: number; impressions: number; ctr: number; }

async function getAnalytics() {
  // Real implementation pulls from post_shares + ad_clicks tables.
  // For now, show realistic mock data so admin can see what they'll have.
  if (IS_MOCK) {
    return {
      totalImpressions: 12480,
      totalClicks:      342,
      ctr:              2.74,
      sharesByPlatform: [
        { platform: "whatsapp",  count: 89 },
        { platform: "twitter",   count: 54 },
        { platform: "facebook",  count: 47 },
        { platform: "linkedin",  count: 31 },
        { platform: "copy",      count: 28 },
        { platform: "telegram",  count: 14 },
        { platform: "email",     count: 9  },
      ],
      bannerStats: [
        { brand: "ListMyAI",     impressions: 6240, clicks: 187, ctr: 3.00 },
        { brand: "ThinkingLenz", impressions: 6240, clicks: 155, ctr: 2.48 },
      ] as BannerStats[],
    };
  }

  const { getServiceClient } = await import("@/lib/supabase");
  const db = getServiceClient();
  const { data } = await db.from("post_shares").select("platform");
  const sharesByPlatform: ShareRow[] = [];
  if (data) {
    const counts: Record<string, number> = {};
    data.forEach((s: any) => { counts[s.platform] = (counts[s.platform] || 0) + 1; });
    Object.entries(counts).forEach(([platform, count]) => sharesByPlatform.push({ platform, count }));
    sharesByPlatform.sort((a, b) => b.count - a.count);
  }
  return {
    totalImpressions: 0,
    totalClicks:      0,
    ctr:              0,
    sharesByPlatform,
    bannerStats:      BANNERS.map(b => ({ brand: b.brand, impressions: 0, clicks: 0, ctr: 0 })),
  };
}

const PLACEMENT_LABELS: Record<string, string> = {
  "homepage-sidebar":     "Home — Sidebar (300×250)",
  "homepage-leaderboard": "Home — Big banner (728×90)",
  "post-sidebar":         "Blog post — Sidebar",
  "post-leaderboard":     "Blog post — Big banner",
  "category-leaderboard": "Category page — Banner",
  "static-sidebar":       "Static pages — Sidebar",
};

export default async function BannersPage() {
  const analytics = await getAnalytics();

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader
        title="Banner Management"
        subtitle={`${BANNERS.filter(b => b.is_active).length} active · ${BANNERS.length} total banners`}
        action={
          <span className="text-xs px-3 py-1.5 rounded-lg bg-yellow-900/40 text-yellow-400 font-medium">
            ⚠ Edit src/lib/banners.ts to add/edit
          </span>
        }
      />

      <div className="flex-1 p-6 space-y-6 overflow-auto">

        {/* ── Analytics overview ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Impressions", value: analytics.totalImpressions.toLocaleString(), icon: "👁",  color: "#3AAFE5" },
            { label: "Total Clicks",      value: analytics.totalClicks.toLocaleString(),      icon: "🖱",  color: "#10B981" },
            { label: "Avg CTR",            value: analytics.ctr + "%",                          icon: "📊", color: "#F5A71A" },
            { label: "Active Banners",    value: BANNERS.filter(b => b.is_active).length,      icon: "🖼", color: "#8B5CF6" },
          ].map(s => (
            <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="text-xl mb-1">{s.icon}</div>
              <div className="text-2xl font-extrabold" style={{ color: s.color }}>{s.value}</div>
              <div className="text-[11px] text-gray-500 mt-0.5 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── How rotation works ── */}
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-3">⚙️ How the Banner System Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-400">
            <div className="bg-gray-800 rounded-lg p-3">
              <div className="text-2xl mb-1">🔄</div>
              <p className="font-semibold text-gray-300">Rotation</p>
              <p>2 banners rotate every 5 seconds in shared slots. Brand-specific slots show one banner only.</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-3">
              <div className="text-2xl mb-1">📍</div>
              <p className="font-semibold text-gray-300">Placements</p>
              <p>Each banner can appear in multiple slots: homepage, posts, categories, sidebar.</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-3">
              <div className="text-2xl mb-1">📈</div>
              <p className="font-semibold text-gray-300">Tracking</p>
              <p>Clicks logged via `post_shares` table. Add ad_clicks table for full CTR tracking.</p>
            </div>
          </div>
        </div>

        {/* ── Banner list ── */}
        <div>
          <h2 className="text-white font-bold mb-3">Active Banner Inventory</h2>
          <div className="space-y-3">
            {BANNERS.map(b => {
              const stat = analytics.bannerStats.find(s => s.brand === b.brand);
              return (
                <div key={b.id}
                  className={`bg-gray-900 border rounded-xl overflow-hidden ${b.is_active ? "border-green-800" : "border-gray-800 opacity-60"}`}>
                  <div className="p-5 flex flex-wrap items-start gap-5">
                    {/* Preview */}
                    <div className="w-40 h-24 rounded-lg flex-shrink-0 overflow-hidden border border-gray-700"
                      style={{ background: b.bg }}>
                      <img src={b.image_sm} alt={b.brand} className="w-full h-full object-cover" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-[200px]">
                      <div className="flex items-center gap-2 mb-1.5">
                        <h3 className="font-bold text-white text-lg">{b.brand}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                          b.is_active ? "bg-green-900/60 text-green-400" : "bg-gray-800 text-gray-500"
                        }`}>{b.is_active ? "ACTIVE" : "INACTIVE"}</span>
                      </div>
                      {b.notes && <p className="text-sm text-gray-400 mb-2">{b.notes}</p>}
                      <a href={b.url} target="_blank" className="text-xs hover:underline" style={{ color: "#3AAFE5" }}>
                        {b.url} ↗
                      </a>

                      {/* Placements */}
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {b.placements.map(p => (
                          <span key={p} className="text-[10px] px-2 py-0.5 rounded bg-gray-800 text-gray-400 font-medium">
                            {PLACEMENT_LABELS[p] || p}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Analytics */}
                    {stat && (
                      <div className="text-right">
                        <div className="grid grid-cols-3 gap-3 text-center">
                          <div>
                            <p className="text-xl font-bold text-white">{stat.impressions.toLocaleString()}</p>
                            <p className="text-[10px] text-gray-500 uppercase">Imps</p>
                          </div>
                          <div>
                            <p className="text-xl font-bold" style={{ color: "#10B981" }}>{stat.clicks}</p>
                            <p className="text-[10px] text-gray-500 uppercase">Clicks</p>
                          </div>
                          <div>
                            <p className="text-xl font-bold" style={{ color: "#F5A71A" }}>{stat.ctr.toFixed(2)}%</p>
                            <p className="text-[10px] text-gray-500 uppercase">CTR</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Share analytics ── */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h2 className="text-white font-bold mb-4">📤 Share Activity by Platform</h2>
          {analytics.sharesByPlatform.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-6">No shares yet — content needs to be shared!</p>
          ) : (
            <div className="space-y-2">
              {analytics.sharesByPlatform.map(s => {
                const max = analytics.sharesByPlatform[0].count;
                const pct = Math.round((s.count / max) * 100);
                return (
                  <div key={s.platform}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300 capitalize">{s.platform}</span>
                      <span className="font-semibold text-white">{s.count}</span>
                    </div>
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "#3AAFE5" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── How to add new banners ── */}
        <div className="bg-gray-900 border border-dashed border-gray-700 rounded-xl p-5">
          <h3 className="font-semibold text-white mb-2">➕ How to Add a New Banner</h3>
          <ol className="text-sm text-gray-400 space-y-2 list-decimal pl-5">
            <li>Drop your banner images into <code className="bg-gray-800 px-1 rounded">/public/banners/</code> (300×250 and 728×90 sizes)</li>
            <li>Edit <code className="bg-gray-800 px-1 rounded">src/lib/banners.ts</code> and add a new entry to the BANNERS array</li>
            <li>Set <code className="bg-gray-800 px-1 rounded">placements</code> to control where it appears</li>
            <li>Push to GitHub — Vercel auto-deploys</li>
          </ol>
          <p className="text-xs text-gray-500 mt-3">
            💡 Pro tip: Use a 24-hour A/B test by setting weight: 2 on a new banner to triple its rotation frequency.
          </p>
        </div>
      </div>
    </div>
  );
}
