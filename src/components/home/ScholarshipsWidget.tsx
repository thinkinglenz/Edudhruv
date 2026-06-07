import Link from "next/link";
import type { Scholarship } from "@/lib/scholarships";
import { getCountryFlag, getInitials, daysUntil } from "@/lib/scholarships";

interface Props {
  scholarships: Scholarship[];
}

function brandColorFor(name: string): string {
  // Stable color per university based on name hash
  const palette = ["#3AAFE5", "#F5A71A", "#10B981", "#8B5CF6", "#EF4444", "#06B6D4", "#EC4899", "#A855F7"];
  let hash = 0;
  for (const c of name) hash = (hash * 31 + c.charCodeAt(0)) >>> 0;
  return palette[hash % palette.length];
}

function formatDeadline(dateStr: string | null): string {
  if (!dateStr) return "Rolling deadline";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function ScholarshipsWidget({ scholarships }: Props) {
  if (!scholarships || scholarships.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
        <div>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-2"
                style={{ background: "#FEF3D9", color: "#F5A71A" }}>
            💯 100% Funded
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold" style={{ color: "#333" }}>
            Latest Scholarships at Top Universities
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Fully-funded scholarships open to Indian students — verified daily
          </p>
        </div>
        <Link
          href="/scholarships"
          className="text-sm font-bold hover:underline whitespace-nowrap flex items-center gap-1"
          style={{ color: "#3AAFE5" }}
        >
          View all scholarships →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {scholarships.slice(0, 6).map((s) => {
          const days = daysUntil(s.application_deadline);
          const isUrgent = days !== null && days >= 0 && days <= 30;
          const expired  = days !== null && days < 0;
          const color    = brandColorFor(s.university_name);
          const href     = s.post_slug ? `/scholarship/${s.post_slug}` : "#";

          return (
            <Link
              key={s.id}
              href={href}
              className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all hover:-translate-y-0.5"
            >
              {/* Header — gradient banner with university initial */}
              <div className="relative h-24 flex items-center justify-center"
                   style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)` }}>
                <div className="text-white">
                  <div className="text-3xl font-extrabold drop-shadow">
                    {getInitials(s.university_name)}
                  </div>
                </div>
                {/* 100% badge */}
                <div className="absolute top-2 right-2 bg-white text-xs font-extrabold px-2 py-0.5 rounded-full shadow-sm"
                     style={{ color: "#F5A71A" }}>
                  💯 FULLY FUNDED
                </div>
                {/* Country flag */}
                <div className="absolute top-2 left-2 text-lg">
                  {getCountryFlag(s.country)}
                </div>
              </div>

              {/* Body */}
              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                  {s.university_name}
                </p>
                <h3 className="font-bold text-gray-900 text-base leading-snug mb-2 line-clamp-2 group-hover:text-brand">
                  {s.scholarship_name}
                </h3>

                {/* Amount */}
                {s.amount_inr && (
                  <p className="text-sm text-gray-700 mb-3">
                    💰 <strong>{s.amount_inr}</strong>
                  </p>
                )}

                {/* Courses */}
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

                {/* Deadline footer */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-2">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-gray-400">Apply by</p>
                    <p className={`text-sm font-bold ${
                      expired ? "text-gray-400 line-through" :
                      isUrgent ? "text-red-500" :
                      "text-gray-700"
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
        })}
      </div>

      <p className="text-center text-xs text-gray-400 mt-6">
        💡 New 100% scholarship added every day. Bookmark this page or{" "}
        <Link href="/loan-portal" className="font-semibold hover:underline" style={{ color: "#3AAFE5" }}>
          chat with Priya
        </Link>{" "}
        to get personalised matches.
      </p>
    </section>
  );
}
