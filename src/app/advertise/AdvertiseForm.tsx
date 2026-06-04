"use client";
import { useState } from "react";
import TurnstileWidget from "@/components/social/TurnstileWidget";

const INTERESTS = [
  "Sponsored Article",
  "Hero Banner",
  "Featured University",
  "Newsletter Sponsorship",
  "Custom Partnership",
  "Just exploring",
];

const BUDGETS = [
  "Under ₹25,000",
  "₹25,000 — ₹50,000",
  "₹50,000 — ₹1,00,000",
  "₹1,00,000+",
  "Need to discuss",
];

export default function AdvertiseForm() {
  const [form, setForm] = useState({
    name: "", company: "", role: "", email: "", phone: "",
    website: "", interest: "", budget: "", message: "",
  });
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!captchaToken) { setError("Please complete the security check"); return; }
    setStatus("loading"); setError("");
    try {
      const res = await fetch("/api/advertise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, captchaToken }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");
      setStatus("success");
    } catch (e: any) {
      setError(e?.message || "Something went wrong");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-white rounded-2xl p-8 text-center border-2"
           style={{ borderColor: "#3AAFE5" }}>
        <div className="text-5xl mb-3">🎉</div>
        <h3 className="font-extrabold text-2xl text-gray-900 mb-2">Thank you!</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          We've received your enquiry and will respond within 24 hours from{" "}
          <strong>edudruv@gmail.com</strong>. Keep an eye on your inbox (and spam folder).
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Your Name *">
          <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className={inputCls} placeholder="Priya Sharma" />
        </Field>
        <Field label="Company *">
          <input required value={form.company} onChange={e => setForm({...form, company: e.target.value})} className={inputCls} placeholder="ABC University" />
        </Field>
        <Field label="Your Role">
          <input value={form.role} onChange={e => setForm({...form, role: e.target.value})} className={inputCls} placeholder="Marketing Manager" />
        </Field>
        <Field label="Website">
          <input type="url" value={form.website} onChange={e => setForm({...form, website: e.target.value})} className={inputCls} placeholder="https://..." />
        </Field>
        <Field label="Email *">
          <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className={inputCls} placeholder="you@company.com" />
        </Field>
        <Field label="Phone / WhatsApp">
          <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className={inputCls} placeholder="+91 ..." />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Interested In *">
          <select required value={form.interest} onChange={e => setForm({...form, interest: e.target.value})} className={inputCls}>
            <option value="">Pick an option...</option>
            {INTERESTS.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
        </Field>
        <Field label="Budget Range *">
          <select required value={form.budget} onChange={e => setForm({...form, budget: e.target.value})} className={inputCls}>
            <option value="">Pick a range...</option>
            {BUDGETS.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </Field>
      </div>

      <Field label="Tell us about your goals *">
        <textarea required value={form.message} onChange={e => setForm({...form, message: e.target.value})}
                  rows={4} maxLength={2000}
                  className={inputCls + " resize-none"}
                  placeholder="What are you trying to achieve? Targeting which programmes / regions / audience?" />
      </Field>

      <div className="flex justify-center pt-1">
        <TurnstileWidget onVerify={setCaptchaToken} onExpire={() => setCaptchaToken(null)} />
      </div>

      <button
        type="submit"
        disabled={status === "loading" || !captchaToken}
        className="w-full py-3 rounded-xl text-white font-bold transition-opacity disabled:opacity-60 shadow-md hover:opacity-95"
        style={{ background: "#3AAFE5" }}
      >
        {status === "loading" ? "Sending…" : "Send Enquiry →"}
      </button>

      {error && (
        <p className="text-red-600 text-sm text-center bg-red-50 border border-red-200 rounded-lg px-4 py-2">
          {error}
        </p>
      )}

      <p className="text-center text-xs text-gray-400">
        We respond within 24 hours · Your data stays private · No spam
      </p>
    </form>
  );
}

const inputCls = "w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-brand";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">{label}</label>
      {children}
    </div>
  );
}
