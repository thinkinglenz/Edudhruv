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

  // Group by country for visual organisation
  const byCountry: Record<string, typeof all> = {};
  for (const s of all) {
    if (!byCountry[s.country]) byCountry[s.country] = [];
    byCountry[s.country].push(s);
  }
  const countries = Object.keys(byCountry).sort();

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
            <strong>{all.length}+ active scholarships</strong> across {countries.length} countries,
            verified daily from official university sources.
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
            <Stat icon="🌍" value={countries.length}    label="Countries" />
            <Stat icon="💯" value="100%"                 label="Fully funded" />
            <Stat icon="🇮🇳" value="Indian"              label="Students eligible" />
          </div>

          {/* By country */}
          {countries.map(country => (
            <section key={country}>
              <h2 className="flex items-center gap-3 text-2xl font-extrabold text-gray-900 mb-5 pb-3 border-b-2"
                  style={{ borderColor: "#3AAFE5" }}>
                <span className="text-3xl">{getCountryFlag(country)}</span>
                {country}
                <span className="text-base font-normal text-gray-400">
                  ({byCountry[country].length} scholarship{byCountry[country].length !== 1 ? "s" : ""})
                </span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {byCountry[country].map(s => {
                  const days = daysUntil(s.application_deadline);
                  const urgent = days !== null && days >= 0 && days <= 30;
                  const expired = days !== null && days < 0;
                  const color = brandColor(s.university_name);
                  const href = s.post_slug ? `/scholarship/${s.post_slug}` : "#";

                  return (
                    <Link key={s.id} href={href}
                      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all">
                      <div className="h-24 flex items-center justify-center relative"
                           style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}>
                        <div className="text-white text-3xl font-extrabold drop-shadow">
                          {getInitials(s.university_name)}
                        </div>
                        <span className="absolute top-2 right-2 bg-white text-[10px] font-extrabold px-2 py-0.5 rounded-full"
                              style={{ color: "#F5A71A" }}>
                          💯 FULLY FUNDED
                        </span>
                      </div>
                      <div className="p-5">
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                          {s.university_name}
                        </p>
                        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-brand">
                          {s.scholarship_name}
                        </h3>
                        {s.amount_inr && <p className="text-sm text-gray-700 mb-2">💰 {s.amount_inr}</p>}
                        <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-100 mt-2">
                          <span className={`font-bold ${expired ? "text-gray-400 line-through" : urgent ? "text-red-500" : "text-gray-700"}`}>
                            {formatDeadline(s.application_deadline)}
                          </span>
                          {days !== null && days >= 0 && (
                            <span className={`px-2 py-0.5 rounded-lg font-bold ${urgent ? "bg-red-50 text-red-600" : "bg-blue-50"}`}
                                  style={!urgent ? { color: "#3AAFE5" } : {}}>
                              {days === 0 ? "Today!" : `${days}d left`}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
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
