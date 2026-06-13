"use client";
import { useState, useMemo } from "react";
import Link from "next/link";

// Country presets — captures total cost + likely starting salary
interface Preset {
  slug: string;
  label: string;
  flag: string;
  totalCostINR:    number;  // ₹ Lakh — total 2-year program incl. living
  startingSalary:  number;  // ₹ Lakh/year — starting salary in same country
  postStudyYears:  number;  // post-study work visa years
  taxRate:         number;  // effective income tax rate post-deductions
  livingCost:      number;  // ₹ Lakh/year — living cost while working there
}

const COUNTRIES: Preset[] = [
  { slug:"usa-cs",      label:"USA — MS CS",      flag:"🇺🇸", totalCostINR:130, startingSalary:150, postStudyYears:3, taxRate:0.30, livingCost:30 },
  { slug:"usa-mba",     label:"USA — MBA",        flag:"🇺🇸", totalCostINR:160, startingSalary:230, postStudyYears:3, taxRate:0.32, livingCost:40 },
  { slug:"uk-cs",       label:"UK — MSc CS",      flag:"🇬🇧", totalCostINR:65,  startingSalary:90,  postStudyYears:2, taxRate:0.28, livingCost:20 },
  { slug:"uk-mba",      label:"UK — MBA",         flag:"🇬🇧", totalCostINR:80,  startingSalary:120, postStudyYears:2, taxRate:0.30, livingCost:25 },
  { slug:"canada-cs",   label:"Canada — MS CS",   flag:"🇨🇦", totalCostINR:55,  startingSalary:80,  postStudyYears:3, taxRate:0.27, livingCost:18 },
  { slug:"canada-pgd",  label:"Canada — PG Diploma", flag:"🇨🇦", totalCostINR:22, startingSalary:55, postStudyYears:3, taxRate:0.25, livingCost:15 },
  { slug:"australia-it",label:"Australia — Master of IT", flag:"🇦🇺", totalCostINR:75, startingSalary:85, postStudyYears:3, taxRate:0.30, livingCost:22 },
  { slug:"germany-me",  label:"Germany — MS ME",  flag:"🇩🇪", totalCostINR:25,  startingSalary:55,  postStudyYears:3, taxRate:0.35, livingCost:18 },
  { slug:"singapore-mba",label:"Singapore — MBA", flag:"🇸🇬", totalCostINR:70,  startingSalary:85,  postStudyYears:3, taxRate:0.18, livingCost:24 },
];

const INDIA_BASELINE = {
  startingSalary: 12,    // ₹ Lakh — typical fresh grad in India (BTech 2027)
  salaryGrowth: 0.12,    // 12%/year compounded
  livingCost: 6,         // ₹ Lakh/year (sharing flat in metro city, modest lifestyle)
};

