"use client";
import { useState, useMemo } from "react";
import Link from "next/link";

// Approximate India → US 4.0 GPA mapping (WES-style band table). Universities
// use their own methods, so this is a guide, not an official conversion.
function pctToGpa(pct: number): number {
  if (pct >= 85) return 4.0;
  if (pct >= 80) return 3.7;
  if (pct >= 75) return 3.3;
  if (pct >= 70) return 3.0;
  if (pct >= 65) return 2.7;
  if (pct >= 60) return 2.3;
  if (pct >= 55) return 2.0;
  if (pct >= 50) return 1.7;
  if (pct >= 40) return 1.0;
  return 0.0;
}

function classification(pct: number): string {
  if (pct >= 60) return "First Class";
  if (pct >= 50) return "Second Class";
  if (pct >= 40) return "Pass Class";
  return "Below passing";
}

export default function GpaConverter() {
  const [mode, setMode] = useState<"pct" | "cgpa">("pct");
  const [value, setValue] = useState("78");

  const { pct, gpa, cls, valid } = useMemo(() => {
    const n = parseFloat(value);
    if (isNaN(n)) return { pct: 0, gpa: 0, cls: "", valid: false };
    // CGPA (10-point) → percentage using the common ×9.5 formula
    const pct = mode === "cgpa" ? Math.min(n * 9.5, 100) : n;
    if (pct < 0 || pct > 100) return { pct: 0, gpa: 0, cls: "", valid: false };
    return { pct: Math.round(pct * 10) / 10, gpa: pctToGpa(pct), cls: classification(pct), valid: true };
  }, [value, mode]);

  const inputCls = "w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-brand";

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-sm overflow-hidden">
        <header className="px-6 py-4 text-white" style={{ background: "linear-gradient(135deg, #3AAFE5 0%, #2E8AB8 100%)" }}>
          <h2 className="text-xl font-bold m-0">🎓 GPA / Percentage Converter</h2>
          <p className="text-sm text-white/90 m-0 mt-0.5">Indian marks → US 4.0 GPA (quick estimate)</p>
        </header>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex gap-2">
              <button onClick={() => { setMode("pct"); setValue("78"); }}
                      className={`flex-1 py-2 rounded-lg font-semibold text-sm ${mode === "pct" ? "text-white" : "text-gray-600 bg-gray-100"}`}
                      style={mode === "pct" ? { background: "#3AAFE5" } : {}}>
                Percentage (%)
              </button>
              <button onClick={() => { setMode("cgpa"); setValue("8.0"); }}
                      className={`flex-1 py-2 rounded-lg font-semibold text-sm ${mode === "cgpa" ? "text-white" : "text-gray-600 bg-gray-100"}`}
                      style={mode === "cgpa" ? { background: "#3AAFE5" } : {}}>
                CGPA (10-point)
              </button>
            </div>
            <label className="block">
              <span className="block text-sm font-semibold text-gray-700 mb-1">
                {mode === "pct" ? "Your percentage (0–100)" : "Your CGPA (0–10)"}
              </span>
              <input type="number" className={inputCls} value={value}
                     onChange={(e) => setValue(e.target.value)}
                     min={0} max={mode === "pct" ? 100 : 10} step={mode === "pct" ? 1 : 0.1} />
            </label>
            <p className="text-xs text-gray-500 italic">
              💡 10-point CGPA is converted to % using the common ×9.5 formula (CBSE / most Indian universities), then to US GPA.
            </p>
          </div>

          <div className="space-y-3">
            <div className="rounded-xl p-5 text-white" style={{ background: "linear-gradient(135deg, #10B981 0%, #059669 100%)" }}>
              <p className="text-xs uppercase tracking-wider opacity-90 mb-1">Estimated US GPA (4.0 scale)</p>
              <p className="text-5xl font-extrabold">{valid ? gpa.toFixed(1) : "—"}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg p-3 border border-gray-100">
                <p className="text-[10px] uppercase tracking-wider text-gray-500">Equivalent %</p>
                <p className="text-lg font-extrabold mt-0.5" style={{ color: "#3AAFE5" }}>{valid ? `${pct}%` : "—"}</p>
              </div>
              <div className="rounded-lg p-3 border border-gray-100">
                <p className="text-[10px] uppercase tracking-wider text-gray-500">Classification</p>
                <p className="text-lg font-extrabold mt-0.5" style={{ color: "#F5A71A" }}>{valid ? cls : "—"}</p>
              </div>
            </div>
            <div className="rounded-lg p-3 bg-blue-50 border border-blue-200 text-xs text-blue-900">
              <strong>Note:</strong> This is an estimate. Each university (and services like WES) use their own conversion — always check the official method for your target schools.
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl p-6 sm:p-8 text-white" style={{ background: "linear-gradient(135deg, #3AAFE5 0%, #F5A71A 100%)" }}>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-center">
          <div>
            <h3 className="text-xl sm:text-2xl font-extrabold mb-1">Planning your applications?</h3>
            <p className="text-white/90">Shortlist universities that match your profile and budget.</p>
          </div>
          <Link href="/tools/university-shortlist-quiz"
                className="inline-flex items-center gap-1 bg-white text-gray-900 font-bold px-5 py-3 rounded-xl whitespace-nowrap">
            Shortlist universities →
          </Link>
        </div>
      </div>
    </div>
  );
}
