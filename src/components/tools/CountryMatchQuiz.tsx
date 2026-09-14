"use client";
import { useState } from "react";
import Link from "next/link";

type Country = { key: string; name: string; flag: string; why: string; href: string };

const COUNTRIES: Record<string, Country> = {
  uk:      { key: "uk", name: "United Kingdom", flag: "🇬🇧", why: "Top-ranked unis, 1-year master's, 2-year Graduate Route work visa", href: "/study-in/uk" },
  usa:     { key: "usa", name: "United States", flag: "🇺🇸", why: "Highest-ranked universities, strong STEM + OPT work options", href: "/study-in/usa" },
  canada:  { key: "canada", name: "Canada", flag: "🇨🇦", why: "Affordable, easy-ish visa, up to 3-year post-study work permit", href: "/study-in/canada" },
  australia:{ key: "australia", name: "Australia", flag: "🇦🇺", why: "Strong work rights, good weather, clear PR pathways", href: "/study-in/australia" },
  germany: { key: "germany", name: "Germany", flag: "🇩🇪", why: "Low/no tuition at public unis, strong for STEM, low cost", href: "/study-in/germany" },
  ireland: { key: "ireland", name: "Ireland", flag: "🇮🇪", why: "English-speaking, fast visa, 2-year stay-back, tech hub", href: "/study-in/ireland" },
};

type Q = { q: string; opts: { label: string; add: Record<string, number> }[] };
const QUESTIONS: Q[] = [
  { q: "What's your total budget (tuition + living, per year)?", opts: [
    { label: "Tight — under ₹15 lakh", add: { germany: 3, ireland: 1, canada: 1 } },
    { label: "Moderate — ₹15–30 lakh", add: { canada: 2, australia: 2, ireland: 2, uk: 1 } },
    { label: "Flexible — ₹30 lakh+", add: { usa: 3, uk: 2, australia: 1 } },
  ]},
  { q: "What matters most to you?", opts: [
    { label: "Work opportunities after graduation", add: { canada: 3, australia: 2, uk: 2, germany: 1 } },
    { label: "Top university rankings", add: { usa: 3, uk: 2 } },
    { label: "Lowest overall cost", add: { germany: 3, ireland: 1 } },
    { label: "Easy, fast visa process", add: { canada: 2, australia: 2, ireland: 2 } },
  ]},
  { q: "Your field of study?", opts: [
    { label: "STEM / Engineering / IT", add: { usa: 2, germany: 2, canada: 1, ireland: 1 } },
    { label: "Business / Management", add: { uk: 2, usa: 1, australia: 1 } },
    { label: "Arts / Humanities / Social Sciences", add: { uk: 2, canada: 1 } },
    { label: "Not sure yet", add: { canada: 1, uk: 1, australia: 1 } },
  ]},
];

export default function CountryMatchQuiz() {
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});

  const choose = (add: Record<string, number>) => {
    const next = { ...scores };
    for (const [k, v] of Object.entries(add)) next[k] = (next[k] || 0) + v;
    setScores(next);
    setStep(step + 1);
  };

  const reset = () => { setStep(0); setScores({}); };

  if (step < QUESTIONS.length) {
    const Q = QUESTIONS[step];
    return (
      <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-sm overflow-hidden">
        <header className="px-6 py-4 text-white" style={{ background: "linear-gradient(135deg, #3AAFE5 0%, #2E8AB8 100%)" }}>
          <p className="text-sm text-white/90 m-0">Question {step + 1} of {QUESTIONS.length}</p>
          <h2 className="text-xl font-bold m-0 mt-0.5">{Q.q}</h2>
        </header>
        <div className="p-6 space-y-3">
          {Q.opts.map((o) => (
            <button key={o.label} onClick={() => choose(o.add)}
                    className="w-full text-left rounded-xl border-2 border-gray-200 p-4 hover:border-brand hover:bg-blue-50/40 transition font-semibold text-gray-800">
              {o.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const ranked = Object.keys(COUNTRIES)
    .map((k) => ({ ...COUNTRIES[k], score: scores[k] || 0 }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl p-6 text-white text-center" style={{ background: "linear-gradient(135deg, #10B981 0%, #059669 100%)" }}>
        <p className="text-sm uppercase tracking-wider opacity-90">Your top study destinations</p>
        <p className="text-lg mt-1">Based on your budget, priorities and field 👇</p>
      </div>
      {ranked.map((c, i) => (
        <div key={c.key} className="bg-white rounded-2xl border-2 border-gray-100 p-5 flex items-start gap-4">
          <div className="text-4xl">{c.flag}</div>
          <div className="flex-1">
            <p className="font-extrabold text-gray-900 text-lg">{i === 0 ? "⭐ " : `${i + 1}. `}{c.name}</p>
            <p className="text-sm text-gray-600 mt-1">{c.why}</p>
            <Link href={c.href} className="inline-block mt-2 text-sm font-bold" style={{ color: "#3AAFE5" }}>
              Explore studying in {c.name} →
            </Link>
          </div>
        </div>
      ))}
      <p className="text-xs text-gray-400 text-center">
        This is guidance to help you shortlist — not a ranking. Your final choice depends on specific
        universities, courses and personal circumstances.
      </p>
      <button onClick={reset} className="mx-auto block text-sm font-semibold px-5 py-2 rounded-lg border-2"
              style={{ borderColor: "#3AAFE5", color: "#3AAFE5" }}>
        ↺ Retake the quiz
      </button>
    </div>
  );
}
