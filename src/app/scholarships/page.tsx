import type { Metadata } from "next";
import Link from "next/link";
import { getActiveScholarships, daysUntil } from "@/lib/scholarships";
import ScholarshipCard from "@/components/scholarships/ScholarshipCard";

export const metadata: Metadata = {
  title: "100% Funded Scholarships at Top Universities for Indian Students",
  description: "Browse verified 100% funded scholarships at top universities worldwide. Stanford, MIT, Oxford, Cambridge and more — updated daily for Indian students.",
  alternates: { canonical: "https://www.edudhruv.com/scholarships" },
};

export const revalidate = 600; // 10 min cache

export default async function ScholarshipsIndexPage() {
  const all = await getActiveScholarships();

  // Sort by soonest upcoming deadline first (rolling/no-deadline go last),
  // so the most actionable scholarships lead. Flat grid — no grouping — so
  // there are never empty columns.
  const sorted = [...all].sort((a, b) => {
    const da = daysUntil(a.application_deadline);
    const db = daysUntil(b.application_deadline);
    const av = da === null || da < 0 ? Infinity : da;
    const bv = db === null || db < 0 ? Infinity : db;
    return av - bv;
  });

  const universityCount = new Set(all.map(s => s.university_name)).size;
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
            <strong>{all.length}+ active scholarships</strong> at {universityCount} top universities
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-10">
          {/* Stats strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Stat icon="🎓" value={`${all.length}+`}    label="Active scholarships" />
            <Stat icon="🏛️" value={universityCount}     label="Universities" />
            <Stat icon="💯" value="100%"                 label="Fully funded" />
            <Stat icon="🇮🇳" value="Indian"              label="Students eligible" />
          </div>

          {/* Flat responsive grid — fills cleanly, no blank columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sorted.map(s => <ScholarshipCard key={s.id} s={s} />)}
          </div>
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
