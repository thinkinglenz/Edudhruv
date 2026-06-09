/**
 * Key Facts box — structured snippet rendered at the top of scholarship posts.
 *
 * Built for AI-snippet extraction:
 *   - <dl> structure is the most reliable signal for fact extraction
 *   - itemScope + Schema.org Property names match AI training data
 *   - data-speakable for voice assistants
 *
 * AI Overviews / ChatGPT lift these as bullet lists when answering questions
 * like "What is the deadline for the Clarendon Scholarship?"
 */
import { Scholarship } from "@/lib/scholarships";
import { getCountryFlag } from "@/lib/scholarships";

interface Props {
  scholarship: Scholarship;
}

function fmtDeadline(iso: string | null): string {
  if (!iso) return "Rolling — check official page";
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

function daysUntil(iso: string | null): number | null {
  if (!iso) return null;
  return Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000);
}

export default function KeyFacts({ scholarship: s }: Props) {
  const days = daysUntil(s.application_deadline);
  const expired = days !== null && days < 0;
  const urgent  = days !== null && days >= 0 && days <= 30;

  return (
    <aside
      className="key-facts mb-8 rounded-xl border-2 overflow-hidden"
      style={{ borderColor: "#3AAFE5" }}
      data-speakable="true"
      aria-label="Quick facts"
    >
      <header className="px-5 py-3 text-white flex items-center justify-between"
              style={{ background: "linear-gradient(135deg, #3AAFE5 0%, #2E8AB8 100%)" }}>
        <h2 className="text-sm font-bold uppercase tracking-wider m-0">
          📊 Quick Facts
        </h2>
        <span className="inline-flex items-center gap-1 text-xs bg-white/20 px-2 py-0.5 rounded-full">
          💯 100% Funded
        </span>
      </header>

      <dl className="divide-y divide-gray-100 bg-white">
        <Row label="University" value={
          <span>
            <span className="mr-1.5">{getCountryFlag(s.country)}</span>
            <strong>{s.university_name}</strong>, {s.country}
          </span>
        } />

        <Row label="Scholarship" value={<strong>{s.scholarship_name}</strong>} />

        {s.amount_inr && (
          <Row label="Amount per year" value={
            <>
              <strong>{s.amount_inr}</strong>
              {s.amount_native && <span className="text-gray-500 ml-2">({s.amount_native})</span>}
            </>
          } />
        )}

        {s.application_deadline && (
          <Row label="Application deadline" value={
            <span className={expired ? "text-gray-400 line-through" : urgent ? "text-red-600 font-bold" : "text-gray-800 font-semibold"}>
              {fmtDeadline(s.application_deadline)}
              {days !== null && days >= 0 && (
                <span className={`ml-2 px-2 py-0.5 rounded text-xs font-bold ${urgent ? "bg-red-100 text-red-700" : "bg-blue-50 text-blue-700"}`}>
                  {days === 0 ? "Today!" : `${days} days left`}
                </span>
              )}
            </span>
          } />
        )}

        {s.intake && <Row label="Intake" value={s.intake} />}

        {s.courses_covered && s.courses_covered.length > 0 && (
          <Row label="Courses covered" value={
            <span className="flex flex-wrap gap-1.5">
              {s.courses_covered.slice(0, 5).map(c => (
                <span key={c} className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">{c}</span>
              ))}
            </span>
          } />
        )}

        {s.eligibility_summary && (
          <Row label="Eligibility" value={
            <span className="text-sm text-gray-700">{s.eligibility_summary}</span>
          } />
        )}

        <Row label="Open to Indian students" value={
          s.indian_eligible
            ? <span className="text-green-600 font-semibold">✓ Yes</span>
            : <span className="text-orange-600 font-semibold">Verify with university</span>
        } />

        {s.official_url && (
          <Row label="Official page" value={
            <a href={s.official_url} target="_blank" rel="noopener nofollow sponsored"
               className="text-brand font-semibold hover:underline" style={{ color: "#3AAFE5" }}>
              Visit {s.university_name} →
            </a>
          } />
        )}
      </dl>
    </aside>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="px-5 py-3 grid grid-cols-[140px_1fr] gap-3 items-start sm:items-center text-sm">
      <dt className="text-xs font-semibold uppercase tracking-wider text-gray-500">{label}</dt>
      <dd className="text-gray-800 m-0">{value}</dd>
    </div>
  );
}