export default function ROICalculator() {
  const [presetSlug, setPresetSlug] = useState("usa-cs");
  const [loanPercent, setLoanPercent] = useState(70);   // % of total cost financed
  const [interestRate, setInterestRate] = useState(11.5);
  const [tenure, setTenure] = useState(7);
  const [horizon, setHorizon] = useState(10);  // years of comparison post-graduation

  const preset = COUNTRIES.find(c => c.slug === presetSlug)!;

  const result = useMemo(() => {
    // Loan EMI
    const loanINRLakh = (preset.totalCostINR * loanPercent) / 100;
    const principal = loanINRLakh * 100000;
    const r = interestRate / 12 / 100;
    const n = tenure * 12;
    const emi = principal > 0 ? (principal * r * Math.pow(1+r, n)) / (Math.pow(1+r, n) - 1) : 0;
    const totalInterest = emi * n - principal;
    const totalLoanPaid = emi * n / 100000;  // Lakh

    // Abroad earnings projection (post-graduation)
    const abroadNet: number[] = [];
    const indiaNet: number[]  = [];
    for (let year = 1; year <= horizon; year++) {
      // Abroad salary grows 8% in first 3 years, 5% after
      const growth = year <= preset.postStudyYears ? 0.08 : 0.05;
      const grossAbroad = preset.startingSalary * Math.pow(1 + growth, year - 1);
      const taxAbroad = grossAbroad * preset.taxRate;
      const livingAbroad = preset.livingCost * Math.pow(1.03, year - 1); // inflation
      const yearlyEMI = (year <= tenure) ? emi * 12 / 100000 : 0;
      const netAbroad = grossAbroad - taxAbroad - livingAbroad - yearlyEMI;
      abroadNet.push(Math.max(0, netAbroad));

      // India scenario
      const grossIndia = INDIA_BASELINE.startingSalary * Math.pow(1 + INDIA_BASELINE.salaryGrowth, year - 1);
      const taxIndia = grossIndia > 7 ? (grossIndia - 7) * 0.20 + Math.max(0, (grossIndia - 12)) * 0.10 : 0;
      const livingIndia = INDIA_BASELINE.livingCost * Math.pow(1.06, year - 1);  // higher inflation
      const netIndia = grossIndia - taxIndia - livingIndia;
      indiaNet.push(Math.max(0, netIndia));
    }

    const totalAbroadNet = abroadNet.reduce((a, b) => a + b, 0);
    const totalIndiaNet  = indiaNet.reduce((a, b) => a + b, 0);
    const surplus        = totalAbroadNet - totalIndiaNet;
    const breakEvenYear  = (() => {
      // Cumulative net savings: when does abroad cumulative > india cumulative?
      let abroad = -preset.totalCostINR; // start with cost as negative
      let india  = 0;
      for (let y = 0; y < horizon; y++) {
        abroad += abroadNet[y];
        india  += indiaNet[y];
        if (abroad > india) return y + 1;
      }
      return null;
    })();

    return {
      emi, totalInterest, totalLoanPaid,
      abroadNet, indiaNet,
      totalAbroadNet, totalIndiaNet, surplus, breakEvenYear,
    };
  }, [preset, loanPercent, interestRate, tenure, horizon]);

  const fmt = (lakh: number) => {
    if (lakh >= 100) return `₹${(lakh / 100).toFixed(2)} Cr`;
    return `₹${lakh.toFixed(1)} L`;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-sm overflow-hidden">
        <header className="px-6 py-4 text-white"
                style={{ background: "linear-gradient(135deg, #10B981 0%, #047857 100%)" }}>
          <h2 className="text-xl font-bold m-0">💰 Will Studying Abroad Pay Off?</h2>
          <p className="text-sm text-white/90 m-0 mt-0.5">10-year ROI projection vs staying in India</p>
        </header>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Inputs */}
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Course + Country</label>
              <select value={presetSlug} onChange={e => setPresetSlug(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm">
                {COUNTRIES.map(c => <option key={c.slug} value={c.slug}>{c.flag} {c.label}</option>)}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Total program cost: <strong>₹{preset.totalCostINR} L</strong> · Starting salary: <strong>₹{preset.startingSalary} L/year</strong>
              </p>
            </div>

            <Slider label="% financed via loan" value={loanPercent} display={`${loanPercent}%`}
                    onChange={setLoanPercent} min={0} max={100} step={5}
                    ticks={["0%", "50%", "100%"]} />

            <Slider label="Loan interest rate" value={interestRate} display={`${interestRate.toFixed(1)}%`}
                    onChange={setInterestRate} min={7} max={15} step={0.5}
                    ticks={["7%", "11%", "15%"]} />

            <Slider label="Loan tenure" value={tenure} display={`${tenure} years`}
                    onChange={setTenure} min={3} max={15} step={1}
                    ticks={["3y", "9y", "15y"]} />

            <Slider label="Compare over" value={horizon} display={`${horizon} years post-graduation`}
                    onChange={setHorizon} min={5} max={15} step={1}
                    ticks={["5y", "10y", "15y"]} />
          </div>

          {/* Results */}
          <div className="space-y-3">
            <div className="rounded-xl p-5 text-white"
                 style={{ background: result.surplus > 0
                   ? "linear-gradient(135deg, #10B981 0%, #047857 100%)"
                   : "linear-gradient(135deg, #F5A71A 0%, #B07208 100%)" }}>
              <p className="text-xs uppercase tracking-wider opacity-90 mb-1">{horizon}-year net surplus vs staying in India</p>
              <p className="text-4xl font-extrabold">
                {result.surplus > 0 ? "+" : ""}{fmt(result.surplus)}
              </p>
              <p className="text-sm opacity-90 mt-1">
                {result.surplus > 0
                  ? `That's how much MORE you save abroad after ${horizon} years.`
                  : `Studying abroad costs ${fmt(Math.abs(result.surplus))} more over ${horizon} years vs staying.`}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Stat label="Abroad net savings" value={fmt(result.totalAbroadNet - preset.totalCostINR)} color="#3AAFE5" sub={`Net of ${fmt(preset.totalCostINR)} cost`} />
              <Stat label="India net savings"  value={fmt(result.totalIndiaNet)}  color="#F5A71A" sub="No loan, no big cost" />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs">
              <p className="text-blue-900">
                <strong>EMI:</strong> ₹{Math.round(result.emi).toLocaleString("en-IN")}/month for {tenure} years &middot;
                Total interest paid: {fmt(result.totalInterest / 100000)}
              </p>
              {result.breakEvenYear && (
                <p className="text-blue-900 mt-1">
                  <strong>Break-even:</strong> Year {result.breakEvenYear} — that's when abroad cumulative beats India cumulative.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Year-by-year breakdown */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">Year-by-year net savings comparison</h3>
          <p className="text-xs text-gray-500 mt-0.5">After all taxes, EMI, and living costs:</p>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-6 py-3 text-xs uppercase tracking-wider text-gray-500 font-bold">Year</th>
              <th className="text-left px-6 py-3 text-xs uppercase tracking-wider text-gray-500 font-bold">{preset.flag} Net savings (Abroad)</th>
              <th className="text-left px-6 py-3 text-xs uppercase tracking-wider text-gray-500 font-bold">🇮🇳 Net savings (India)</th>
              <th className="text-left px-6 py-3 text-xs uppercase tracking-wider text-gray-500 font-bold">Difference</th>
            </tr>
          </thead>
          <tbody>
            {result.abroadNet.map((abroad, i) => {
              const india = result.indiaNet[i];
              const diff = abroad - india;
              return (
                <tr key={i} className="border-t border-gray-100">
                  <td className="px-6 py-3 font-semibold text-gray-900">{i + 1}</td>
                  <td className="px-6 py-3 text-gray-800">{fmt(abroad)}</td>
                  <td className="px-6 py-3 text-gray-700">{fmt(india)}</td>
                  <td className={`px-6 py-3 font-bold ${diff > 0 ? "text-green-700" : "text-orange-700"}`}>
                    {diff > 0 ? "+" : ""}{fmt(diff)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-xs text-yellow-900">
        <strong>How we calculate:</strong> Starting salaries based on placement reports + LinkedIn data. 8% salary growth/year in first 3 years (typical post-OPT/PR), 5% after. India baseline: ₹12L starting (engineer), 12% compounded growth. Living costs differ — we adjusted for each country. All numbers in INR for direct comparison. <strong>Not financial advice</strong> — actual outcomes vary by company, role, and individual.
      </div>

      <div className="rounded-2xl p-6 sm:p-8 text-white" style={{ background: "linear-gradient(135deg, #3AAFE5 0%, #F5A71A 100%)" }}>
        <h3 className="text-xl sm:text-2xl font-extrabold mb-2">Need help financing your abroad education?</h3>
        <p className="text-white/90 mb-5">Free guidance on lender selection, application strategy, and scholarship matching.</p>
        <div className="flex flex-col sm:flex-row gap-2">
          <Link href="/best-education-loans"
                className="inline-flex items-center justify-center bg-white text-gray-900 font-bold px-5 py-3 rounded-xl">
            💰 Compare Loans
          </Link>
          <Link href="/scholarships"
                className="inline-flex items-center justify-center border-2 border-white text-white font-bold px-5 py-3 rounded-xl">
            🎓 Browse Scholarships
          </Link>
          <Link href="/loan-portal"
                className="inline-flex items-center justify-center bg-white/20 text-white font-bold px-5 py-3 rounded-xl">
            💬 Talk to Priya
          </Link>
        </div>
      </div>
    </div>
  );
}

function Slider({ label, value, display, onChange, min, max, step, ticks }: {
  label: string; value: number; display: string;
  onChange: (v: number) => void;
  min: number; max: number; step: number;
  ticks: string[];
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <label className="text-sm font-semibold text-gray-700">{label}</label>
        <span className="text-base font-extrabold" style={{ color: "#10B981" }}>{display}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
             onChange={e => onChange(parseFloat(e.target.value))}
             className="w-full" style={{ accentColor: "#10B981" }} />
      <div className="flex justify-between mt-1 text-[10px] text-gray-400">
        {ticks.map((t, i) => <span key={i}>{t}</span>)}
      </div>
    </div>
  );
}

function Stat({ label, value, color, sub }: { label: string; value: string; color: string; sub?: string }) {
  return (
    <div className="rounded-lg p-3 border border-gray-100 bg-white">
      <p className="text-[10px] uppercase tracking-wider text-gray-500">{label}</p>
      <p className="text-lg font-extrabold mt-0.5" style={{ color }}>{value}</p>
      {sub && <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}
