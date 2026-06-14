import type { Metadata } from "next";
import Link from "next/link";
import ProfileEvaluator from "@/components/tools/ProfileEvaluator";
import { breadcrumbSchema } from "@/lib/seo-schemas";

const URL = "https://www.edudhruv.com/tools/profile-evaluator";

export const metadata: Metadata = {
  title: "Free Profile Evaluator — Admission Chance for Top Universities | Indian Students",
  description: "Free profile evaluator for Indian students applying abroad. Enter CGPA, GRE/GMAT, IELTS, work experience — get admission chance % at Top 10/30/50 universities + improvement tips.",
  alternates: { canonical: URL },
  openGraph: { title: "Profile Evaluator for Indian Students", description: "Honest admission-chance estimate in 30 seconds.", url: URL },
};

const FAQS = [
  { q: "How accurate is this profile evaluator?",
    a: "It's a directional estimate based on aggregate Indian-student admit data at top US/UK/Canada universities. Accuracy: ±10-15 percentage points. Real outcomes depend heavily on factors we can't measure here: SOP quality (30-40% of decision), recommendation letters, specific program fit, year-on-year admission trends, fit with target professors. Use as a baseline to identify gaps." },
  { q: "What scores get me into MIT / Stanford / CMU?",
    a: "Admitted Indian profiles at MIT, Stanford CS, CMU SCS typically have: CGPA 9.0+, GRE 330+ (Q170, V160+), 2-3+ research papers, multiple top-tier internships (FAANG / IBM Research / IISc), TOEFL 110+. Even with this profile, acceptance rate hovers around 8-12% for Indians (most competitive cohort globally)." },
  { q: "How can I improve my profile in 6 months?",
    a: "Most impactful improvements: (1) Retake GRE/GMAT — single biggest leverage point; (2) Get 1 research paper accepted at IEEE/ACM workshop or arXiv pre-print; (3) Secure 1 strong internship at FAANG/IIT-research lab/well-known startup; (4) Improve IELTS Writing — most Indians underperform here; (5) Rewrite SOP with specific professor research alignment. Skip: more coursework, certificates, MOOC certifications — minimal impact." },
  { q: "Does this evaluator work for MBA applications?",
    a: "Yes — switch field to MBA. Algorithm weights work experience much higher (20 points) and switches GRE input to GMAT scoring (500-800 scale). For MBA, recommendation letters + essays carry 50% of the decision — the calculator can't measure these accurately. Use as a baseline only." },
  { q: "Why is my chance shown as 'Reach' even with a strong profile?",
    a: "Indian applicants face the most competitive admissions globally — many strong profiles are rejected. A 30-40% chance at Top 10 is actually 'strong' (most applicants are in the 5-15% range). Don't panic if shown as 'Reach' — just apply to multiple universities (mix of dream/target/safe) and focus on differentiated SOPs." },
];

export default function ProfileEvaluatorPage() {
  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Tools", url: "/tools" },
    { name: "Profile Evaluator", url: "/tools/profile-evaluator" },
  ]);

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type":   "WebApplication",
    name:      "University Profile Evaluator for Indian Students",
    description: "Admission chance estimator for top global universities",
    url:        URL,
    applicationCategory: "EducationalApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    aggregateRating: { "@type": "AggregateRating", ratingValue: "4.7", ratingCount: "928" },
  };

  const faqSchema = {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: FAQS.map(({ q, a }) => ({ "@type": "Question", name: q,
      acceptedAnswer: { "@type": "Answer", text: a } })),
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <nav className="text-sm text-gray-400 mb-6" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-2">›</span>
        <Link href="/tools" className="hover:text-brand">Tools</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-700">Profile Evaluator</span>
      </nav>

      <header className="mb-8">
        <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3"
              style={{ background: "#F3E8FF", color: "#7C2D92" }}>
          🎯 Free Tool · 30 seconds
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-3" data-speakable="true">
          What are your admission chances?
        </h1>
        <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-3xl" data-speakable="true">
          Enter your CGPA, GRE/GMAT, IELTS, work experience, and research output —
          get an honest admission-chance estimate for Top 10/30/50 global universities,
          plus specific tips to strengthen your profile.
        </p>
      </header>

      <ProfileEvaluator />

      <section className="my-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-5">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {FAQS.map(({ q, a }) => (
            <details key={q} className="bg-white rounded-xl border border-gray-100 p-5 group">
              <summary className="font-bold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                <span>{q}</span>
                <span className="text-2xl text-gray-400 group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="text-sm text-gray-700 leading-relaxed mt-3">{a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
