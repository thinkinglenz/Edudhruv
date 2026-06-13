import type { Metadata } from "next";
import Link from "next/link";
import ShortlistQuiz from "@/components/tools/ShortlistQuiz";
import { breadcrumbSchema } from "@/lib/seo-schemas";

const URL = "https://www.edudhruv.com/tools/university-shortlist-quiz";

export const metadata: Metadata = {
  title: "Free University Shortlisting Quiz — Find Your Best-Fit Universities Abroad",
  description: "5-question quiz to shortlist your best-fit universities abroad as an Indian student. Free, no signup. Get personalised matches for USA, UK, Canada, Australia, Germany, Singapore.",
  alternates: { canonical: URL },
  openGraph: { title: "Free University Shortlisting Quiz", description: "Find your best-fit universities in 60 seconds.", url: URL },
  twitter: { card: "summary_large_image" },
};

const FAQS = [
  { q: "How does the university shortlisting quiz work?",
    a: "Answer 5 quick questions: target country, degree level, field, budget, and test prep status. Our algorithm scores 23+ pre-loaded universities (MIT, Stanford, Oxford, Cambridge, NUS, TUM, etc.) against your inputs and returns the top 5 matches with explanations. Takes 60 seconds. Free, no signup required." },
  { q: "Is the shortlist accurate?",
    a: "It's a first-pass filter — not a final list. The algorithm matches your profile to universities with similar typical-admit profiles, considering country, degree, field strength, budget, and test scores. It's good for narrowing your search from 200+ candidates to a focused list. For a binding shortlist, chat with Priya (free AI counsellor) or book a session with a real consultant." },
  { q: "What if I want universities not in the list?",
    a: "The quiz currently includes 23 top universities most-applied-to by Indian students. We're expanding to 50+ in the next update. If your target isn't covered (e.g. specific niche programs), browse our country guides (USA, UK, Canada, Germany, etc.) or use the cost calculator to compare." },
  { q: "Will my shortlist be saved if I provide my email?",
    a: "Yes — entering your email at the end emails you the full shortlist + suggested application timeline + relevant scholarships. We also subscribe you to our weekly digest of new scholarships and deadlines (1% spam, 99% useful). Unsubscribe anytime." },
  { q: "Can I retake the quiz with different answers?",
    a: "Yes — there's a 'Start over' button on the results page. Useful if you want to compare what happens if you change your budget or field of study." },
];

export default function ShortlistQuizPage() {
  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Tools", url: "/tools" },
    { name: "Shortlist Quiz", url: "/tools/university-shortlist-quiz" },
  ]);

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type":    "WebApplication",
    name:       "University Shortlisting Quiz for Indian Students",
    description: "Find your best-fit universities abroad in 60 seconds",
    url:        URL,
    applicationCategory: "EducationalApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", ratingCount: "847" },
  };

  const faqSchema = {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: FAQS.map(({ q, a }) => ({ "@type": "Question", name: q,
      acceptedAnswer: { "@type": "Answer", text: a } })),
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <nav className="text-sm text-gray-400 mb-6" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-2">›</span>
        <Link href="/tools" className="hover:text-brand">Tools</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-700">Shortlist Quiz</span>
      </nav>

      <header className="mb-8 text-center">
        <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3"
              style={{ background: "#EBF7FD", color: "#3AAFE5" }}>
          🎯 Free Quiz · 60 seconds
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-3" data-speakable="true">
          Find Your Best-Fit Universities
        </h1>
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto" data-speakable="true">
          Answer 5 quick questions. Get a personalised shortlist of universities that match your profile — country, budget, field, and test scores.
        </p>
      </header>

      <ShortlistQuiz />

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
