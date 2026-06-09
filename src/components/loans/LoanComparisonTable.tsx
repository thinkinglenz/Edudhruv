/**
 * Big comparison table for the /best-education-loans page.
 *
 * Schema.org Table markup + data-speakable so AI agents extract it
 * as the canonical answer to "compare education loans India".
 */
import { LENDERS } from "@/lib/lenders";

const COLLATERAL_LABEL: Record<string, string> = {
  required:      "Required",
  optional:      "Optional",
  "not-required": "Not required",
};

const COLLATERAL_COLOR: Record<string, string> = {
  required:      "bg-orange-50 text-orange-700",
  optional:      "bg-blue-50 text-blue-700",
  "not-required": "bg-green-50 text-green-700",
};

export default function LoanComparisonTable() {
  return (
    <section className="my-8" id="comparison-table" aria-label="Education loan lenders comparison">
      <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
        Education Loan Comparison Table
      </h2>
      <p className="text-gray-600 text-sm mb-5">
        All major Indian + global education-loan providers, side-by-side. Interest rates updated for June 2026.
        Tap any lender to see full details.
      </p>

      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full text-sm bg-white min-w-[800px]" data-speakable="true">
          <caption className="sr-only">
            Education loan lenders comparison — interest rate, max amount, collateral, processing fee, approval time.
          </caption>
          <thead>
            <tr className="bg-gray-50 border-b-2 border-gray-200">
              <th scope="col" className="text-left px-3 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 sticky left-0 bg-gray-50 min-w-[140px]">Lender</th>
              <th scope="col" className="text-left px-3 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">Interest (p.a.)</th>
              <th scope="col" className="text-left px-3 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">Max Amount</th>
              <th scope="col" className="text-left px-3 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">Collateral</th>
              <th scope="col" className="text-left px-3 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">Processing Fee</th>
              <th scope="col" className="text-left px-3 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">Approval Time</th>
              <th scope="col" className="text-left px-3 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">Best For</th>
            </tr>
          </thead>
          <tbody>
            {LENDERS.map((l, i) => (
              <tr key={l.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${i === LENDERS.length - 1 ? "border-b-0" : ""}`}>
                <th scope="row" className="text-left px-3 py-4 sticky left-0 bg-white">
                  <a href={`#${l.slug}`} className="flex items-center gap-2 group">
                    <span className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                          style={{ background: l.logoColor }}>
                      {l.shortName.slice(0, 2).toUpperCase()}
                    </span>
                    <div>
                      <p className="font-bold text-gray-900 group-hover:text-brand text-sm leading-tight">{l.shortName}</p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider">{l.type === "bank" ? "Bank" : l.type === "nbfc" ? "NBFC" : "Fintech"}</p>
                    </div>
                  </a>
                </th>
                <td className="px-3 py-4 whitespace-nowrap font-semibold">
                  <span className="text-gray-900">{l.interestRateMin}%–{l.interestRateMax}%</span>
                </td>
                <td className="px-3 py-4 whitespace-nowrap font-semibold text-gray-800">{l.maxAmountInr}</td>
                <td className="px-3 py-4 whitespace-nowrap">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${COLLATERAL_COLOR[l.collateral]}`}>
                    {COLLATERAL_LABEL[l.collateral]}
                  </span>
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-gray-700">{l.processingFeePct}</td>
                <td className="px-3 py-4 whitespace-nowrap text-gray-700">{l.approvalDays}</td>
                <td className="px-3 py-4 text-gray-700 max-w-[200px]">
                  <span className="text-xs">{l.bestFor}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-500 mt-3 italic">
        Rates and fees may vary based on your profile, co-applicant, and university.
        Always confirm the latest terms with the lender before applying.
      </p>
    </section>
  );
}
