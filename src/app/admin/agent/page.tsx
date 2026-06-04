"use client";
import { useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";

const TOPICS: Record<string, string[]> = {
  "Indian Students Abroad": [
    "How to Get a Student Visa for the UK as an Indian Student",
    "Life in Canada for Indian Students: What No One Tells You",
    "Top 5 Part-Time Jobs for Indian Students in Australia",
    "Cost of Living for Indian Students in Germany 2025",
    "How Indian Students Can Open a Bank Account in the UK",
    "Student Health Insurance for Indians Studying Abroad",
    "Indian Food in Australian Cities: A Survival Guide",
    "How to Send Money Home from the UK as an Indian Student",
    "Indian Student Communities in Singapore",
    "Celebrating Diwali as an Indian Student Abroad",
    "How to Convert Indian Degree Equivalence for Abroad Universities",
    "Mental Health Support for Indian Students Studying Abroad",
  ],
  "Top Universities": [
    "Top 10 Universities in Canada for Indian Students 2025",
    "Best Engineering Universities in Germany for International Students",
    "QS Rankings 2025: Best Universities for MBA in UK",
    "NUS vs NTU — Which Singapore University is Better",
    "Top Universities in Australia for Computer Science",
    "University of Melbourne vs Monash: Which One to Choose",
  ],
  "Scholarship": [
    "Top 10 Scholarships for Indian Students 2025",
    "Chevening Scholarship 2025: Complete Guide for Indians",
    "Commonwealth Scholarship: How to Apply",
    "Australia Awards Scholarship: Step-by-Step Guide",
    "DAAD Scholarship Germany",
  ],
  "Education Loan": [
    "SBI Education Loan for Abroad Studies",
    "HDFC Credila vs Avanse: Which is Better",
    "How to Get Education Loan Without Collateral",
    "Education Loan Tax Benefit Under Section 80E",
    "Prodigy Finance Review for Indian Students",
  ],
};

const PUBLISHED: string[] = []; // would come from agent_state table

export default function AgentPage() {
  const [running, setRunning] = useState(false);
  const [log, setLog]         = useState<string[]>([]);
  const [expandedCat, setExpandedCat] = useState<string | null>("Indian Students Abroad");
  const [paused, setPaused]   = useState(false);

  const totalTopics    = Object.values(TOPICS).flat().length;
  const publishedCount = PUBLISHED.length;
  const remaining      = totalTopics - publishedCount;

  function simulate() {
    setRunning(true);
    setLog([]);
    const steps = [
      "🔄 Checking agent_state for already-published topics...",
      "📂 Cycle 3 → category: Indian Students Abroad",
      "🎯 Topic: How Indian Students Can Open a Bank Account in the UK",
      "🖼️  Fetching cover image from Unsplash...",
      "✍️  Calling Claude Haiku (max_tokens: 4096)...",
      "✅ Content generated: 1,340 words · 7 min read",
      "🏷️  Yoast SEO fields populated (meta_title, meta_description, focus_keyword)",
      "📤 Publishing to Supabase posts table...",
      "✅ Published! → /indian-students-abroad/how-indian-students-open-bank-account-uk",
      "💾 Agent state updated. Next cycle: 4",
    ];
    steps.forEach((s, i) => setTimeout(() => {
      setLog(l => [...l, s]);
      if (i === steps.length - 1) setRunning(false);
    }, i * 700));
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader
        title="Blog Agent — Automated Content"
        subtitle="AI agent that publishes 1 SEO-optimised blog post every 4 hours"
        action={
          <div className="flex gap-2">
            <button onClick={() => setPaused(!paused)}
              className={`text-sm font-semibold px-4 py-2 rounded-lg ${
                paused ? "bg-green-600 hover:bg-green-700" : "bg-gray-700 hover:bg-gray-600"
              } text-white transition-colors`}>
              {paused ? "▶ Resume" : "⏸ Pause"}
            </button>
            <button onClick={simulate} disabled={running}
              className="text-sm font-semibold px-4 py-2 rounded-lg text-white disabled:opacity-50 transition-colors"
              style={{ background: "#3AAFE5" }}>
              {running ? "⏳ Running..." : "▶ Run Now"}
            </button>
          </div>
        }
      />

      <div className="flex-1 p-6 space-y-6 overflow-auto">

        {/* ─── WHAT IT DOES — Top explainer ─── */}
        <div className="bg-gradient-to-br from-blue-950 to-purple-950 border border-blue-800 rounded-xl p-6">
          <h2 className="text-white font-bold text-lg mb-3">🤖 What is the Blog Agent?</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            The Blog Agent is an automated AI writer that publishes one fresh, SEO-optimised article to your site every 4 hours —
            without you lifting a finger. It picks a topic from a curated list, generates a 1200-1800 word article using Claude AI,
            adds a featured image from Unsplash, writes the meta tags, and publishes it.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
            {[
              { icon: "🧠", label: "AI Writer",       desc: "Claude Haiku generates each post" },
              { icon: "📝", label: "1,200+ words",     desc: "Long-form SEO content" },
              { icon: "🖼️", label: "Auto images",      desc: "Unsplash cover photos" },
              { icon: "🔄", label: "Every 4 hours",    desc: "6 posts per day, free via GitHub Actions" },
            ].map(c => (
              <div key={c.label} className="bg-black/30 rounded-lg p-3">
                <div className="text-2xl mb-1">{c.icon}</div>
                <p className="text-white text-sm font-semibold">{c.label}</p>
                <p className="text-gray-400 text-xs">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ─── ADMIN CONTROLS ─── */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-white font-bold mb-4">🎛️ Your Admin Controls</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: "▶",  title: "Run Now",       desc: "Trigger an immediate post outside the 4-hour schedule", action: "Click ▶ Run Now (top right)" },
              { icon: "⏸", title: "Pause / Resume",  desc: "Temporarily stop the auto-publishing schedule",         action: "Click ⏸ Pause" },
              { icon: "📚", title: "Topic Bank",     desc: "View and manage the queue of 60+ topics",               action: "See expandable list below" },
              { icon: "📊", title: "Cycle Tracking",  desc: "See which topics are published vs queued",              action: "Green ✓ = published" },
              { icon: "⚙",  title: "Model Settings", desc: "Configure Claude model, max tokens, schedule",          action: "Configuration section below" },
              { icon: "🔧", title: "Edit Topics",    desc: "Add/remove topics in src/lib/banners.ts → TOPICS",      action: "Edit code + redeploy" },
            ].map((c, i) => (
              <div key={i} className="bg-gray-800 rounded-lg p-4 flex gap-3">
                <span className="text-2xl flex-shrink-0">{c.icon}</span>
                <div>
                  <p className="text-white font-semibold text-sm">{c.title}</p>
                  <p className="text-gray-400 text-xs leading-relaxed mt-1">{c.desc}</p>
                  <p className="text-[11px] mt-2" style={{ color: "#3AAFE5" }}>→ {c.action}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Stats ─── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Topics",  value: totalTopics,    icon: "📚", color: "#3AAFE5" },
            { label: "Published",     value: publishedCount, icon: "✅", color: "#10B981" },
            { label: "Remaining",     value: remaining,      icon: "📝", color: "#F5A71A" },
            { label: "Status",        value: paused ? "Paused" : "Active", icon: paused ? "⏸" : "✓", color: paused ? "#EF4444" : "#10B981" },
          ].map(s => (
            <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="text-xl mb-1">{s.icon}</div>
              <div className="text-2xl font-extrabold" style={{ color: s.color }}>{s.value}</div>
              <div className="text-[11px] text-gray-500 mt-0.5 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ─── Configuration ─── */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h2 className="text-white font-bold mb-3">⚙ Configuration</h2>
            <div className="space-y-2.5">
              {[
                { label: "Model",        value: "claude-haiku-4-5-20251001", editable: true },
                { label: "Max tokens",   value: "4,096",                      editable: true },
                { label: "Schedule",     value: "0 */4 * * * (every 4 hours)",editable: true },
                { label: "Platform",     value: "GitHub Actions",             editable: false },
                { label: "Database",     value: "Supabase posts table",       editable: false },
                { label: "Images",       value: "Unsplash API",               editable: false },
                { label: "Status",       value: paused ? "Paused" : "Active", editable: false },
              ].map(c => (
                <div key={c.label} className="flex justify-between items-center py-2 border-b border-gray-800 last:border-0">
                  <span className="text-gray-400 text-sm">{c.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white text-sm font-mono bg-gray-800 px-2 py-0.5 rounded text-xs">{c.value}</span>
                    {c.editable && <span className="text-xs text-gray-600">in /admin/settings →</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ─── Live log ─── */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-white font-bold">📋 Live Agent Log</h2>
              {running && (
                <span className="flex items-center gap-1.5 text-xs text-green-400">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  Running
                </span>
              )}
            </div>
            <div className="bg-black rounded-xl p-4 h-64 overflow-y-auto font-mono text-xs space-y-1.5">
              {log.length === 0 ? (
                <p className="text-gray-600">Click "▶ Run Now" to see what happens when the agent publishes a post...</p>
              ) : (
                log.map((line, i) => (
                  <p key={i} className={
                    line.startsWith("✅") ? "text-green-400" :
                    line.startsWith("❌") ? "text-red-400" :
                    "text-gray-300"
                  }>{line}</p>
                ))
              )}
            </div>
          </div>
        </div>

        {/* ─── Topic bank ─── */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-800">
            <h2 className="text-white font-bold">📚 Topic Bank ({totalTopics} topics)</h2>
            <p className="text-gray-400 text-xs mt-0.5">
              Agent picks topics in this weighted rotation. ✓ = published. Add/edit in <code className="bg-gray-800 px-1 rounded">automation/evergreen_agent.py</code>
            </p>
          </div>
          <div className="p-4 space-y-2">
            {Object.entries(TOPICS).map(([cat, topics]) => (
              <div key={cat} className="border border-gray-800 rounded-xl overflow-hidden">
                <button onClick={() => setExpandedCat(expandedCat === cat ? null : cat)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-gray-800 hover:bg-gray-700 transition-colors text-left">
                  <span className="text-white font-medium text-sm">{cat}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">
                      {topics.filter(t => PUBLISHED.includes(t)).length}/{topics.length}
                    </span>
                    <span className="text-gray-400 text-sm">{expandedCat === cat ? "▲" : "▼"}</span>
                  </div>
                </button>
                {expandedCat === cat && (
                  <div className="p-3 space-y-1.5">
                    {topics.map(topic => {
                      const done = PUBLISHED.includes(topic);
                      return (
                        <div key={topic} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                          done ? "bg-green-950/20" : "bg-gray-800/50"
                        }`}>
                          <span className={done ? "text-green-400" : "text-gray-500"}>{done ? "✓" : "○"}</span>
                          <span className={done ? "text-green-300" : "text-gray-300"}>{topic}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ─── Weighted rotation ─── */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h2 className="text-white font-bold mb-3">🔄 Category Rotation (per 12-cycle period)</h2>
          <p className="text-gray-400 text-xs mb-4">
            Categories with higher weight get more slots. Indian Students Abroad gets 4× because of its high search volume.
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              { cat: "Indian Students Abroad", slots: 4, color: "bg-blue-900/50 text-blue-300" },
              { cat: "Top Universities",       slots: 2, color: "bg-purple-900/50 text-purple-300" },
              { cat: "Scholarship",            slots: 2, color: "bg-green-900/50 text-green-300" },
              { cat: "Education Loan",         slots: 2, color: "bg-yellow-900/50 text-yellow-300" },
              { cat: "Accommodation",          slots: 1, color: "bg-orange-900/50 text-orange-300" },
              { cat: "Travel Essentials",      slots: 1, color: "bg-red-900/50 text-red-300" },
            ].map(r => (
              <div key={r.cat} className={`px-3 py-2 rounded-xl text-xs font-medium ${r.color}`}>
                {r.cat} — <strong>{r.slots}</strong> {r.slots === 1 ? "slot" : "slots"}
              </div>
            ))}
          </div>
        </div>

        {/* ─── Quick links ─── */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h2 className="text-white font-bold mb-3">🔗 Related</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              ["GitHub Actions", "https://github.com",                        "📁", true],
              ["View Posts",     "/admin/posts",                              "📰", false],
              ["SEO Audit",      "/admin/seo",                                "🔍", false],
              ["Settings",       "/admin/settings",                           "⚙",  false],
            ].map(([label, href, icon, ext]) => (
              <a key={String(label)} href={String(href)} target={ext ? "_blank" : "_self"}
                className="bg-gray-800 hover:bg-gray-700 rounded-xl px-3 py-2.5 flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors">
                <span>{icon}</span>
                <span className="font-medium">{label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
