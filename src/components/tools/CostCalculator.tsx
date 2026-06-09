"use client";
import { useState, useMemo } from "react";
import Link from "next/link";

interface CountryPreset {
  slug: string;
  name: string;
  flag: string;
  tuitionMin: number;     // ₹ lakh/year
  tuitionMax: number;
  livingMin: number;
  livingMax: number;
  visaFee: number;        // one-time
  travel: number;         // one-time
}

const COUNTRY_PRESETS: CountryPreset[] = [
  { slug: "usa",       name: "USA",       flag: "🇺🇸", tuitionMin: 25, tuitionMax: 65, livingMin: 10, livingMax: 20, visaFee: 0.15, travel: 1.0 },
  { slug: "uk",        name: "UK",        flag: "🇬🇧", tuitionMin: 18, tuitionMax: 35, livingMin: 8,  livingMax: 15, visaFee: 0.50, travel: 0.6 },
  { slug: "canada",    name: "Canada",    flag: "🇨🇦", tuitionMin: 12, tuitionMax: 25, livingMin: 6,  livingMax: 12, visaFee: 0.20, travel: 1.1 },
  { slug: "australia", name: "Australia", flag: "🇦🇺", tuitionMin: 17, tuitionMax: 32, livingMin: 10, livingMax: 17, visaFee: 0.60, travel: 1.0 },
  { slug: "germany",   name: "Germany",   flag: "🇩🇪", tuitionMin: 0.3,tuitionMax: 15, livingMin: 8,  livingMax: 12, visaFee: 0.07, travel: 0.5 },
  { slug: "singapore", name: "Singapore", flag: "🇸🇬", tuitionMin: 15, tuitionMax: 25, livingMin: 10, livingMax: 15, visaFee: 0.05, travel: 0.3 },
];

const LIFESTYLES = [
  { id: "budget",   label: "Budget — shared room, cook own food", weight: 0.85 },
  { id: "moderate", label: "Moderate — average lifestyle",        weight: 1.0  },
  { id: "comfort",  label: "Comfortable — own room, eat out",      weight: 1.25 },
];

