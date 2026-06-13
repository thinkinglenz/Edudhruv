"use client";
import { useState } from "react";
import Link from "next/link";

type Step = "country" | "degree" | "field" | "budget" | "tests" | "results" | "lead";

interface State {
  country?:  "USA" | "UK" | "Canada" | "Australia" | "Germany" | "Singapore" | "Open";
  degree?:   "Bachelors" | "Masters" | "MBA" | "PhD";
  field?:    "CS" | "Engineering" | "Business" | "Finance" | "Data Science" | "Health";
  budget?:   "low" | "mid" | "high";       // <50L | 50L-1Cr | >1Cr
  tests?:    "strong" | "average" | "none"; // GRE/GMAT taken or not
}

interface Match {
  uni:       string;
  uniSlug?:  string;
  country:   string;
  flag:      string;
  fitScore:  number;
  why:       string;
}

// Curated university recommendations
const ALL_MATCHES: Array<Match & { tags: string[] }> = [
  // USA
  { uni:"MIT",                                   uniSlug:"massachusetts-institute-of-technology", country:"USA",       flag:"🇺🇸", fitScore:0, why:"Top-ranked for CS + STEM research", tags:["USA","Masters","PhD","CS","Engineering","Data Science","strong","high"] },
  { uni:"Stanford University",                   uniSlug:"stanford-university",                   country:"USA",       flag:"🇺🇸", fitScore:0, why:"Silicon Valley access + GSB MBA", tags:["USA","Masters","MBA","PhD","CS","Business","Engineering","strong","high"] },
  { uni:"Harvard University",                    uniSlug:"harvard-university",                    country:"USA",       flag:"🇺🇸", fitScore:0, why:"HBS MBA + Kennedy School policy + global brand", tags:["USA","MBA","Masters","Business","Finance","strong","high"] },
  { uni:"Carnegie Mellon University",                                                             country:"USA",       flag:"🇺🇸", fitScore:0, why:"#1 for CS Masters + AI/ML research", tags:["USA","Masters","CS","Data Science","strong","high","mid"] },
  { uni:"UT Austin",                                                                              country:"USA",       flag:"🇺🇸", fitScore:0, why:"Strong CS at state-uni price = best ROI", tags:["USA","Masters","CS","Engineering","average","mid"] },
  { uni:"USC",                                                                                    country:"USA",       flag:"🇺🇸", fitScore:0, why:"LA-based + flexible admissions for Indians", tags:["USA","Masters","CS","Business","Data Science","average","high","mid"] },
  // UK
  { uni:"University of Oxford",                  uniSlug:"university-of-oxford",                  country:"UK",        flag:"🇬🇧", fitScore:0, why:"1-year Masters + Said MBA + Rhodes Scholarship", tags:["UK","Masters","MBA","PhD","Business","Finance","CS","strong","high"] },
  { uni:"University of Cambridge",               uniSlug:"university-of-cambridge",               country:"UK",        flag:"🇬🇧", fitScore:0, why:"STEM stronghold + Gates Cambridge funding", tags:["UK","Masters","PhD","CS","Engineering","Data Science","strong","high"] },
  { uni:"Imperial College London",                                                                country:"UK",        flag:"🇬🇧", fitScore:0, why:"#6 globally for CS + London tech ecosystem", tags:["UK","Masters","CS","Engineering","Data Science","strong","high","mid"] },
  { uni:"London Business School (LBS)",                                                           country:"UK",        flag:"🇬🇧", fitScore:0, why:"Top 5 MBA globally + London finance jobs", tags:["UK","MBA","Business","Finance","strong","high"] },
  { uni:"University of Manchester",                                                               country:"UK",        flag:"🇬🇧", fitScore:0, why:"Russell Group + cheaper than London + strong placements", tags:["UK","Masters","Business","CS","Engineering","average","mid"] },
  // Canada
  { uni:"University of Toronto",                                                                  country:"Canada",    flag:"🇨🇦", fitScore:0, why:"#21 QS + Toronto AI ecosystem + clear PR pathway", tags:["Canada","Masters","CS","Engineering","Data Science","Business","strong","average","mid"] },
  { uni:"UBC",                                                                                    country:"Canada",    flag:"🇨🇦", fitScore:0, why:"Vancouver + west-coast tech + PR friendly", tags:["Canada","Masters","CS","Engineering","Business","average","mid"] },
  { uni:"University of Waterloo",                                                                 country:"Canada",    flag:"🇨🇦", fitScore:0, why:"Co-op program + Google/BlackBerry pipeline", tags:["Canada","Masters","CS","Engineering","average","strong","mid"] },
  { uni:"Seneca College",                                                                         country:"Canada",    flag:"🇨🇦", fitScore:0, why:"PG Diploma + 3-yr PGWP at lowest cost", tags:["Canada","Bachelors","Masters","CS","Business","average","none","low"] },
  // Australia
  { uni:"University of Melbourne",                                                                country:"Australia", flag:"🇦🇺", fitScore:0, why:"#13 QS + voted most liveable city", tags:["Australia","Masters","CS","Engineering","Business","strong","average","high","mid"] },
  { uni:"UNSW (Sydney)",                                                                          country:"Australia", flag:"🇦🇺", fitScore:0, why:"Strong tech + Sydney jobs + biggest Indian student base", tags:["Australia","Masters","CS","Engineering","Business","strong","average","mid","high"] },
  { uni:"Monash University",                                                                      country:"Australia", flag:"🇦🇺", fitScore:0, why:"Lower fees than Group of 8 + strong IT programs", tags:["Australia","Masters","CS","Engineering","average","mid"] },
  // Germany
  { uni:"TU Munich (TUM)",                                                                        country:"Germany",   flag:"🇩🇪", fitScore:0, why:"Top engineering globally + FREE tuition", tags:["Germany","Masters","PhD","Engineering","CS","Data Science","strong","average","low"] },
  { uni:"RWTH Aachen",                                                                            country:"Germany",   flag:"🇩🇪", fitScore:0, why:"Industry partnerships + close to auto OEMs", tags:["Germany","Masters","Engineering","CS","strong","average","low"] },
  { uni:"KIT (Karlsruhe)",                                                                        country:"Germany",   flag:"🇩🇪", fitScore:0, why:"Top CS + Engineering at €1500/sem", tags:["Germany","Masters","Engineering","CS","Data Science","strong","average","low"] },
  // Singapore
  { uni:"National University of Singapore (NUS)",                                                  country:"Singapore", flag:"🇸🇬", fitScore:0, why:"#8 QS + close to India + APAC tech jobs", tags:["Singapore","Masters","MBA","CS","Business","Engineering","strong","high","mid"] },
  { uni:"NTU (Nanyang)",                                                                          country:"Singapore", flag:"🇸🇬", fitScore:0, why:"Cheaper than NUS + strong tech + Tuition Grant", tags:["Singapore","Masters","CS","Engineering","Business","strong","average","mid"] },
];

