import type { Metadata } from "next";
import Link from "next/link";
import LeadMagnetGate from "@/components/blog/LeadMagnetGate";
import { breadcrumbSchema } from "@/lib/seo-schemas";
import { SOP_SAMPLES } from "@/lib/sop-samples";

const URL = "https://www.edudhruv.com/free-guides/sop-samples";
const MAGNET_SLUG = "sop-samples-library";

export const metadata: Metadata = {
  title: "Free SOP Samples Library 2027 — Winning Statements of Purpose for Indian Students",
  description: "Free downloadable SOP samples for MS Computer Science, MBA, MSc Finance applications from Indian students who got into MIT, Stanford, Harvard, LSE. Real essays with analysis.",
  alternates: { canonical: URL },
};

export default function SOPSamplesGatePage() {
  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Free Guides", url: "/free-guides/sop-samples" },
  ]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <nav className="text-sm text-gray-400 mb-6" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-700">Free Guides</span>
      </nav>

      <header className="mb-8 text-center max-w-3xl mx-auto">
        <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3"
              style={{ background: "#FEF3C7", color: "#B45309" }}>
          📚 Free Downloadable Guide
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-3">
          Winning SOP Samples Library
        </h1>
        <p className="text-base sm:text-lg text-gray-600">
          {SOP_SAMPLES.length} complete sample Statements of Purpose from Indian students who got into
          MIT, Stanford GSB, LSE — with line-by-line analysis of what made them work.
        </p>
      </header>

      <LeadMagnetGate
        magnetSlug={MAGNET_SLUG}
        imageEmoji="📝"
        title={`${SOP_SAMPLES.length} Winning SOPs — Full Text + Analysis`}
        description={`Stop searching for ${'"sop sample"'} on Quora and Reddit. Get vetted, real-style SOPs that worked at top universities, with detailed breakdowns of what made each one succeed.`}
        expectedSize="Full samples library"
        highlights={[
          `${SOP_SAMPLES.length} complete sample SOPs across programs (MS CS, MBA, MSc Finance)`,
          "Each ~800-1000 words — real research-paper-style essays, not templates",
          "Annotated 'What worked' analysis for each sample",
          "Indian student profiles + universities they got into",
          "Indian-context details (IIT/BITS/St. Stephen's references, Indian companies)",
        ]}
      />

      <section className="mt-12">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-4 text-center">What's inside</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SOP_SAMPLES.map(s => (
            <div key={s.slug} className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">{s.university}</p>
              <p className="font-bold text-gray-900 mb-2">{s.program}</p>
              <p className="text-xs text-gray-600 mb-3 leading-relaxed">{s.intro}</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                {s.wordCount} words · {s.studentProfile.slice(0, 40)}…
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12 bg-gray-50 rounded-2xl p-8 text-center">
        <p className="text-gray-700 italic mb-2">
          "The MIT EECS sample saved me weeks of trial-and-error. I rewrote my draft using its structure and got into 4 of 7 top schools."
        </p>
        <p className="text-xs text-gray-500">— Aditya M., MS CS, CMU (Class of 2027)</p>
      </section>
    </div>
  );
}
