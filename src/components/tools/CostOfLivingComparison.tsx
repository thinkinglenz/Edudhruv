"use client";
import { useState } from "react";

// Approximate MONTHLY student living costs in INR (mid-range, varies by city).
// Guidance only — always check current, city-specific figures.
type Cost = { flag: string; rent: number; food: number; transport: number; other: number };
const DATA: Record<string, Cost> = {
  "UK":        { flag: "🇬🇧", rent: 55000, food: 22000, transport: 8000, other: 20000 },
  "USA":       { flag: "🇺🇸", rent: 60000, food: 25000, transport: 7000, other: 23000 },
  "Canada":    { flag: "🇨🇦", rent: 45000, food: 20000, transport: 6000, other: 14000 },
  "Australia": { flag: "🇦🇺", rent: 50000, food: 22000, transport: 7000, other: 16000 },
  "Germany":   { flag: "🇩🇪", rent: 38000, food: 18000, transport: 5000, other: 14000 },
  "Ireland":   { flag: "🇮🇪", rent: 55000, food: 20000, transport: 6000, other: 17000 },
};
const ROWS: { key: keyof Cost; label: string }[] = [
  { key: "rent", label: "🏠 Rent (shared)" },
  { key: "food", label: "🍽️ Food & groceries" },
  { key: "transport", label: "🚌 Transport" },
  { key: "other", label: "📱 Utilities, phone, misc" },
];
const fmt = (n: number) => "₹" + new Intl.NumberFormat("en-IN").format(n);

export default function CostOfLivingComparison() {
  const [sel, setSel] = useState<string[]>(["UK", "Canada", "Germany"]);
  const toggle = (c: string) =>
    setSel((s) => (s.includes(c) ? s.filter((x) => x !== c) : s.length < 4 ? [...s, c] : s));

  const cols = sel.filter((c) => DATA[c]);

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border-2 border-gray-100 p-5">
        <p className="text-sm font-semibold text-gray-700 mb-3">Pick up to 4 countries to compare monthly living costs:</p>
        <div className="flex flex-wrap gap-2">
          {Object.keys(DATA).map((c) => (
            <button key={c} onClick={() => toggle(c)}
                    className={`px-3 py-2 rounded-lg text-sm font-semibold border-2 ${sel.includes(c) ? "text-white border-transparent" : "text-gray-600 border-gray-200"}`}
                    style={sel.includes(c) ? { background: "#3AAFE5" } : {}}>
              {DATA[c].flag} {c}
            </button>
          ))}
        </div>
      </div>

      {cols.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-x-auto">
          <table className="w-full text-sm min-w-[420px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-gray-500 font-bold">Monthly cost</th>
                {cols.map((c) => <th key={c} className="px-4 py-3 text-right text-xs font-bold text-gray-900">{DATA[c].flag} {c}</th>)}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.key} className="border-t border-gray-100">
                  <td className="px-4 py-3 text-gray-700">{r.label}</td>
                  {cols.map((c) => <td key={c} className="px-4 py-3 text-right text-gray-800">{fmt(DATA[c][r.key] as number)}</td>)}
                </tr>
              ))}
              <tr className="border-t-2 border-gray-200 bg-blue-50/40">
                <td className="px-4 py-3 font-extrabold text-gray-900">Total / month</td>
                {cols.map((c) => {
                  const t = ROWS.reduce((s, r) => s + (DATA[c][r.key] as number), 0);
                  return <td key={c} className="px-4 py-3 text-right font-extrabold" style={{ color: "#3AAFE5" }}>{fmt(t)}</td>;
                })}
              </tr>
              <tr className="border-t border-gray-100">
                <td className="px-4 py-3 text-gray-500 text-xs">≈ per year (×12)</td>
                {cols.map((c) => {
                  const t = ROWS.reduce((s, r) => s + (DATA[c][r.key] as number), 0) * 12;
                  return <td key={c} className="px-4 py-3 text-right text-gray-600 text-xs">{fmt(t)}</td>;
                })}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs text-gray-400">
        Figures are approximate mid-range student budgets and vary a lot by city (London vs a small UK town, etc.).
        Tuition is <strong>not</strong> included — use these for living-cost planning only.
      </p>
    </div>
  );
}
