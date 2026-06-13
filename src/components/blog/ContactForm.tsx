"use client";
import { useState } from "react";

const SUBJECTS = [
  { id: "general",       label: "General enquiry" },
  { id: "advertise",     label: "Advertising / partnership" },
  { id: "scholarship",   label: "Scholarship question" },
  { id: "loan",          label: "Education loan question" },
  { id: "university",    label: "University admission help" },
  { id: "feedback",      label: "Feedback / content correction" },
  { id: "press",         label: "Press / media enquiry" },
];

export default function ContactForm() {
  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [subject, setSubject] = useState("General enquiry");
  const [type, setType]       = useState("general");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");   // honeypot — bots will fill, humans won't see
  const [status, setStatus]   = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [errMsg, setErrMsg]   = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending"); setErrMsg("");
    try {
      const r = await fetch("/api/contact", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ name, email, subject, type, message, website }),
      });
      const data = await r.json();
      if (!r.ok) {
        setStatus("err");
        setErrMsg(data.error || "Could not send. Please email edudruv@gmail.com instead.");
      } else {
        setStatus("ok");
        setName(""); setEmail(""); setMessage(""); setSubject("General enquiry"); setType("general");
      }
    } catch {
      setStatus("err");
      setErrMsg("Network error — please email edudruv@gmail.com instead.");
    }
  }

  if (status === "ok") {
    return (
      <div className="rounded-2xl p-8 text-center border-2"
           style={{ background: "#ECFDF5", borderColor: "#10B981" }}>
        <p className="text-5xl mb-3">✉️✨</p>
        <h3 className="text-2xl font-extrabold text-green-800 mb-2">Message sent!</h3>
        <p className="text-green-700 text-sm max-w-md mx-auto">
          We've received your message and aim to reply within 48 hours.
          Check your inbox (and spam folder) at the email you provided.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-5 text-sm font-semibold text-green-800 underline hover:text-green-900"
        >
          Send another message →
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4 bg-white rounded-2xl border-2 border-gray-100 p-6 sm:p-8 shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
            Your name *
          </label>
          <input
            id="name" type="text" required
            value={name} onChange={e => setName(e.target.value)}
            placeholder="Jacob Mathew"
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand focus:bg-white transition-colors"
            style={{ outlineColor: "#3AAFE5" }}
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
            Email *
          </label>
          <input
            id="email" type="email" required
            value={email} onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand focus:bg-white transition-colors"
          />
        </div>
      </div>

      <div>
        <label htmlFor="type" className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
          What's this about? *
        </label>
        <select
          id="type" value={type}
          onChange={e => {
            setType(e.target.value);
            const selected = SUBJECTS.find(s => s.id === e.target.value);
            if (selected) setSubject(selected.label);
          }}
          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand focus:bg-white transition-colors"
        >
          {SUBJECTS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
      </div>

      <div>
        <label htmlFor="subject" className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
          Subject
        </label>
        <input
          id="subject" type="text"
          value={subject} onChange={e => setSubject(e.target.value)}
          placeholder="Brief summary of your message"
          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand focus:bg-white transition-colors"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
          Message *
        </label>
        <textarea
          id="message" required rows={6}
          value={message} onChange={e => setMessage(e.target.value)}
          placeholder="Tell us in detail — the more context you give, the better we can help."
          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand focus:bg-white transition-colors resize-vertical"
        />
        <p className="text-[11px] text-gray-400 mt-1">{message.length} / 5000 characters</p>
      </div>

      {/* Honeypot — hidden from humans, bots fill it */}
      <div className="hidden" aria-hidden="true">
        <label>
          Website (leave blank)
          <input
            type="text" tabIndex={-1} autoComplete="off"
            value={website} onChange={e => setWebsite(e.target.value)}
          />
        </label>
      </div>

      {errMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          🚫 {errMsg}
        </div>
      )}

      <button
        type="submit" disabled={status === "sending"}
        className="w-full sm:w-auto text-white font-bold px-8 py-3 rounded-lg transition-opacity hover:opacity-90 disabled:opacity-50"
        style={{ background: "#3AAFE5" }}
      >
        {status === "sending" ? "Sending…" : "Send message →"}
      </button>

      <p className="text-[11px] text-gray-400">
        We aim to respond within 48 hours. Your email is used only to reply to you and is never shared.
      </p>
    </form>
  );
}
