"use client";
import { useState } from "react";

interface Props {
  sourceSlug?: string;
}

export default function LeadForm({ sourceSlug }: Props) {
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source_post_slug: sourceSlug }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
    } catch {
      setStatus("error");
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
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full bg-brand text-white font-semibold py-3 rounded-lg hover:bg-brand-dark transition-colors disabled:opacity-60"
        >
          {status === "loading" ? "Submitting…" : "Get Free Consultation →"}
        </button>
        {status === "error" && (
          <p className="text-red-600 text-xs text-center">Something went wrong. Please try again.</p>
        )}
      </form>
    </div>
  );
}
