"use client";
import { useState } from "react";

interface Props {
  /** Where the signup happened — passed to /api/newsletter for analytics */
  sourceSlug?: string;
  /** "inline" = embedded in post body · "compact" = sidebar */
  variant?: "inline" | "compact";
}

export default function NewsletterSignup({ sourceSlug, variant = "inline" }: Props) {
  const [email, setEmail]     = useState("");
  const [name, setName]       = useState("");
  const [status, setStatus]   = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [errMsg, setErrMsg]   = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading"); setErrMsg("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name: name || undefined,
          source_slug: sourceSlug,
          source_url: typeof window !== "undefined" ? window.location.href : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("err");
        setErrMsg(data.error || "Could not subscribe — try again");
      } else {
        setStatus("ok");
      }
    } catch {
      setStatus("err");
      setErrMsg("Network error — please try again");
    }
  }

  if (status === "ok") {
    return (
      <div className={`rounded-xl p-5 border-2 text-center ${variant === "inline" ? "my-8" : "my-4"}`}
           style={{ background: "#ECFDF5", borderColor: "#10B981" }}>
        <p className="text-3xl mb-2">🎉</p>
        <p className="font-bold text-green-800 text-base">You're in!</p>
        <p className="text-green-700 text-sm mt-1">
          You'll get our best study-abroad picks every Sunday morning. No spam, ever.
        </p>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className="rounded-xl p-5 border" style={{ background: "#FFFBF0", borderColor: "#F5A71A" }}>
        <h3 className="font-bold text-base mb-1" style={{ color: "#B07208" }}>📬 Weekly digest</h3>
        <p className="text-xs text-gray-600 mb-3">
          Best scholarships, loan deals & deadlines for Indian students. Every Sunday.
        </p>
        <form onSubmit={submit} className="space-y-2">
          <input
            type="email" placeholder="your@email.com" required
            value={email} onChange={e => setEmail(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand"
          />
          <button type="submit" disabled={status === "loading"}
                  className="w-full text-white text-sm font-semibold py-2 rounded-lg transition-opacity hover:opacity-90 disabled:opacity-50"
                  style={{ background: "#F5A71A" }}>
            {status === "loading" ? "Subscribing…" : "Get the digest →"}
          </button>
          {errMsg && <p className="text-xs text-red-600">{errMsg}</p>}
        </form>
        <p className="text-[10px] text-gray-400 mt-2">No spam. Unsubscribe anytime.</p>
      </div>
    );
  }

  // Inline (post body) variant
  return (
    <aside className="rounded-2xl p-6 sm:p-8 my-10 border-2 shadow-sm relative overflow-hidden"
           style={{ background: "linear-gradient(135deg, #EBF7FD 0%, #FFFBF0 100%)", borderColor: "#3AAFE5" }}>
      <div className="relative z-10 max-w-2xl">
        <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3"
              style={{ background: "#3AAFE5", color: "white" }}>
          📬 Free Newsletter
        </span>
        <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-2">
          Don't miss the next big scholarship.
        </h3>
        <p className="text-gray-700 text-sm sm:text-base mb-5">
          Every Sunday we send Indian students the week's best scholarships, education-loan
          deals, and upcoming deadlines. <strong>12,000+ students subscribed.</strong>
        </p>

        <form onSubmit={submit} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text" placeholder="Your name (optional)"
            value={name} onChange={e => setName(e.target.value)}
            className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand"
          />
          <input
            type="email" placeholder="your@email.com" required
            value={email} onChange={e => setEmail(e.target.value)}
            className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand"
          />
          <button type="submit" disabled={status === "loading"}
                  className="text-white text-sm font-bold px-6 py-3 rounded-lg transition-opacity hover:opacity-90 disabled:opacity-50 whitespace-nowrap"
                  style={{ background: "#3AAFE5" }}>
            {status === "loading" ? "…" : "Subscribe Free →"}
          </button>
        </form>
        {errMsg && <p className="text-xs text-red-600 mt-2">{errMsg}</p>}
        <p className="text-xs text-gray-500 mt-3">
          ✓ Free forever · ✓ One email per week · ✓ Unsubscribe with one click
        </p>
      </div>
    </aside>
  );
}
