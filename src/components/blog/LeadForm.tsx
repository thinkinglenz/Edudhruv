"use client";
import { useState } from "react";
import TurnstileWidget from "@/components/social/TurnstileWidget";

interface Props {
  sourceSlug?: string;
}

export default function LeadForm({ sourceSlug }: Props) {
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!captchaToken) {
      setErrorMsg("Please complete the security check below"); setStatus("error"); return;
    }
    setStatus("loading"); setErrorMsg("");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source_post_slug: sourceSlug, captchaToken }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Submission failed");
      }
      setStatus("success");
    } catch (err: any) {
      setErrorMsg(err?.message || "Something went wrong"); setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center my-8">
        <div className="text-3xl mb-2">🎉</div>
        <h3 className="font-bold text-green-800 text-lg">You're on the list!</h3>
        <p className="text-green-700 text-sm mt-1">
          Our counsellor Priya will reach out within 24 hours. Check your email for a welcome message.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-brand-light border-2 border-brand rounded-xl p-6 sm:p-8 my-8" style={{borderColor: '#3AAFE5', background: '#EBF7FD'}}>
      <h3 className="font-bold text-xl mb-1" style={{color: '#3AAFE5'}}>🎓 Ready to Study Abroad?</h3>
      <p className="text-gray-600 text-sm mb-5">
        Get free personalised guidance — loans, scholarships, admissions. No fees, ever.
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Your Name *"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-brand"
          />
          <input
            type="tel"
            placeholder="WhatsApp Number *"
            required
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-brand"
          />
        </div>
        <input
          type="email"
          placeholder="Email Address *"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-brand"
        />

        {/* Invisible Cloudflare Turnstile captcha — no UI shown */}
        <TurnstileWidget
          onVerify={setCaptchaToken}
          onExpire={() => setCaptchaToken(null)}
        />

        <button
          type="submit"
          disabled={status === "loading" || !captchaToken}
          className="w-full bg-brand text-white font-semibold py-3 rounded-lg hover:bg-brand-dark transition-colors disabled:opacity-60"
        >
          {status === "loading" ? "Submitting…" : "Get Free Consultation →"}
        </button>
        {status === "error" && (
          <p className="text-red-600 text-xs text-center">{errorMsg || "Something went wrong. Please try again."}</p>
        )}
      </form>
    </div>
  );
}
