import type { Metadata } from "next";
import Link from "next/link";
import CountryMatchQuiz from "@/components/tools/CountryMatchQuiz";
import EmbedBox from "@/components/tools/EmbedBox";
import { breadcrumbSchema } from "@/lib/seo-schemas";

const URL = "https://www.edudhruv.com/tools/country-match-quiz";

export const metadata: Metadata = {
  title: "Which Country Should I Study In? — Free Quiz for Indian Students",
  description:
    "Not sure whether to study in the UK, USA, Canada, Australia, Germany or Ireland? Take this free 3-question quiz to find the best study-abroad destination for your budget, goals and field.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Which Country Should I Study Abroad In? — Free Quiz",
    description: "Find your best study-abroad destination in 30 seconds — by budget, work goals and field.",
    url: URL, type: "website",
    images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: "EduDhruv Country Match Quiz" }],
  },
  twitter: { card: "summary_large_image", images: ["/og-default.jpg"] },
};

const FAQS = [
  { q: "Which country is best for Indian students to study abroad?", a: "It depends on your budget and goals. Canada and Australia offer strong post-study work rights; the UK has top rankings and a 1-year master's; Germany has low/no tuition; the USA has the highest-ranked universities. Our quiz suggests the best fit for your specific priorities." },
  { q: "Which is the cheapest country to study abroad?", a: "Germany is often cheapest — many public universities charge little or no tuition, though living costs apply. Other affordable options include parts of Europe and, relative to the US/UK, Canada and Ireland. Use our quiz and cost calculator to compare." },
  { q: "Which country has the best post-study work visa?", a: "Canada (up to a 3-year PGWP), Australia (2–4 years), the UK (2-year Graduate Route) and Germany (18-month job-seeker) are among the most generous. If working after graduation is your priority, the quiz weights these highly." },
];

export default function CountryMatchQuizPage() {
  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: "/" }, { name: "Tools", url: "/tools" }, { name: "Country Match Quiz", url: "/tools/country-match-quiz" },
  ]);
  const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: FAQS.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <nav className="text-sm text-gray-400 mb-6" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link><span className="mx-2">›</span>
        <Link href="/tools" className="hover:text-brand">Tools</Link><span className="mx-2">›</span>
        <span className="text-gray-700">Country Match Quiz</span>
      </nav>
      <header className="mb-8 text-center">
        <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3" style={{ background: "#EBF7FD", color: "#3AAFE5" }}>🌍 Free Quiz · 30 Seconds</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-3">Which Country Should I Study In?</h1>
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">Answer 3 quick questions and we'll suggest the study-abroad destinations that fit your budget, goals and field.</p>
      </header>
      <CountryMatchQuiz />
      <EmbedBox embedUrl="https://www.edudhruv.com/embed/country-match-quiz" toolUrl={URL} title="Country Match Quiz" height={640} />
      <section className="my-12">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-5">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {FAQS.map(({ q, a }) => (
            <details key={q} className="bg-white rounded-xl border border-gray-100 p-5 group">
              <summary className="font-bold text-gray-900 cursor-pointer list-none flex items-center justify-between"><span>{q}</span><span className="text-2xl text-gray-400 group-open:rotate-45 transition-transform">+</span></summary>
              <p className="text-sm text-gray-700 leading-relaxed mt-3">{a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
