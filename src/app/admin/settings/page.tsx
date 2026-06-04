"use client";
import { useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";

// ─── TAB DEFINITIONS ──────────────────────────────────────────────────────
const TABS = [
  { id:"google",   label:"Google",    icon:"🔵" },
  { id:"ai",       label:"AI & Chat", icon:"🤖" },
  { id:"database", label:"Database",  icon:"🗄️" },
  { id:"media",    label:"Media",     icon:"🖼️" },
  { id:"affiliate",label:"Affiliate", icon:"💰" },
  { id:"social",   label:"Social",    icon:"📱" },
  { id:"security", label:"Security",  icon:"🔒" },
];

const FIELDS: Record<string, { key:string; label:string; type:string; hint:string; secret?:boolean }[]> = {
  google: [
    { key:"NEXT_PUBLIC_GA_ID",                   label:"Google Analytics (GA4) ID",     type:"text",     hint:"G-XXXXXXXXXX — from analytics.google.com" },
    { key:"NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION",label:"Search Console Verification",   type:"text",     hint:"From Search Console → Settings → Ownership verification" },
    { key:"NEXT_PUBLIC_ADSENSE_ID",              label:"AdSense Publisher ID",           type:"text",     hint:"ca-pub-8001713028154145 (already set)" },
    { key:"NEXT_PUBLIC_AD_SLOT_LEADERBOARD",     label:"Ad Slot — Leaderboard 728×90",  type:"text",     hint:"Create in AdSense → Ads → By ad unit → Leaderboard" },
    { key:"NEXT_PUBLIC_AD_SLOT_SIDEBAR",         label:"Ad Slot — Sidebar 300×250",     type:"text",     hint:"Create in AdSense → Ads → By ad unit → Rectangle" },
    { key:"NEXT_PUBLIC_AD_SLOT_INFEED",          label:"Ad Slot — In-Feed Auto",        type:"text",     hint:"Create in AdSense → Ads → By ad unit → In-feed" },
  ],
  ai: [
    { key:"ANTHROPIC_API_KEY",  label:"Anthropic API Key",  type:"password", hint:"sk-ant-... from console.anthropic.com",                       secret:true },
    { key:"CLAUDE_MODEL",       label:"Claude Model",       type:"text",     hint:"claude-haiku-4-5-20251001 (for blog agent + Priya chatbot)" },
    { key:"MAX_TOKENS",         label:"Max Tokens",         type:"text",     hint:"4096 (recommended for full articles)" },
    { key:"UNSPLASH_ACCESS_KEY",label:"Unsplash Access Key",type:"password", hint:"From unsplash.com/oauth/applications — for post images",      secret:true },
  ],
  database: [
    { key:"NEXT_PUBLIC_SUPABASE_URL",      label:"Supabase Project URL",    type:"text",     hint:"https://xxxx.supabase.co — from Supabase → Settings → API" },
    { key:"NEXT_PUBLIC_SUPABASE_ANON_KEY", label:"Supabase Anon Key",       type:"password", hint:"Public anon key — safe for browser use",     secret:true },
    { key:"SUPABASE_SERVICE_ROLE_KEY",     label:"Supabase Service Role Key",type:"password", hint:"⚠️ SECRET — server-side only, never expose", secret:true },
  ],
  media: [
    { key:"UNSPLASH_ACCESS_KEY",label:"Unsplash Access Key", type:"password", hint:"From unsplash.com/oauth/applications", secret:true },
    { key:"CLOUDINARY_URL",     label:"Cloudinary URL (optional)", type:"password", hint:"For image uploads via Cloudinary — optional", secret:true },
  ],
  affiliate: [
    { key:"NEXT_PUBLIC_AMAZON_ASSOCIATE_ID",label:"Amazon Associate ID",    type:"text",    hint:"edudhruv-20 (already set) — Amazon.in affiliate program" },
    { key:"CJ_AFFILIATE_ID",               label:"CJ Affiliate ID",        type:"text",    hint:"From CJ Affiliate dashboard — applied" },
    { key:"CJ_AFFILIATE_SECRET",           label:"CJ Affiliate Secret",    type:"password",hint:"CJ API secret key",  secret:true },
    { key:"PRODIGY_REFERRAL_CODE",         label:"Prodigy Finance Referral",type:"text",   hint:"From prodigyfinance.com/partners" },
    { key:"CREDILA_REFERRAL_CODE",         label:"Credila Referral Code",  type:"text",    hint:"From credila.com affiliate program" },
  ],
  social: [
    { key:"FB_PAGE_ACCESS_TOKEN",  label:"Facebook Page Access Token", type:"password", hint:"From Meta Graph API Explorer → me/accounts → access_token",  secret:true },
    { key:"FB_PAGE_ID",            label:"Facebook Page ID",           type:"text",     hint:"109173178522211" },
    { key:"FB_APP_ID",             label:"Facebook App ID",            type:"text",     hint:"From Meta for Developers" },
    { key:"NEWSAPI_KEY",           label:"NewsAPI Key",                type:"password", hint:"From newsapi.org — for news agent", secret:true },
    { key:"WHATSAPP_NUMBER",       label:"WhatsApp Business Number",   type:"text",     hint:"+91XXXXXXXXXX — for WhatsApp button" },
    { key:"LEAD_NOTIFY_EMAIL",     label:"Lead Notification Email",    type:"email",    hint:"edudruv@gmail.com — notified when new lead arrives" },
  ],
  security: [
    { key:"ADMIN_PASSWORD",      label:"Admin Panel Password",    type:"password", hint:"Current: EduDhruv@Admin2025 — change immediately on Vercel", secret:true },
    { key:"ADMIN_SESSION_TOKEN", label:"Session Token Secret",    type:"password", hint:"Random string for session signing — change on Vercel",       secret:true },
  ],
};

// Status: which env vars are currently set
const ENV_STATUS: Record<string, boolean> = {
  NEXT_PUBLIC_GA_ID:                    false,
  NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION: false,
  NEXT_PUBLIC_ADSENSE_ID:               true,
  NEXT_PUBLIC_AD_SLOT_LEADERBOARD:      false,
  NEXT_PUBLIC_AD_SLOT_SIDEBAR:          false,
  NEXT_PUBLIC_AD_SLOT_INFEED:           false,
  ANTHROPIC_API_KEY:                    false,
  CLAUDE_MODEL:                         true,
  MAX_TOKENS:                           true,
  UNSPLASH_ACCESS_KEY:                  false,
  NEXT_PUBLIC_SUPABASE_URL:             false,
  NEXT_PUBLIC_SUPABASE_ANON_KEY:        false,
  SUPABASE_SERVICE_ROLE_KEY:            false,
  NEXT_PUBLIC_AMAZON_ASSOCIATE_ID:      true,
  CJ_AFFILIATE_ID:                      false,
  CJ_AFFILIATE_SECRET:                  false,
  FB_PAGE_ACCESS_TOKEN:                 false,
  FB_PAGE_ID:                           true,
  NEWSAPI_KEY:                          false,
  LEAD_NOTIFY_EMAIL:                    false,
  ADMIN_PASSWORD:                       true,
  ADMIN_SESSION_TOKEN:                  true,
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("google");
  const [values, setValues]       = useState<Record<string,string>>({});
  const [visible, setVisible]     = useState<Record<string,boolean>>({});
  const [savedMsg, setSavedMsg]   = useState("");

  const fields = FIELDS[activeTab] || [];
  const tabMissingCount = (tab: string) =>
    (FIELDS[tab] || []).filter(f => !ENV_STATUS[f.key]).length;

  function save() {
    setSavedMsg("✅ Copied! Paste these into Vercel → Project → Environment Variables, then redeploy.");
    setTimeout(() => setSavedMsg(""), 6000);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader
        title="Settings & API Keys"
        subtitle="All integrations in one place"
        action={
          <button onClick={save}
            className="text-sm font-semibold px-4 py-2 rounded-lg text-white"
            style={{ background:"#3AAFE5" }}>
            Save Changes
          </button>
        }
      />

      <div className="flex flex-1 overflow-hidden">
        {/* ── Left: Tab nav ── */}
        <div className="w-48 flex-shrink-0 bg-gray-900 border-r border-gray-800 py-4 px-3 space-y-0.5">
          {TABS.map(tab => {
            const missing = tabMissingCount(tab.id);
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                  activeTab === tab.id
                    ? "text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
                style={activeTab === tab.id ? { background:"#3AAFE5" } : {}}
              >
                <span className="flex items-center gap-2">
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </span>
                {missing > 0 && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    activeTab === tab.id ? "bg-white/20 text-white" : "bg-red-900/60 text-red-400"
                  }`}>
                    {missing}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── Right: Fields ── */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Save message */}
          {savedMsg && (
            <div className="bg-green-900/40 border border-green-700 text-green-300 rounded-xl px-5 py-3 text-sm">
              {savedMsg}
            </div>
          )}

          {/* How to apply */}
          <div className="bg-gray-900 border border-gray-700 rounded-xl px-5 py-3 flex items-start gap-3">
            <span className="text-lg mt-0.5">ℹ️</span>
            <div className="text-sm">
              <p className="text-gray-300 font-medium">How to apply changes</p>
              <p className="text-gray-500 text-xs mt-0.5">
                Edit values → Save → Add to <strong className="text-gray-400">Vercel → Environment Variables</strong> → Redeploy.
                For the blog agent, add to <code className="bg-gray-800 px-1 rounded">automation/.env</code> and GitHub Secrets.
              </p>
            </div>
          </div>

          {/* Fields */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="px-5 py-3 bg-gray-800 border-b border-gray-700 flex items-center gap-2">
              <span>{TABS.find(t=>t.id===activeTab)?.icon}</span>
              <h2 className="text-white font-semibold">{TABS.find(t=>t.id===activeTab)?.label} Settings</h2>
            </div>
            <div className="p-5 space-y-5">
              {fields.map(f => {
                const isSet = ENV_STATUS[f.key];
                const isVisible = visible[f.key];
                return (
                  <div key={f.key}>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="flex items-center gap-2 text-xs text-gray-400 font-medium uppercase tracking-wider">
                        {f.label}
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${isSet ? "bg-green-900/60 text-green-400" : "bg-red-900/60 text-red-400"}`}>
                          {isSet ? "✅ Set" : "❌ Missing"}
                        </span>
                      </label>
                      {f.secret && (
                        <button
                          onClick={() => setVisible(v => ({...v,[f.key]:!v[f.key]}))}
                          className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                        >
                          {isVisible ? "🙈 Hide" : "👁 Show"}
                        </button>
                      )}
                    </div>
                    <input
                      type={f.secret && !isVisible ? "password" : "text"}
                      placeholder={isSet ? "••••••••••• (already set in Vercel)" : f.hint}
                      value={values[f.key] || ""}
                      onChange={e => setValues(v => ({...v,[f.key]:e.target.value}))}
                      className={`w-full bg-gray-800 border rounded-lg px-4 py-2.5 text-sm font-mono text-white focus:outline-none transition-colors ${
                        values[f.key] ? "border-brand" : isSet ? "border-green-800" : "border-gray-700 focus:border-gray-500"
                      }`}
                      style={values[f.key] ? {borderColor:"#3AAFE5"} : {}}
                    />
                    <p className="text-xs text-gray-600 mt-1">{f.hint}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Vercel deployment reminder */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h3 className="text-white font-semibold mb-3 text-sm">📋 Deployment Checklist for {TABS.find(t=>t.id===activeTab)?.label}</h3>
            <ol className="space-y-2">
              {fields.map((f, i) => (
                <li key={f.key} className="flex items-center gap-2.5 text-sm">
                  <span className={`w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold flex-shrink-0 ${
                    ENV_STATUS[f.key] ? "bg-green-800 text-green-300" : "bg-gray-800 text-gray-500"
                  }`}>
                    {ENV_STATUS[f.key] ? "✓" : i+1}
                  </span>
                  <span className={ENV_STATUS[f.key] ? "text-gray-500 line-through" : "text-gray-300"}>
                    {ENV_STATUS[f.key] ? `${f.label} — done` : `Add ${f.key} to Vercel`}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