export default function CostCalculator() {
  const [countrySlug, setCountrySlug]   = useState("usa");
  const [durationYears, setDuration]    = useState(2);
  const [lifestyleId, setLifestyle]     = useState("moderate");
  const [tuitionLevel, setTuitionLevel] = useState<"low" | "mid" | "high">("mid");

  const country   = COUNTRY_PRESETS.find(c => c.slug === countrySlug)!;
  const lifestyle = LIFESTYLES.find(l => l.id === lifestyleId)!;

  const result = useMemo(() => {
    // Tuition by level
    const tuitionPerYear = tuitionLevel === "low"
      ? country.tuitionMin
      : tuitionLevel === "high"
      ? country.tuitionMax
      : (country.tuitionMin + country.tuitionMax) / 2;

    // Living based on lifestyle (weight)
    const livingMid    = (country.livingMin + country.livingMax) / 2;
    const livingPerYear = livingMid * lifestyle.weight;

    const totalTuition = tuitionPerYear * durationYears;
    const totalLiving  = livingPerYear  * durationYears;
    const oneTime      = country.visaFee + country.travel;
    const total        = totalTuition + totalLiving + oneTime;

    // Monthly EMI estimate at 11.5% for 7 years
    const r = 11.5 / 12 / 100;
    const n = 7 * 12;
    const totalInLakh   = total * 100000;
    const monthlyEMI    = (totalInLakh * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

    return {
      tuitionPerYear, livingPerYear,
      totalTuition, totalLiving, oneTime, total,
      monthlyEMI,
    };
  }, [country, durationYears, lifestyle, tuitionLevel]);

  const fmt = (lakh: number) => {
    if (lakh >= 100) return `₹${(lakh / 100).toFixed(2)} Cr`;
    return `₹${lakh.toFixed(1)} L`;
  };
  const fmtRupee = (n: number) => new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Math.round(n));

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-sm overflow-hidden">
        <header className="px-6 py-4 text-white"
                style={{ background: "linear-gradient(135deg, #F5A71A 0%, #B07208 100%)" }}>
          <h2 className="text-xl font-bold m-0">🌍 Cost of Studying Abroad Calculator</h2>
          <p className="text-sm text-white/90 m-0 mt-0.5">Total cost in INR for Indian students</p>
        </header>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Inputs */}
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Where do you want to study?</label>
              <div className="grid grid-cols-3 gap-2">
                {COUNTRY_PRESETS.map(c => (
                  <button
                    key={c.slug}
                    onClick={() => setCountrySlug(c.slug)}
                    className={`px-3 py-2.5 rounded-lg border-2 text-sm font-semibold transition-all ${
                      countrySlug === c.slug
                        ? "text-white shadow-sm"
                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                    }`}
                    style={countrySlug === c.slug ? { borderColor: "#3AAFE5", background: "#3AAFE5" } : {}}
                  >
                    <span className="text-xl block">{c.flag}</span>
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Course duration</label>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map(y => (
                  <button
                    key={y}
                    onClick={() => setDuration(y)}
                    className={`py-2.5 rounded-lg border-2 text-sm font-semibold ${
                      durationYears === y
                        ? "text-white"
                        : "border-gray-200 bg-white text-gray-700"
                    }`}
                    style={durationYears === y ? { borderColor: "#3AAFE5", background: "#3AAFE5" } : {}}
                  >
                    {y} {y === 1 ? "year" : "years"}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">University tier</label>
              <div className="grid grid-cols-3 gap-2">
                {([
                  { id: "low",  label: "Budget" },
                  { id: "mid",  label: "Average" },
                  { id: "high", label: "Premium" },
                ] as const).map(t => (
                  <button
                    key={t.id}
                    onClick={() => setTuitionLevel(t.id)}
                    className={`py-2.5 rounded-lg border-2 text-sm font-semibold ${
                      tuitionLevel === t.id
                        ? "text-white"
                        : "border-gray-200 bg-white text-gray-700"
                    }`}
                    style={tuitionLevel === t.id ? { borderColor: "#3AAFE5", background: "#3AAFE5" } : {}}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Your lifestyle</label>
              <div className="space-y-2">
                {LIFESTYLES.map(l => (
                  <label key={l.id}
                         className={`flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer ${
                           lifestyleId === l.id ? "" : "border-gray-200"
                         }`}
                         style={lifestyleId === l.id ? { borderColor: "#3AAFE5", background: "#EBF7FD" } : {}}>
                    <input type="radio" name="lifestyle" value={l.id}
                           checked={lifestyleId === l.id}
                           onChange={() => setLifestyle(l.id)}
                           className="accent-brand" />
                    <span className="text-sm text-gray-700">{l.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-3">
            <div className="rounded-xl p-5 text-white"
                 style={{ background: "linear-gradient(135deg, #1a1a4a 0%, #3AAFE5 100%)" }}>
              <p className="text-xs uppercase tracking-wider opacity-90 mb-1">
                Total cost for {durationYears} {durationYears === 1 ? "year" : "years"} in {country.name}
              </p>
              <p className="text-4xl font-extrabold">{fmt(result.total)}</p>
              <p className="text-sm opacity-90 mt-1">≈ ₹{fmtRupee(result.total / 100 / durationYears / 12)}/month</p>
            </div>

            <div className="bg-white rounded-lg border border-gray-100 divide-y divide-gray-50">
              <Row label={`Tuition (${durationYears} yrs)`} value={fmt(result.totalTuition)} sub={`${fmt(result.tuitionPerYear)}/year`} />
              <Row label={`Living (${durationYears} yrs)`}  value={fmt(result.totalLiving)}  sub={`${fmt(result.livingPerYear)}/year`} />
              <Row label="Visa fee"  value={fmt(country.visaFee)} sub="One-time" />
              <Row label="Flights"   value={fmt(country.travel)} sub="Outbound + return" />
            </div>

            <div className="rounded-lg p-4 bg-orange-50 border border-orange-200">
              <p className="text-xs uppercase tracking-wider text-orange-700 font-bold">If financed by an education loan:</p>
              <p className="text-2xl font-extrabold text-orange-900 mt-1">₹{fmtRupee(result.monthlyEMI)}/mo</p>
              <p className="text-xs text-orange-800 mt-1">EMI at 11.5% for 7 years (post-graduation)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Country comparison */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">Compare same course across countries</h3>
          <p className="text-xs text-gray-500 mt-0.5">{durationYears}-year program, {lifestyle.label.split(" — ")[0].toLowerCase()} lifestyle, average tier:</p>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-6 py-3 text-xs uppercase tracking-wider text-gray-500 font-bold">Country</th>
              <th className="text-left px-6 py-3 text-xs uppercase tracking-wider text-gray-500 font-bold">Tuition</th>
              <th className="text-left px-6 py-3 text-xs uppercase tracking-wider text-gray-500 font-bold">Living</th>
              <th className="text-left px-6 py-3 text-xs uppercase tracking-wider text-gray-500 font-bold">Total</th>
            </tr>
          </thead>
          <tbody>
            {COUNTRY_PRESETS.map(c => {
              const tuition = ((c.tuitionMin + c.tuitionMax) / 2) * durationYears;
              const living  = ((c.livingMin + c.livingMax) / 2) * lifestyle.weight * durationYears;
              const total   = tuition + living + c.visaFee + c.travel;
              return (
                <tr key={c.slug} className={`border-t border-gray-100 ${c.slug === countrySlug ? "bg-blue-50/40" : ""}`}>
                  <td className="px-6 py-3.5">
                    <Link href={`/study-in/${c.slug}`} className="font-bold text-gray-900 hover:underline">
                      <span className="mr-1.5">{c.flag}</span>{c.name}
                    </Link>
                  </td>
                  <td className="px-6 py-3.5 text-gray-700">{fmt(tuition)}</td>
                  <td className="px-6 py-3.5 text-gray-700">{fmt(living)}</td>
                  <td className="px-6 py-3.5 font-bold text-gray-900">{fmt(total)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* CTA */}
      <div className="rounded-2xl p-6 sm:p-8 text-white"
           style={{ background: "linear-gradient(135deg, #3AAFE5 0%, #F5A71A 100%)" }}>
        <h3 className="text-xl sm:text-2xl font-extrabold mb-2">Worried about the cost?</h3>
        <p className="text-white/90 mb-5">
          We can help find 100% funded scholarships + low-interest loans that fit your situation.
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <Link href="/scholarships"
                className="inline-flex items-center justify-center bg-white text-gray-900 font-bold px-5 py-3 rounded-xl">
            🎓 Browse Scholarships
          </Link>
          <Link href="/best-education-loans"
                className="inline-flex items-center justify-center border-2 border-white text-white font-bold px-5 py-3 rounded-xl">
            💰 Compare Loans
          </Link>
          <Link href={`/study-in/${countrySlug}`}
                className="inline-flex items-center justify-center bg-white/20 text-white font-bold px-5 py-3 rounded-xl">
            📖 {country.flag} Full {country.name} Guide
          </Link>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="px-4 py-3 flex items-center justify-between text-sm">
      <div>
        <p className="text-gray-700">{label}</p>
        {sub && <p className="text-xs text-gray-400">{sub}</p>}
      </div>
      <p className="font-bold text-gray-900">{value}</p>
    </div>
  );
}