function score(state: State, tags: string[]): number {
  let s = 0;
  if (state.country && state.country !== "Open" && tags.includes(state.country)) s += 30;
  if (state.degree && tags.includes(state.degree)) s += 20;
  if (state.field && tags.includes(state.field)) s += 20;
  if (state.budget && tags.includes(state.budget)) s += 15;
  if (state.tests && tags.includes(state.tests)) s += 15;
  return s;
}

const QUESTIONS: Array<{
  step: Step; q: string; key: keyof State;
  options: { value: string; label: string; emoji: string }[];
}> = [
  { step:"country", q:"Where do you want to study?", key:"country", options:[
    { value:"USA",       label:"USA",       emoji:"🇺🇸" },
    { value:"UK",        label:"UK",        emoji:"🇬🇧" },
    { value:"Canada",    label:"Canada",    emoji:"🇨🇦" },
    { value:"Australia", label:"Australia", emoji:"🇦🇺" },
    { value:"Germany",   label:"Germany",   emoji:"🇩🇪" },
    { value:"Singapore", label:"Singapore", emoji:"🇸🇬" },
    { value:"Open",      label:"Open to any",emoji:"🌍" },
  ]},
  { step:"degree", q:"What degree are you pursuing?", key:"degree", options:[
    { value:"Bachelors", label:"Bachelor's",  emoji:"🎓" },
    { value:"Masters",   label:"Master's",    emoji:"📚" },
    { value:"MBA",       label:"MBA",         emoji:"💼" },
    { value:"PhD",       label:"PhD",         emoji:"🔬" },
  ]},
  { step:"field", q:"What field?", key:"field", options:[
    { value:"CS",            label:"Computer Science", emoji:"💻" },
    { value:"Data Science",  label:"Data Science",      emoji:"📊" },
    { value:"Engineering",   label:"Engineering (Mech/Elec/Civil)", emoji:"⚙️" },
    { value:"Business",      label:"Business / MBA",     emoji:"💼" },
    { value:"Finance",       label:"Finance",            emoji:"💰" },
    { value:"Health",        label:"Health / Medicine",  emoji:"🏥" },
  ]},
  { step:"budget", q:"What's your budget?", key:"budget", options:[
    { value:"low",  label:"Under ₹50 Lakh total",  emoji:"💵" },
    { value:"mid",  label:"₹50 L – ₹1 Cr total",   emoji:"💰" },
    { value:"high", label:"Over ₹1 Cr — flexible", emoji:"🏦" },
  ]},
  { step:"tests", q:"Your GRE/GMAT/IELTS prep status?", key:"tests", options:[
    { value:"strong",  label:"Strong scores ready (GRE 325+ / GMAT 720+)", emoji:"🏆" },
    { value:"average", label:"Decent scores or in progress",                 emoji:"👍" },
    { value:"none",    label:"No tests taken yet — minimum requirements only", emoji:"😅" },
  ]},
];

