import Link from "next/link";
import type { Scholarship } from "@/lib/scholarships";
import { getCountryFlag, getInitials, daysUntil } from "@/lib/scholarships";

// Shared scholarship card — used on the homepage widget AND the /scholarships
// index so both stay visually identical. Colorful gradient header keyed to the
// university name, with the university shown prominently in the body.

function brandColorFor(name: string): string {
  const palette = ["#3AAFE5", "#F5A71A", "#10B981", "#8B5CF6", "#EF4444", "#06B6D4", "#EC4899", "#A855F7"];
  let hash = 0;
  for (const c of name) hash = (hash * 31 + c.charCodeAt(0)) >>> 0;
  return palette[hash % palette.length];
}

function formatDeadline(dateStr: string | null): string {
  if (!dateStr) return "Rolling deadline";
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function ScholarshipCard({ s }: { s: Scholarship }) {
  const days = daysUntil(s.application_deadline);
  const isUrgent = days !== null && days >= 0 && days <= 30;
  const expired = days !== null && days < 0;
  const color = brandColorFor(s.university_name);
  const href = s.post_slug ? `/scholarship/${s.post_slug}` : "#";

  return (
    <Link
      href={href}
      className="group flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all hover:-translate-y-0.5"
    >
      {/* Header — gradient banner with university initial */}
      <div className="relative h-24 flex items-center justify-center"
           style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)` }}>
        <div className="text-white text-3xl font-extrabold drop-shadow">
          {getInitials(s.university_name)}
        </div>
        <div className="absolute top-2 right-2 bg-white text-xs font-extrabold px-2 py-0.5 rounded-full shadow-sm"
             style={{ color: "#F5A71A" }}>
          💯 FULLY FUNDED
        </div>
        <div className="absolute top-2 left-2 text-lg">
          {getCountryFlag(s.country)}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
          {s.university_name}
        </p>
        <h3 className="font-bold text-gray-900 text-base leading-snug mb-2 line-clamp-2 group-hover:text-brand">
          {s.scholarship_name}
        </h3>

        {s.amount_inr && (
          <p className="text-sm text-gray-700 mb-3">
            💰 <strong>{s.amount_inr}</strong>
          </p>
        )}

        {s.courses_covered && s.courses_covered.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {s.courses_covered.slice(0, 2).map(c => (
              <span key={c} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                {c}
              </span>
            ))}
            {s.courses_covered.length > 2 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                +{s.courses_covered.length - 2} more
              </span>
            )}
          </div>
        )}

        {/* Deadline footer — pinned to the bottom so cards align */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-gray-400">Apply by</p>
            <p className={`text-sm font-bold ${
              expired ? "text-gray-400 line-through" : isUrgent ? "text-red-500" : "text-gray-700"
            }`}>
              {formatDeadline(s.application_deadline)}
            </p>
          </div>
          {days !== null && days >= 0 && (
            <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
              isUrgent ? "bg-red-50 text-red-600" : "bg-blue-50"
            }`} style={!isUrgent ? { color: "#3AAFE5" } : {}}>
              {days === 0 ? "Today!" : `${days} days left`}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
