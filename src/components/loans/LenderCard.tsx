import Link from "next/link";
import type { Lender } from "@/lib/lenders";

interface Props {
  lender: Lender;
}

const COLLATERAL_LABEL: Record<string, string> = {
  required:      "Required",
  optional:      "Optional",
  "not-required": "Not required",
};

export default function LenderCard({ lender: l }: Props) {
  return (
    <section
      id={l.slug}
      className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden scroll-mt-20"
      itemScope itemType="https://schema.org/FinancialProduct"
    >
      {/* Header with brand color */}
      <div className="px-5 sm:px-6 py-4 flex items-center gap-4" style={{ background: `${l.logoColor}10` }}>
        <div className="w-14 h-14 rounded-xl flex items-center justify-center text-white text-base font-bold flex-shrink-0"
             style={{ background: l.logoColor }}>
          {l.shortName.slice(0, 2).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg sm:text-xl font-extrabold text-gray-900 m-0" itemProp="name">{l.name}</h3>
          <p className="text-xs text-gray-500 uppercase tracking-wider mt-0.5">
            {l.type === "bank" ? "Indian Bank" :
             l.type === "nbfc" ? "Indian NBFC" :
             l.type === "fintech-india" ? "Indian Fintech" :
             "Global Fintech"}
            <span className="mx-2">·</span>
            <span style={{ color: l.logoColor }} className="font-bold">{l.bestFor}</span>
          </p>
        </div>
      </div>

      <div className="px-5 sm:px-6 py-5">
        {/* Key numbers grid */}
        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5 pb-5 border-b border-gray-100">
          <Stat label="Interest p.a." value={`${l.interestRateMin}%–${l.interestRateMax}%`} />
          <Stat label="Max amount"    value={l.maxAmountInr} />
          <Stat label="Collateral"    value={COLLATERAL_LABEL[l.collateral]} />
          <Stat label="Approval time" value={l.approvalDays} />
        </dl>

        {/* Pros + cons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-green-700 mb-2">✓ Pros</p>
            <ul className="space-y-1 text-sm text-gray-700">
              {l.prosLine.map(p => <li key={p} className="flex gap-2"><span className="text-green-600">+</span>{p}</li>)}
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-orange-700 mb-2">⚠ Watch out for</p>
            <ul className="space-y-1 text-sm text-gray-700">
              {l.consLine.map(c => <li key={c} className="flex gap-2"><span className="text-orange-600">−</span>{c}</li>)}
            </ul>
          </div>
        </div>

        {/* Who should apply */}
        <div className="bg-gray-50 rounded-lg p-4 mb-5">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Who should apply?</p>
          <p className="text-sm text-gray-700 leading-relaxed">{l.whoShouldApply}</p>
        </div>

        {/* Other details */}
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5 text-sm">
          <Field label="Countries covered" value={l.countriesCovered} />
          <Field label="Moratorium" value={l.moratorium} />
          <Field label="Processing fee" value={l.processingFeePct} />
        </dl>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-2">
          <Link
            href="/loan-portal"
            className="flex-1 inline-flex items-center justify-center gap-1 text-white text-sm font-bold px-5 py-3 rounded-lg transition-opacity hover:opacity-90"
            style={{ background: l.logoColor }}
          >
            💬 Get help applying →
          </Link>
          <a
            href={l.officialUrl} target="_blank" rel="noopener nofollow sponsored"
            className="flex-1 inline-flex items-center justify-center text-sm font-semibold px-5 py-3 rounded-lg border-2 transition-colors hover:bg-gray-50"
            style={{ borderColor: l.logoColor, color: l.logoColor }}
          >
            {l.applyCtaLabel} ↗
          </a>
          {l.ourReviewSlug && (
            <Link
              href={`/education-loan/${l.ourReviewSlug}`}
              className="flex-1 inline-flex items-center justify-center text-sm text-gray-600 hover:text-brand font-semibold px-5 py-3 rounded-lg border-2 border-gray-200 transition-colors hover:border-brand"
            >
              Full review →
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-0.5">{label}</dt>
      <dd className="text-sm sm:text-base font-extrabold text-gray-900">{value}</dd>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-2 border-b border-gray-100 pb-1.5">
      <dt className="text-xs text-gray-500">{label}</dt>
      <dd className="text-xs font-semibold text-gray-800 text-right">{value}</dd>
    </div>
  );
}
