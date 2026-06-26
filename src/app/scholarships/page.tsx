import type { Metadata } from "next";
import Link from "next/link";
import { getActiveScholarships, getCountryFlag, getInitials, daysUntil } from "@/lib/scholarships";

export const metadata: Metadata = {
  title: "100% Funded Scholarships at Top Universities for Indian Students",
  description: "Browse verified 100% funded scholarships at top universities worldwide. Stanford, MIT, Oxford, Cambridge and more — updated daily for Indian students.",
  alternates: { canonical: "https://www.edudhruv.com/scholarships" },
};

export const revalidate = 600; // 10 min cache

function formatDeadline(iso: string | null): string {
  if (!iso) return "Rolling";
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function brandColor(name: string): string {
  const palette = ["#3AAFE5", "#F5A71A", "#10B981", "#8B5CF6", "#EF4444", "#06B6D4", "#EC4899"];
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return palette[h % palette.length];
}

export default async function ScholarshipsIndexPage() {
  const all = await getActiveScholarships();

  // ── Group by UNIVERSITY — university is the hero of each section ──
  const byUniversity: Record<string, typeof all> = {};
  for (const s of all) {
    if (!byUniversity[s.university_name]) byUniversity[s.university_name] = [];
    byUniversity[s.university_name].push(s);
  }
  // Sort universities alphabetically; keeps a stable, scannable order.
  const universities = Object.keys(byUniversity).sort((a, b) => a.localeCompare(b));
  const countryCount = new Set(all.map(s => s.country)).size;

  return (
    <div>
      {/* ── Hero ────────────────────────────────────────────────── */}
      <section
        className="py-12 sm:py-16 px-4 text-center text-white"
        style={{ background: "linear-gradient(135deg, #3AAFE5 0%, #F5A71A 100%)" }}
      >
        <div className="max-w-3xl mx-auto">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-3 bg-white/20">
            💯 100% Funded
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold mb-3 leading-tight">
            Fully Funded Scholarships<br />
            <span className="text-white/90">For Indian Students Worldwide</span>
          </h1>
          <p className="text-base sm:text-lg text-white/85">
            <strong>{all.length}+ active scholarships</strong> at {universities.length} top universities
            across {countryCount} countries, verified daily from official sources.
          </p>
        </div>
      </section>

      {/* ── No scholarships state ─────────────────────────────── */}
      {all.length === 0 ? (
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <p className="text-5xl mb-3">🌱</p>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Scholarships incoming!</h2>
          <p className="text-gray-500 mb-6">
            Our research agent finds and verifies a new 100% funded scholarship every day.
            Check back in a few hours, or browse our scholarship guides.
          </p>
          <Link href="/scholarship" className="inline-block bg-brand text-white font-semibold px-6 py-3 rounded-xl"
                style={{ background: "#3AAFE5" }}>
            Browse Scholarship Guides →
          </Link>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-12">
          {/* Stats strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Stat icon="🎓" value={`${all.length}+`}    label="Active scholarships" />
            <Stat icon="🏛️" value={universities.length} label="Universities" />
            <Stat icon="💯" value="100%"                 label="Fully funded" />
            <Stat icon="🇮🇳" value="Indian"              label="Students eligible" />
          </div>

          {/* ── By university — university name is the heading & hero ── */}
          {universities.map(university => {
            const rows = byUniversity[university];
            const country = rows[0].country;
            const color = brandColor(university);

            return (
              <section key={university}>
                {/* University heading — the hero of this section */}
                <div className="mb-5 pb-3 border-b-2" style={{ borderColor: color }}>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span
                      className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-white text-base font-extrabold shadow-sm"
                      style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}
                    >
                      {getInitials(university)}
                    </span>
                    <div className="min-w-0">
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
                        {university}
                      </h2>
                      <p className="text-sm font-medium text-gray-500 flex items-center gap-2">
                        <span>{getCountryFlag(country)} {country}</span>
                        <span className="text-gray-300">·</span>
                        <span>{rows.length} scholarship{rows.length !== 1 ? "s" : ""}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Scholarship cards for this university */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {rows.map(s => {
                    const days = daysUntil(s.application_deadline);
                    const urgent = days !== null && days >= 0 && days <= 30;
                    const expired = days !== null && days < 0;
                    const href = s.post_slug ? `/scholarship/${s.post_slug}` : "#";
                    const courses = (s.courses_covered || []).slice(0, 3);

                    return (
                      <Link key={s.id} href={href}
                        className="group flex flex-col bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:border-gray-200 transition-all">
                        {/* Badges */}
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full"
                                style={{ background: "#FEF3E2", color: "#F5A71A" }}>
                            💯 FULLY FUNDED
                          </span>
                          {s.coverage_percentage > 0 && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-600">
                              {s.coverage_percentage}% coverage
                            </span>
                          )}
                        </div>

                        {/* Scholarship name */}
                        <h3 className="font-bold text-lg text-gray-900 mb-2 leading-snug group-hover:text-brand">
                          {s.scholarship_name}
                        </h3>

                        {/* Amount */}
                        {s.amount_inr && (
                          <p className="text-sm font-semibold text-gray-800 mb-2 flex items-start gap-1.5">
                            <span>💰</span>
                            <span>{s.amount_inr}</span>
                          </p>
                        )}

                        {/* Eligibility */}
                        {s.eligibility_summary && (
                          <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                            {s.eligibility_summary}
                          </p>
                        )}

                        {/* Course chips */}
                        {courses.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {courses.map((c, i) => (
                              <span key={i} className="text-[11px] px-2 py-0.5 rounded-md bg-gray-50 text-gray-600 border border-gray-100">
                                {c}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Footer: deadline + intake + days left */}
                        <div className="flex items-center justify-between text-xs pt-3 border-t border-gray-100 mt-auto">
                          <span className="flex items-center gap-2">
                            <span className={`font-bold ${expired ? "text-gray-400 line-through" : urgent ? "text-red-500" : "text-gray-700"}`}>
                              {formatDeadline(s.application_deadline)}
                            </span>
                            {s.intake && <span className="text-gray-400">· {s.intake}</span>}
                          </span>
                          {days !== null && days >= 0 && (
                            <span className={`px-2 py-0.5 rounded-lg font-bold ${urgent ? "bg-red-50 text-red-600" : "bg-blue-50"}`}
                                  style={!urgent ? { color: "#3AAFE5" } : {}}>
                              {days === 0 ? "Today!" : `${days}d left`}
                            </span>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-4 pb-16 text-center">
        <div className="rounded-2xl border-2 p-8" style={{ borderColor: "#3AAFE5", background: "#EBF7FD" }}>
          <h2 className="text-xl font-bold mb-2" style={{ color: "#3AAFE5" }}>
            🎓 Need help shortlisting?
          </h2>
          <p className="text-gray-600 text-sm mb-5">
            Chat with Priya — our AI counsellor — to find scholarships matched to your profile,
            course, and budget.
          </p>
          <Link href="/loan-portal"
            className="inline-block text-white font-bold px-7 py-3 rounded-xl shadow"
            style={{ background: "#3AAFE5" }}>
            Chat with Priya →
          </Link>
        </div>
      </section>
    </div>
  );
}

function Stat({ icon, value, label }: { icon: string; value: string | number; label: string }) {
  return (
    <div className="text-center p-4 rounded-xl border border-gray-100 bg-white">
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-2xl font-extrabold" style={{ color: "#3AAFE5" }}>{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-gray-400">{label}</div>
    </div>
  );
}
