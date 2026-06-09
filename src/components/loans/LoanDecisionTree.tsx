"use client";
import { useState } from "react";
import Link from "next/link";
import { LENDERS, type Lender } from "@/lib/lenders";

type Country = "usa" | "uk" | "canada" | "aus" | "other";
type LoanAmount = "low" | "mid" | "high";        // <30L | 30-75L | 75L+
type Collateral = "yes" | "no" | "unsure";
type Speed       = "fast" | "normal";             // need money in <2 weeks

interface State {
  country?:    Country;
  amount?:     LoanAmount;
  collateral?: Collateral;
  speed?:      Speed;
}

function recommend(state: State): Lender[] {
  const all = [...LENDERS];

  // No collateral + going to top US/UK/CA university → Prodigy + MPOWER
  if (state.collateral === "no" && (state.country === "usa" || state.country === "uk" || state.country === "canada")) {
    return all.filter(l => l.collateral === "not-required").slice(0, 2);
  }

  // No collateral, anywhere → NBFCs that go "optional"
  if (state.collateral === "no") {
    return all
      .filter(l => l.collateral !== "required")
      .sort((a, b) => a.interestRateMin - b.interestRateMin)
      .slice(0, 3);
  }

  // Has collateral + low amount → SBI (cheapest)
  if (state.collateral === "yes" && state.amount === "low") {
    return all.filter(l => l.id === "sbi" || l.id === "icici").slice(0, 2);
  }

  // Has collateral + high amount → HDFC + SBI
  if (state.collateral === "yes" && state.amount === "high") {
    return all.filter(l => l.id === "sbi" || l.id === "hdfc-credila" || l.id === "icici").slice(0, 3);
  }

  // Needs fast money
  if (state.speed === "fast") {
    return all.filter(l => parseInt(l.approvalDays) <= 7).slice(0, 3);
  }

  // Fallback: top 3 by interest rate
  return all.sort((a, b) => a.interestRateMin - b.interestRateMin).slice(0, 3);
}

const QUESTIONS = [
  {
    id: "country" as const,
    label: "Where are you planning to study?",
    options: [
      { value: "usa",    label: "USA",       emoji: "🇺🇸" },
      { value: "uk",     label: "UK",        emoji: "🇬🇧" },
      { value: "canada", label: "Canada",    emoji: "🇨🇦" },
      { value: "aus",    label: "Australia", emoji: "🇦🇺" },
      { value: "other",  label: "Other",     emoji: "🌍" },
    ],
  },
  {
    id: "amount" as const,
    label: "How much loan do you need?",
    options: [
      { value: "low",  label: "Under ₹30 Lakh",   emoji: "💵" },
      { value: "mid",  label: "₹30 L – ₹75 L",    emoji: "💰" },
      { value: "high", label: "Over ₹75 Lakh",    emoji: "🏦" },
    ],
  },
  {
    id: "collateral" as const,
    label: "Can your family pledge collateral (house, FD)?",
    options: [
      { value: "yes",    label: "Yes, we have collateral",  emoji: "✓" },
      { value: "no",     label: "No collateral available",  emoji: "✗" },
      { value: "unsure", label: "Not sure yet",             emoji: "?" },
    ],
  },
  {
    id: "speed" as const,
    label: "How soon do you need the money?",
    options: [
      { value: "fast",   label: "Within 2 weeks",        emoji: "⚡" },
      { value: "normal", label: "I have 4+ weeks",       emoji: "🕐" },
    ],
  },
];

export default function LoanDecisionTree() {
  const [state, setState]   = useState<State>({});
  const [step, setStep]     = useState(0);
  const [showResults, setShowResults] = useState(false);

  const current = QUESTIONS[step];
  const isLast  = step === QUESTIONS.length - 1;

  function pick(value: string) {
    const newState = { ...state, [current.id]: value };
    setState(newState);
    if (isLast) setShowResults(true);
    else setStep(step + 1);
  }

  function reset() {
    setState({});
    setStep(0);
    setShowResults(false);
  }

  if (showResults) {
    const recs = recommend(state);
    return (
      <div className="bg-white rounded-2xl border-2 p-6 sm:p-8" style={{ borderColor: "#10B981" }}>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">🎯</span>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#10B981" }}>Your match</p>
            <h3 className="text-xl font-extrabold text-gray-900">Recommended lenders for your situation:</h3>
          </div>
        </div>

        <div className="space-y-3 mb-5">
          {recs.map((l, i) => (
            <a
              key={l.id}
              href={`#${l.slug}`}
              className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-brand hover:bg-gray-50 transition-all"
            >
              <span className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ background: l.logoColor }}>
                #{i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900">{l.name}</p>
                <p className="text-xs text-gray-500">{l.bestFor}</p>
              </div>
              <span className="text-sm font-semibold text-brand" style={{ color: "#3AAFE5" }}>
                See details →
              </span>
            </a>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Link
            href="/loan-portal"
            className="flex-1 inline-flex items-center justify-center text-white font-bold px-5 py-3 rounded-lg"
            style={{ background: "#3AAFE5" }}
          >
            💬 Talk to Priya for personalised help →
          </Link>
          <button
            onClick={reset}
            className="inline-flex items-center justify-center text-sm font-semibold px-5 py-3 rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            ↻ Start over
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-yellow-50 rounded-2xl border-2 p-6 sm:p-8 mb-10"
         style={{ borderColor: "#3AAFE5" }}>
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "#3AAFE5" }}>
          🤔 Decision Helper · Step {step + 1} of {QUESTIONS.length}
        </span>
        <div className="flex gap-1">
          {QUESTIONS.map((_, i) => (
            <div key={i}
                 className={`w-6 h-1 rounded ${i <= step ? "" : "bg-gray-300"}`}
                 style={i <= step ? { background: "#3AAFE5" } : {}} />
          ))}
        </div>
      </div>
      <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-5">{current.label}</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {current.options.map(opt => (
          <button
            key={opt.value}
            onClick={() => pick(opt.value)}
            className="flex items-center gap-3 px-4 py-3.5 bg-white rounded-xl border-2 border-gray-200 hover:border-brand hover:bg-brand-light text-left transition-all"
          >
            <span className="text-2xl">{opt.emoji}</span>
            <span className="font-semibold text-gray-900">{opt.label}</span>
          </button>
        ))}
      </div>

      {step > 0 && (
        <button onClick={() => setStep(step - 1)} className="mt-4 text-sm text-gray-500 hover:text-brand">
          ← Previous question
        </button>
      )}
    </div>
  );
}
