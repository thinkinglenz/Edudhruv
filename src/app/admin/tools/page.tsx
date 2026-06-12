"use client";
import { useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";

interface AutoImagesResult {
  updated?: number;
  failed?: number;
  would_update?: number;
  samples?: string[];
  errors?: { slug: string; error: string }[];
  message?: string;
  error?: string;
}

export default function AdminToolsPage() {
  const [running, setRunning] = useState<"none" | "dry" | "real">("none");
  const [result, setResult]   = useState<AutoImagesResult | null>(null);
  const [err, setErr]         = useState("");

  async function callAutoImages(dryRun: boolean) {
    setRunning(dryRun ? "dry" : "real");
    setResult(null); setErr("");
    try {
      const r = await fetch("/api/admin/auto-images", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ dry_run: dryRun, limit: 50 }),
      });
      const data = await r.json();
      if (!r.ok) {
        setErr(data.error || "Failed");
      } else {
        setResult(data);
      }
    } catch (e: any) {
      setErr(e.message || "Network error");
    }
    setRunning("none");
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader title="Bulk Tools" subtitle="One-off maintenance jobs" />

      <div className="flex-1 p-6 overflow-auto max-w-4xl mx-auto w-full space-y-6">
        {/* Auto-Images tool */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
            <div>
              <h2 className="text-white font-bold text-lg">🖼 Auto-Assign Featured Images</h2>
              <p className="text-gray-400 text-sm mt-0.5">
                Find published posts with no featured image, fetch one from Unsplash
                using the post's category + title, and save to Supabase.
              </p>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-sm text-gray-300">
              <strong className="text-white">How it works:</strong>
              <ul className="mt-2 ml-5 list-disc space-y-1 text-gray-400">
                <li>Queries Unsplash with category-aware keywords (e.g. "indian student bank finance" for loans)</li>
                <li>Throttled at 700ms/post to stay under Unsplash's free-tier rate limit</li>
                <li>Up to 50 posts per click — re-click if more remain</li>
                <li>Saves URL + alt text + photographer credit (auto)</li>
                <li>Skips posts that already have an image — safe to re-run</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => callAutoImages(true)}
                disabled={running !== "none"}
                className="flex-1 py-3 rounded-lg text-sm font-bold border-2 border-gray-600 text-gray-300 hover:bg-gray-800 disabled:opacity-50"
              >
                {running === "dry" ? "Checking…" : "🔍 Dry run (count only)"}
              </button>
              <button
                onClick={() => callAutoImages(false)}
                disabled={running !== "none"}
                className="flex-1 py-3 rounded-lg text-sm font-bold text-white disabled:opacity-50"
                style={{ background: "#3AAFE5" }}
              >
                {running === "real" ? "Assigning images… (up to 60s)" : "✨ Run: assign up to 50 images"}
              </button>
            </div>

            {err && (
              <div className="bg-red-900/40 border border-red-700 text-red-300 rounded-lg px-4 py-3 text-sm">
                🚫 {err}
              </div>
            )}

            {result && (
              <div className="bg-green-900/30 border border-green-700 text-green-200 rounded-lg p-4 text-sm">
                <p className="font-bold text-base mb-2">✓ Done</p>
                <ul className="space-y-1 text-green-300">
                  {result.would_update !== undefined && (
                    <li>📊 <strong>{result.would_update}</strong> posts would be updated</li>
                  )}
                  {result.updated !== undefined && (
                    <li>✓ <strong>{result.updated}</strong> images assigned</li>
                  )}
                  {result.failed !== undefined && result.failed > 0 && (
                    <li>⚠ <strong>{result.failed}</strong> failed</li>
                  )}
                  {result.message && <li>{result.message}</li>}
                </ul>

                {result.samples && result.samples.length > 0 && (
                  <details className="mt-3">
                    <summary className="cursor-pointer text-xs text-green-300/80 hover:text-green-200">
                      Show sample {result.would_update ? "candidates" : "updated"} ({result.samples.length})
                    </summary>
                    <ul className="mt-2 text-xs font-mono space-y-0.5 text-green-200/70">
                      {result.samples.map((s, i) => <li key={i}>· {s}</li>)}
                    </ul>
                  </details>
                )}

                {result.errors && result.errors.length > 0 && (
                  <details className="mt-3">
                    <summary className="cursor-pointer text-xs text-orange-300 hover:text-orange-200">
                      Show errors ({result.errors.length})
                    </summary>
                    <ul className="mt-2 text-xs font-mono space-y-0.5 text-orange-200/70">
                      {result.errors.map((e, i) => <li key={i}>· {e.slug} — {e.error}</li>)}
                    </ul>
                  </details>
                )}
              </div>
            )}
          </div>
        </div>

        <p className="text-xs text-gray-500 text-center">
          More bulk tools (regenerate stale content, re-fetch scholarship images, etc.) will appear here as needed.
        </p>
      </div>
    </div>
  );
}
