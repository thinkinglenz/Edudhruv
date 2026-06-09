"use client";
import { useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";

export default function QuoraPage() {
  const [question, setQuestion] = useState("");
  const [context, setContext]   = useState("");
  const [draft, setDraft]       = useState("");
  const [wordCount, setWC]      = useState(0);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [copied, setCopied]     = useState(false);

  async function generate() {
    if (!question.trim()) { setError("Paste a Quora question first"); return; }
    setLoading(true); setError(""); setDraft("");
    try {
      const r = await fetch("/api/admin/quora-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, context }),
      });
      const data = await r.json();
      if (!r.ok) {
        setError(data.error || "Failed to generate");
      } else {
        setDraft(data.draft);
        setWC(data.wordCount);
      }
    } catch (e: any) {
      setError(e.message || "Network error");
    }
    setLoading(false);
  }

  async function copyDraft() {
    await navigator.clipboard.writeText(draft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  function openQuora() {
    window.open("https://www.quora.com/", "_blank", "noopener,noreferrer");
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader
        title="Quora Answer Engine"
        subtitle="Paste a question — get a publication-ready answer using EduDhruv's voice"
      />

      <div className="flex-1 p-6 overflow-auto max-w-5xl mx-auto w-full space-y-6">
        {/* How it works */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-start gap-3">
          <span className="text-2xl flex-shrink-0">💡</span>
          <div className="text-sm">
            <p className="text-gray-200 font-medium mb-1">Why Quora answers drive Google traffic</p>
            <p className="text-gray-500 text-xs leading-relaxed">
              Quora answers rank in Google search results, often above the original blog posts. Top study-abroad
              questions get 50k-500k views each. Posting 2-3 quality answers per day → 5-15k incremental visitors
              per month to EduDhruv within 60 days.
              <br /><br />
              <strong className="text-gray-300">Workflow:</strong> Find a relevant question on Quora →
              paste it below → review the generated answer (edit if needed) → copy → post on Quora manually.
              <br />
              <strong className="text-red-400">DO NOT bulk-post.</strong> Quora bans automation. 2-3 answers/day max,
              spaced across the day.
            </p>
          </div>
        </div>

        {/* Inputs */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              Quora question *
            </label>
            <textarea
              value={question} onChange={e => setQuestion(e.target.value)}
              rows={3}
              placeholder="e.g. What is the best education loan for studying MBA in USA from India?"
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              Additional context (optional)
            </label>
            <textarea
              value={context} onChange={e => setContext(e.target.value)}
              rows={2}
              placeholder="e.g. Question is from a student admitted to NYU Stern, family has property in Bangalore"
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand resize-none"
            />
          </div>

          <button
            onClick={generate} disabled={loading || !question.trim()}
            className="w-full py-3 rounded-lg font-bold text-white text-sm transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ background: "#3AAFE5" }}
          >
            {loading ? "✨ Generating answer..." : "✨ Generate Quora Answer"}
          </button>

          {error && (
            <div className="bg-red-900/40 border border-red-700 text-red-300 rounded-lg px-4 py-2.5 text-sm">
              🚫 {error}
            </div>
          )}
        </div>

        {/* Output */}
        {draft && (
          <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-800 flex items-center justify-between">
              <div>
                <p className="text-white font-semibold text-sm">Generated answer</p>
                <p className="text-xs text-gray-500">{wordCount} words · Edit before posting</p>
              </div>
            </div>
            <div className="p-5">
              <textarea
                value={draft} onChange={e => { setDraft(e.target.value); setWC(e.target.value.split(/\s+/).length); }}
                rows={18}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 text-sm font-mono leading-relaxed focus:outline-none focus:border-brand resize-none"
              />
            </div>
            <div className="px-5 py-3 border-t border-gray-800 flex flex-col sm:flex-row gap-2">
              <button
                onClick={copyDraft}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold border transition-colors ${
                  copied
                    ? "bg-green-900/40 border-green-700 text-green-300"
                    : "border-gray-700 text-gray-200 hover:bg-gray-800"
                }`}
              >
                {copied ? "✓ Copied!" : "📋 Copy answer"}
              </button>
              <button onClick={openQuora}
                      className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white"
                      style={{ background: "#B92B27" }}>
                Open Quora →
              </button>
              <button onClick={generate} disabled={loading}
                      className="flex-1 py-2.5 rounded-lg text-sm font-semibold border border-gray-700 text-gray-300 hover:bg-gray-800">
                {loading ? "..." : "🔄 Regenerate"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
