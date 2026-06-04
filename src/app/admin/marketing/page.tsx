import AdminHeader from "@/components/admin/AdminHeader";

export default function MarketingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader title="Marketing" subtitle="Automation, social media, email campaigns" />
      <div className="flex-1 p-6 space-y-6">

        {/* Blog Agent status */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-white font-bold">🤖 Blog Agent</h2>
              <p className="text-gray-400 text-xs mt-0.5">Auto-posts every 4 hours via GitHub Actions</p>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-green-900/60 text-green-400 font-semibold">Active</span>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            {[
              { label:"Schedule", value:"Every 4 hours" },
              { label:"Model", value:"Claude Haiku" },
              { label:"Topics queued", value:"61 total" },
            ].map(s => (
              <div key={s.label} className="bg-gray-800 rounded-lg p-3">
                <p className="text-gray-500 text-xs">{s.label}</p>
                <p className="text-white font-semibold mt-0.5">{s.value}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-4">
            <a href="https://github.com" target="_blank"
              className="text-sm px-4 py-2 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors">
              View GitHub Actions →
            </a>
            <a href="/admin/agent"
              className="text-sm px-4 py-2 rounded-lg text-white transition-colors"
              style={{background:"#3AAFE5"}}>
              Manage Agent →
            </a>
          </div>
        </div>

        {/* Social media */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-white font-bold mb-4">📱 Social Media</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { platform:"Facebook", status:"Auto-post active", color:"#1877F2", action:"Configure →", href:"/admin/settings" },
              { platform:"LinkedIn", status:"Manual — use Dux-Soup", color:"#0A66C2", action:"Setup Guide →", href:"#" },
              { platform:"WhatsApp Business", status:"Button on site", color:"#25D366", action:"Configure →", href:"/admin/settings" },
              { platform:"Quora", status:"1 answer/day", color:"#B92B27", action:"Track answers →", href:"#" },
            ].map(s => (
              <div key={s.platform} className="bg-gray-800 rounded-xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center font-bold text-white text-sm"
                  style={{background:s.color}}>
                  {s.platform[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold">{s.platform}</p>
                  <p className="text-gray-400 text-xs">{s.status}</p>
                </div>
                <a href={s.href} className="text-xs flex-shrink-0" style={{color:"#3AAFE5"}}>{s.action}</a>
              </div>
            ))}
          </div>
        </div>

        {/* Monetisation tracker */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-white font-bold mb-4">💰 Monetisation Status</h2>
          <div className="space-y-3">
            {[
              { source:"Google AdSense",         status:"Review requested", color:"yellow", note:"Policy Center clean ✅" },
              { source:"Amazon Associates",       status:"Active",           color:"green",  note:"ID: edudhruv-20" },
              { source:"CJ Affiliate",            status:"Applied",          color:"yellow", note:"Awaiting approval" },
              { source:"Prodigy Finance Referral",status:"Not applied",      color:"red",    note:"Apply at prodigyfinance.com" },
              { source:"Credila Referral",        status:"Not applied",      color:"red",    note:"Apply at credila.com" },
              { source:"Media.net",               status:"Not applied",      color:"red",    note:"Apply alongside AdSense" },
            ].map(m => (
              <div key={m.source} className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${m.color==="green"?"bg-green-400":m.color==="yellow"?"bg-yellow-400":"bg-red-400"}`} />
                <span className="text-gray-300 text-sm flex-1">{m.source}</span>
                <span className={`text-xs font-medium ${m.color==="green"?"text-green-400":m.color==="yellow"?"text-yellow-400":"text-red-400"}`}>{m.status}</span>
                <span className="text-xs text-gray-500 hidden sm:block">{m.note}</span>
              </div>
            ))}
          </div>
        </div>

        {/* SEO quick actions */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-white font-bold mb-4">🔍 SEO Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label:"Sitemap", href:"/sitemap.xml", icon:"🗺️" },
              { label:"robots.txt", href:"/robots.txt", icon:"🤖" },
              { label:"ads.txt", href:"/ads.txt", icon:"📄" },
              { label:"Search Console", href:"https://search.google.com/search-console", icon:"📊", external:true },
              { label:"AdSense", href:"https://adsense.google.com", icon:"💵", external:true },
              { label:"Analytics", href:"https://analytics.google.com", icon:"📈", external:true },
              { label:"Amazon", href:"https://affiliate-program.amazon.in", icon:"📦", external:true },
              { label:"PageSpeed", href:"https://pagespeed.web.dev/analysis?url=https://www.edudhruv.com", icon:"⚡", external:true },
            ].map(a => (
              <a key={a.label} href={a.href} target={a.external?"_blank":"_self"}
                className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 rounded-lg p-3 text-sm text-gray-300 hover:text-white transition-colors">
                <span>{a.icon}</span>
                <span>{a.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
