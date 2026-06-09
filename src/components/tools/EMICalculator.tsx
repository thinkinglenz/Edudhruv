"use client";
import { useState, useMemo } from "react";
import Link from "next/link";

export default function EMICalculator() {
  // Inputs (with sensible defaults)
  const [amount, setAmount] = useState(2500000);    // ₹25 L
  const [rate, setRate]     = useState(11.5);        // 11.5%
  const [years, setYears]   = useState(7);

  const { emi, totalInterest, totalPayable } = useMemo(() => {
    if (amount <= 0 || rate <= 0 || years <= 0) return { emi: 0, totalInterest: 0, totalPayable: 0 };
    const r = rate / 12 / 100;
    const n = years * 12;
    const emi = (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayable  = emi * n;
    const totalInterest = totalPayable - amount;
    return { emi, totalInterest, totalPayable };
  }, [amount, rate, years]);

  // Comparison: what does EMI look like at different rates?
  const comparisons = useMemo(() => {
    return [8.5, 10, 11.5, 13, 14.5].map(r => {
      const monthly = r / 12 / 100;
      const n = years * 12;
      const e = (amount * monthly * Math.pow(1 + monthly, n)) / (Math.pow(1 + monthly, n) - 1);
      return { rate: r, emi: Math.round(e), total: Math.round(e * n) };
    });
  }, [amount, years]);

  const fmt = (n: number) => new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Math.round(n));
  const fmtL = (n: number) => `₹${(n / 100000).toFixed(1)} L`;

  return (
    <div className="space-y-6">
      {/* Calculator card */}
      <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-sm overflow-hidden">
        <header className="px-6 py-4 text-white"
                style={{ background: "linear-gradient(135deg, #3AAFE5 0%, #2E8AB8 100%)" }}>
          <h2 className="text-xl font-bold m-0">💰 Education Loan EMI Calculator</h2>
          <p className="text-sm text-white/90 m-0 mt-0.5">Calculate your monthly EMI in seconds</p>
        </header>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Inputs */}
          <div className="space-y-5">
            <SliderField
              label="Loan Amount"
              valueDisplay={fmtL(amount)}
              min={100000} max={20000000} step={50000}
              value={amount} onChange={setAmount}
              ticks={["₹1 L", "₹50 L", "₹1 Cr", "₹2 Cr"]}
            />

            <SliderField
              label="Interest Rate (p.a.)"
              valueDisplay={`${rate.toFixed(1)}%`}
              min={6} max={18} step={0.1}
              value={rate} onChange={setRate}
              ticks={["6%", "10%", "14%", "18%"]}
            />

            <SliderField
              label="Loan Tenure"
              valueDisplay={`${years} ${years === 1 ? "year" : "years"}`}
              min={1} max={15} step={1}
              value={years} onChange={setYears}
              ticks={["1 yr", "5 yrs", "10 yrs", "15 yrs"]}
            />

            <p className="text-xs text-gray-500 italic">
              💡 Tip: Most Indian lenders cap tenure at 10-12 years; SBI allows 15. Longer tenure = lower EMI but more total interest.
            </p>
          </div>

          {/* Results */}
          <div className="space-y-3">
            <div className="rounded-xl p-5 text-white"
                 style={{ background: "linear-gradient(135deg, #10B981 0%, #059669 100%)" }}>
              <p className="text-xs uppercase tracking-wider opacity-90 mb-1">Your monthly EMI</p>
              <p className="text-4xl font-extrabold">₹{fmt(emi)}</p>
              <p className="text-sm opacity-90 mt-1">for {years * 12} months</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Stat label="Principal" value={fmtL(amount)} color="#3AAFE5" />
              <Stat label="Total interest" value={fmtL(totalInterest)} color="#F5A71A" />
            </div>

            <Stat label="Total amount payable" value={fmtL(totalPayable)} color="#1a1a4a" full />

            <div className="rounded-lg p-3 bg-blue-50 border border-blue-200 text-xs text-blue-900">
              <strong>Interest is ~{Math.round((totalInterest / amount) * 100)}% of your loan</strong>{" "}
              over {years} years. Section 80E lets you deduct the entire interest from taxable income.
            </div>
          </div>
        </div>
      </div>

      {/* Comparison table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">EMI at different interest rates</h3>
          <p className="text-xs text-gray-500 mt-0.5">Same loan (₹{fmtL(amount).replace("₹", "")}) and tenure ({years} years) at common rates:</p>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-6 py-3 text-xs uppercase tracking-wider text-gray-500 font-bold">Interest Rate</th>
              <th className="px-6 py-3 text-xs uppercase tracking-wider text-gray-500 font-bold">Monthly EMI</th>
              <th className="px-6 py-3 text-xs uppercase tracking-wider text-gray-500 font-bold">Total Paid</th>
              <th className="px-6 py-3 text-xs uppercase tracking-wider text-gray-500 font-bold">Lender Examples</th>
            </tr>
          </thead>
          <tbody>
            {comparisons.map(c => (
              <tr key={c.rate} className={`border-t border-gray-100 ${c.rate === Math.round(rate * 10) / 10 ? "bg-blue-50/40" : ""}`}>
                <td className="px-6 py-3.5 font-bold text-gray-900">{c.rate.toFixed(1)}%</td>
                <td className="px-6 py-3.5 font-semibold text-gray-900">₹{fmt(c.emi)}</td>
                <td className="px-6 py-3.5 text-gray-700">{fmtL(c.total)}</td>
                <td className="px-6 py-3.5 text-xs text-gray-500">
                  {c.rate === 8.5  && "SBI (with collateral)"}
                  {c.rate === 10   && "HDFC Credila, ICICI"}
                  {c.rate === 11.5 && "Avanse, Auxilo"}
                  {c.rate === 13   && "Prodigy, InCred"}
                  {c.rate === 14.5 && "MPOWER, riskier profiles"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CTA */}
      <div className="rounded-2xl p-6 sm:p-8 text-white"
           style={{ background: "linear-gradient(135deg, #3AAFE5 0%, #F5A71A 100%)" }}>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-center">
          <div>
            <h3 className="text-xl sm:text-2xl font-extrabold mb-1">Ready to apply?</h3>
            <p className="text-white/90">
              Compare 8 top lenders side-by-side — interest rates, max amounts, processing time.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Link href="/best-education-loans"
                  className="inline-flex items-center gap-1 bg-white text-gray-900 font-bold px-5 py-3 rounded-xl whitespace-nowrap">
              Compare lenders →
            </Link>
            <Link href="/loan-portal"
                  className="inline-flex items-center gap-1 border-2 border-white text-white font-bold px-5 py-3 rounded-xl whitespace-nowrap">
              💬 Talk to Priya
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function SliderField({
  label, valueDisplay, min, max, step, value, onChange, ticks,
}: {
  label: string; valueDisplay: string;
  min: number; max: number; step: number;
  value: number; onChange: (v: number) => void;
  ticks: string[];
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <label className="text-sm font-semibold text-gray-700">{label}</label>
        <span className="text-base font-extrabold" style={{ color: "#3AAFE5" }}>{valueDisplay}</span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step}
        value={value} onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full accent-brand"
        style={{ accentColor: "#3AAFE5" }}
      />
      <div className="flex justify-between mt-1 text-[10px] text-gray-400">
        {ticks.map((t, i) => <span key={i}>{t}</span>)}
      </div>
    </div>
  );
}

function Stat({ label, value, color, full = false }: { label: string; value: string; color: string; full?: boolean }) {
  return (
    <div className={`rounded-lg p-3 border border-gray-100 ${full ? "" : ""}`}>
      <p className="text-[10px] uppercase tracking-wider text-gray-500">{label}</p>
      <p className="text-lg font-extrabold mt-0.5" style={{ color }}>{value}</p>
    </div>
  );
}
