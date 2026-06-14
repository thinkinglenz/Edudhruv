"use client";
import { useState } from "react";

export default function StorySubmitForm() {
  const [form, setForm] = useState({
    name:"", email:"", city_india:"",
    university:"", country:"USA", program:"", degree:"Masters", intake_year:"2027",
    cgpa:"", gre_score:"", gmat_score:"", ielts_band:"", toefl_score:"", work_years:"",
    headline:"", body:"", advice:"",
    funding_source:"", scholarship_name:"",
    website:"",
  });
  const [status, setStatus] = useState<"idle"|"sending"|"ok"|"err">("idle");
  const [errMsg, setErrMsg] = useState("");

  function up(k: string, v: string) { setForm(f => ({ ...f, [k]: v })); }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending"); setErrMsg("");
    try {
      const r = await fetch("/api/admission-stories", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify(form),
      });
      const data = await r.json();
      if (!r.ok) { setStatus("err"); setErrMsg(data.error || "Submission failed"); }
      else setStatus("ok");
    } catch (e: any) { setStatus("err"); setErrMsg(e.message || "Network error"); }
  }

  if (status === "ok") {
    return (
      <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-8 text-center">
        <p className="text-5xl mb-3">🎉</p>
        <h3 className="text-2xl font-extrabold text-green-800 mb-2">Story received!</h3>
        <p className="text-green-700 max-w-md mx-auto">
          Thanks for sharing! Our team reviews submissions within 3-5 days. Once approved, your story
          will be live and we'll email you the link. Your story will inspire future Indian students.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-5 bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm">
      {/* Personal */}
      <Section title="About you">
        <Row>
          <Field label="Your name *" v={form.name} on={v => up("name", v)} required />
          <Field label="Email *" type="email" v={form.email} on={v => up("email", v)} required hint="We'll email you when story goes live" />
        </Row>
        <Field label="City in India" v={form.city_india} on={v => up("city_india", v)} placeholder="Mumbai / Delhi / Bangalore" />
      </Section>

      {/* Admission */}
      <Section title="Where did you get in?">
        <Row>
          <Field label="University *" v={form.university} on={v => up("university", v)} required placeholder="MIT / Stanford / Oxford" />
          <Select label="Country *" v={form.country} on={v => up("country", v)} options={["USA","UK","Canada","Australia","Germany","Singapore","Other"]} />
        </Row>
        <Row>
          <Field label="Program *" v={form.program} on={v => up("program", v)} required placeholder="MS Computer Science" />
          <Select label="Degree *" v={form.degree} on={v => up("degree", v)} options={["Bachelor's","Masters","MBA","PhD"]} />
        </Row>
        <Field label="Intake year *" type="number" v={form.intake_year} on={v => up("intake_year", v)} required />
      </Section>

      {/* Stats (optional) */}
      <Section title="Your stats (optional but helps inspire others)">
        <Row>
          <Field label="CGPA (/10)" type="number" v={form.cgpa} on={v => up("cgpa", v)} placeholder="8.5" />
          <Field label="Work exp (years)" type="number" v={form.work_years} on={v => up("work_years", v)} placeholder="2" />
        </Row>
        <Row>
          <Field label="GRE score" type="number" v={form.gre_score} on={v => up("gre_score", v)} placeholder="325" />
          <Field label="GMAT score" type="number" v={form.gmat_score} on={v => up("gmat_score", v)} placeholder="720" />
        </Row>
        <Row>
          <Field label="IELTS band" type="number" v={form.ielts_band} on={v => up("ielts_band", v)} placeholder="7.5" />
          <Field label="TOEFL score" type="number" v={form.toefl_score} on={v => up("toefl_score", v)} placeholder="105" />
        </Row>
      </Section>

      {/* Funding */}
      <Section title="How did you fund it?">
        <Select label="Primary funding source" v={form.funding_source} on={v => up("funding_source", v)}
                options={["", "Education loan", "Scholarship (100% funded)", "Scholarship (partial)", "Family savings", "Mixed"]} />
        <Field label="Scholarship name (if applicable)" v={form.scholarship_name} on={v => up("scholarship_name", v)} placeholder="Knight-Hennessy / Rhodes / Tata Fellowship" />
      </Section>

      {/* Story */}
      <Section title="Your story">
        <Field label="Headline (1 line)" v={form.headline} on={v => up("headline", v)} required
               placeholder="How I got into MIT with an 8.2 CGPA and a clear research focus" maxLength={300} />
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
            Your full story * <span className="text-gray-400 font-normal">({form.body.length}/200 min)</span>
          </label>
          <textarea required value={form.body} onChange={e => up("body", e.target.value)} rows={10}
                    placeholder="Share your journey — what motivated you, how you prepared, what was hard, what advice you'd give. Real stories help future students more than perfect ones. 200-3000 words ideal."
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand focus:bg-white" />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
            One piece of advice (optional)
          </label>
          <textarea value={form.advice} onChange={e => up("advice", e.target.value)} rows={3}
                    placeholder="If you could tell your younger self one thing, what would it be?"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand focus:bg-white" />
        </div>
      </Section>

      {/* Honeypot */}
      <div className="hidden" aria-hidden="true">
        <input type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={e => up("website", e.target.value)} />
      </div>

      {errMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          🚫 {errMsg}
        </div>
      )}

      <button type="submit" disabled={status === "sending"}
              className="w-full text-white font-bold px-8 py-3.5 rounded-lg transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ background: "#3AAFE5" }}>
        {status === "sending" ? "Submitting…" : "📝 Submit my story →"}
      </button>
      <p className="text-xs text-gray-500 text-center">
        Stories are moderated by our team within 3-5 days. We never share your email publicly.
      </p>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3 pb-2 border-b border-gray-100">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{children}</div>;
}

function Field({ label, v, on, type = "text", required = false, placeholder = "", hint = "", maxLength }: {
  label: string; v: string; on: (v: string) => void;
  type?: string; required?: boolean; placeholder?: string; hint?: string; maxLength?: number;
}) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">{label}</label>
      <input type={type} required={required} value={v} onChange={e => on(e.target.value)}
             placeholder={placeholder} maxLength={maxLength}
             className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand focus:bg-white" />
      {hint && <p className="text-[10px] text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

function Select({ label, v, on, options }: { label: string; v: string; on: (v: string) => void; options: string[] }) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">{label}</label>
      <select value={v} onChange={e => on(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand focus:bg-white">
        {options.map(o => <option key={o} value={o}>{o || "—"}</option>)}
      </select>
    </div>
  );
}
