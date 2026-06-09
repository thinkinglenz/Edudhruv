/**
 * Comparison Table — rendered on every scholarship post showing the
 * current scholarship vs 2-3 alternatives.
 *
 * Why this matters most for AI extraction:
 *   - ChatGPT, Perplexity, Google AI Overviews lift comparison tables
 *     verbatim into their answers (literally the BEST format for AI)
 *   - Users searching "Clarendon vs Rhodes" find this directly
 *   - High dwell time (people compare before deciding) → ad impressions
 *
 * Also marked up as Schema.org Table for AI parsers.
 */
import Link from "next/link";
import type { Scholarship } from "@/lib/scholarships";
import { getCountryFlag } from "@/lib/scholarships";

interface Props {
  current: Scholarship;
  others:  Scholarship[];
}

function fmtDeadline(iso: string | null): string {
  if (!iso) return "Rolling";
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function ComparisonTable({ current, others }: Props) {
  if (!others || others.length === 0) return null;

  const all = [current, ...others.slice(0, 3)];
  const captionText = `${current.scholarship_name} vs other 100% funded scholarships`;

  return (
    <section className="my-10" aria-label="Scholarship comparison">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        How {current.scholarship_name} compares
      </h2>
      <p className="text-sm text-gray-500 mb-5">
        Quick side-by-side with other fully-funded options Indian students can apply to:
      </p>

      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full text-sm bg-white" data-speakable="true">
          <caption className="sr-only">{captionText}</caption>
          <thead>
            <tr className="bg-gray-50 border-b-2 border-gray-200">
              <th scope="col" className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 sticky left-0 bg-gray-50">
                Scholarship
              </th>
              <th scope="col" className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 whitespace-nowrap">University</th>
              <th scope="col" className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 whitespace-nowrap">Amount/yr</th>
              <th scope="col" className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 whitespace-nowrap">Deadline</th>
              <th scope="col" className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 whitespace-nowrap">Coverage</th>
            </tr>
          </thead>
          <tbody>
            {all.map((s, i) => {
              const isCurrent = s.id === current.id;
              return (
                <tr
                  key={s.id}
                  className={`border-b border-gray-100 ${isCurrent ? "bg-blue-50/40" : ""} ${i === all.length - 1 ? "border-b-0" : ""}`}
                >
                  <th scope="row" className={`text-left px-4 py-3.5 sticky left-0 ${isCurrent ? "bg-blue-50/40" : "bg-white"}`}>
                    {s.post_slug && !isCurrent ? (
                      <Link href={`/scholarship/${s.post_slug}`}
                            className="font-bold text-gray-900 hover:underline" style={{ color: "#3AAFE5" }}>
                        {s.scholarship_name}
                      </Link>
                    ) : (
                      <span className="font-bold text-gray-900 flex items-center gap-1.5">
                        {s.scholarship_name}
                        {isCurrent && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">YOU ARE HERE</span>}
                      </span>
                    )}
                  </th>
                  <td className="px-4 py-3.5 whitespace-nowrap text-gray-700">
                    <span className="mr-1.5">{getCountryFlag(s.country)}</span>
                    {s.university_name.length > 35 ? s.university_name.slice(0, 32) + "…" : s.university_name}
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap font-semibold text-gray-800">
                    {s.amount_inr || s.amount_native || "—"}
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap text-gray-700">
                    {fmtDeadline(s.application_deadline)}
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-700">
                      {s.coverage_percentage}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-400 mt-3">
        💡 Tip: Indian students can apply to multiple 100%-funded scholarships in the same admission cycle.
        Compare deadlines and intakes carefully.
      </p>
    </section>
  );
}