export default function ShortlistQuiz() {
  const [state, setState] = useState<State>({});
  const [step, setStep]   = useState<Step>("country");
  const [name, setName]   = useState("");
  const [email, setEmail] = useState("");
  const [savedStatus, setSavedStatus] = useState<"idle" | "saving" | "ok" | "err">("idle");

  const currentIdx = QUESTIONS.findIndex(q => q.step === step);
  const current = QUESTIONS[currentIdx];

  function pick(value: string) {
    if (!current) return;
    const newState = { ...state, [current.key]: value };
    setState(newState);
    if (currentIdx === QUESTIONS.length - 1) {
      setStep("results");
    } else {
      setStep(QUESTIONS[currentIdx + 1].step);
    }
  }

  function reset() {
    setState({}); setStep("country");
  }

  const matches = ALL_MATCHES
    .map(m => ({ ...m, fitScore: score(state, m.tags) }))
    .sort((a, b) => b.fitScore - a.fitScore)
    .slice(0, 5);

  async function saveResults(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !name.trim()) return;
    setSavedStatus("saving");
    try {
      const r = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email, name,
          source_slug: "shortlist-quiz",
          source_url: typeof window !== "undefined" ? window.location.href : undefined,
        }),
      });
      setSavedStatus(r.ok ? "ok" : "err");
    } catch { setSavedStatus("err"); }
  }

  // ─── RESULTS view ──────────────────────────────────────────────────
  if (step === "results") {
    return (
      <div className="space-y-5">
        <div className="bg-white rounded-2xl border-2 p-6 sm:p-8" style={{ borderColor: "#10B981" }}>
          <div className="flex items-center gap-3 mb-5">
            <span className="text-3xl">🎯</span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#10B981" }}>Top 5 matches</p>
              <h2 className="text-2xl font-extrabold text-gray-900">Universities that fit your profile</h2>
            </div>
          </div>

          <div className="space-y-3 mb-5">
            {matches.map((m, i) => {
              const inner = (
                <div className="flex items-start gap-3 p-4 rounded-xl border border-gray-200 hover:border-brand hover:bg-gray-50 transition-all">
                  <span className="w-10 h-10 rounded-lg text-white text-sm font-extrabold flex items-center justify-center flex-shrink-0"
                        style={{ background: m.fitScore >= 70 ? "#10B981" : m.fitScore >= 50 ? "#3AAFE5" : "#F5A71A" }}>
                    #{i+1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span>{m.flag}</span>
                      <p className="font-bold text-gray-900">{m.uni}</p>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                        {m.fitScore}% fit
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{m.why}</p>
                  </div>
                  {m.uniSlug && (
                    <span className="text-brand font-semibold text-sm self-center" style={{ color: "#3AAFE5" }}>
                      View →
                    </span>
                  )}
                </div>
              );
              return m.uniSlug ? (
                <Link key={m.uni} href={`/university/${m.uniSlug}`}>{inner}</Link>
              ) : (
                <div key={m.uni}>{inner}</div>
              );
            })}
          </div>

          {/* Email lead capture */}
          {savedStatus !== "ok" ? (
            <form onSubmit={saveResults} className="bg-blue-50 border border-blue-200 rounded-xl p-5">
              <p className="font-bold text-gray-900 mb-1">📧 Email me my shortlist</p>
              <p className="text-xs text-gray-600 mb-3">
                We'll send your full results + custom application timeline + relevant scholarships to your email.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <input type="text" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} required
                       className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required
                       className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                <button type="submit" disabled={savedStatus === "saving"}
                        className="text-white font-bold px-5 py-2 rounded-lg text-sm whitespace-nowrap"
                        style={{ background: "#3AAFE5" }}>
                  {savedStatus === "saving" ? "Sending…" : "Email shortlist"}
                </button>
              </div>
              {savedStatus === "err" && (
                <p className="text-xs text-red-600 mt-2">Something went wrong. Try again or email edudruv@gmail.com.</p>
              )}
            </form>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
              <p className="text-3xl mb-1">✅</p>
              <p className="font-bold text-green-800">Done!</p>
              <p className="text-sm text-green-700">Check your email — we'll send a follow-up with your full shortlist.</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2 mt-5">
            <Link href="/loan-portal"
                  className="flex-1 inline-flex items-center justify-center text-white font-bold px-5 py-3 rounded-lg"
                  style={{ background: "#3AAFE5" }}>
              💬 Talk to Priya for personalised help
            </Link>
            <button onClick={reset}
                    className="inline-flex items-center justify-center text-sm font-semibold px-5 py-3 rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-50">
              ↻ Start over
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── QUESTION view ─────────────────────────────────────────────────
  if (!current) return null;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-yellow-50 rounded-2xl border-2 p-6 sm:p-8"
         style={{ borderColor: "#3AAFE5" }}>
      <div className="flex items-baseline justify-between mb-2 flex-wrap gap-2">
        <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "#3AAFE5" }}>
          🎯 Shortlist Quiz · Question {currentIdx + 1} of {QUESTIONS.length}
        </span>
        <div className="flex gap-1">
          {QUESTIONS.map((_, i) => (
            <div key={i} className={`w-6 h-1 rounded ${i <= currentIdx ? "" : "bg-gray-300"}`}
                 style={i <= currentIdx ? { background: "#3AAFE5" } : {}} />
          ))}
        </div>
      </div>
      <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-5">{current.q}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {current.options.map(opt => (
          <button key={opt.value} onClick={() => pick(opt.value)}
                  className="flex items-center gap-3 px-4 py-3.5 bg-white rounded-xl border-2 border-gray-200 hover:border-brand hover:bg-brand-light text-left transition-all">
            <span className="text-2xl">{opt.emoji}</span>
            <span className="font-semibold text-gray-900">{opt.label}</span>
          </button>
        ))}
      </div>

      {currentIdx > 0 && (
        <button onClick={() => setStep(QUESTIONS[currentIdx - 1].step)}
                className="mt-4 text-sm text-gray-500 hover:text-brand">
          ← Previous question
        </button>
      )}
    </div>
  );
}
