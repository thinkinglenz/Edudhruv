"use client";
import { useState } from "react";

interface Props {
  magnetSlug:   string;
  title:        string;
  description:  string;
  highlights:   string[];   // 3-5 bullets of what's inside
  imageEmoji:   string;     // big emoji as visual
  expectedSize: string;     // "20-page guide"
}

export default function LeadMagnetGate({ magnetSlug, title, description, highlights, imageEmoji, expectedSize }: Props) {
  const [name, setName]   = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [errMsg, setErrMsg] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading"); setErrMsg("");
    try {
      const r = await fetch("/api/lead-magnet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, magnet_slug: magnetSlug }),
      });
      const data = await r.json();
      if (!r.ok) {
        setStatus("err");
        setErrMsg(data.error || "Could not unlock. Try again.");
      } else {
        setStatus("ok");
        setDownloadUrl(data.download_url || `/lead-magnets/${magnetSlug}`);
      }
    } catch {
      setStatus("err");
      setErrMsg("Network error. Try again.");
    }
  }

  if (status === "ok") {
    return (
      <div className="bg-white rounded-2xl border-2 p-8 sm:p-10 text-center" style={{ borderColor: "#10B981" }}>
        <p className="text-7xl mb-4">{imageEmoji}</p>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">Your guide is ready!</h2>
        <p className="text-gray-600 mb-6">We've also emailed it to you for easy access later.</p>
        <a href={downloadUrl} target="_blank" rel="noopener"
           className="inline-flex items-center gap-2 text-white font-bold px-6 py-3 rounded-xl"
           style={{ background: "#10B981" }}>
          📥 Open the guide →
        </a>
        <p className="text-xs text-gray-500 mt-5">
          💡 To save as PDF: open the guide → Cmd+P / Ctrl+P → "Save as PDF"
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-100 p-6 sm:p-10 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <p className="text-7xl mb-4">{imageEmoji}</p>
          <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3"
                style={{ background: "#FEF3C7", color: "#B45309" }}>
            📥 Free {expectedSize}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-600 mb-4">{description}</p>
          <ul className="space-y-1.5 text-sm">
            {highlights.map((h, i) => (
              <li key={i} className="flex gap-2 text-gray-700">
                <span className="text-green-600 flex-shrink-0">✓</span>
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </div>

        <form onSubmit={submit}
              className="bg-gradient-to-br from-blue-50 to-yellow-50 border-2 rounded-2xl p-6 space-y-3"
              style={{ borderColor: "#3AAFE5" }}>
          <h3 className="text-lg font-extrabold text-gray-900 mb-1">📥 Get instant access</h3>
          <p className="text-xs text-gray-600 mb-3">Drop your email — we'll unlock the guide + send it to your inbox.</p>

          <input type="text" placeholder="Your name" required
                 value={name} onChange={e => setName(e.target.value)}
                 className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand" />
          <input type="email" placeholder="you@example.com" required
                 value={email} onChange={e => setEmail(e.target.value)}
                 className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand" />
          <button type="submit" disabled={status === "loading"}
                  className="w-full text-white font-bold py-3 rounded-lg text-sm transition-opacity hover:opacity-90 disabled:opacity-50"
                  style={{ background: "#3AAFE5" }}>
            {status === "loading" ? "Unlocking…" : `📥 Unlock the ${expectedSize}`}
          </button>
          {errMsg && (
            <p className="text-xs text-red-600">{errMsg}</p>
          )}
          <p className="text-[11px] text-gray-500 text-center">
            ✓ Free forever &middot; ✓ Sunday digest of new scholarships &middot; ✓ Unsubscribe anytime
          </p>
        </form>
      </div>
    </div>
  );
}
