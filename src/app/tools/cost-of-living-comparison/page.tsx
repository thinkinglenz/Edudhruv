import type { Metadata } from "next";
import Link from "next/link";
import CostOfLivingComparison from "@/components/tools/CostOfLivingComparison";
import EmbedBox from "@/components/tools/EmbedBox";
import { breadcrumbSchema } from "@/lib/seo-schemas";

const URL = "https://www.edudhruv.com/tools/cost-of-living-comparison";

export const metadata: Metadata = {
  title: "Cost of Living Comparison — Study Abroad Destinations (Free)",
  description:
    "Compare monthly student living costs across the UK, USA, Canada, Australia, Germany and Ireland — rent, food, transport and more, side by side in INR. Free tool for Indian students.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Cost of Living Comparison — Study Abroad (in INR)",
    description: "Compare monthly living costs across study destinations side by side. Free, no signup.",
    url: URL, type: "website",
    images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: "EduDhruv Cost of Living Comparison" }],
  },
  twitter: { card: "summary_large_image", images: ["/og-default.jpg"] },
};

const FAQS = [
  { q: "Which country has the lowest cost of living for students?", a: "Among popular destinations, Germany is usually the most affordable — lower rent and no/low tuition at public universities. Canada and Australia sit in the middle, while the UK and USA (especially London/major cities) are the most expensive. Compare exact figures with the tool above." },
  { q: "How much money do I need per month to study abroad?", a: "As a rough guide, budget roughly ₹75,000–₹90,000/month in Germany, ₹85,000–₹1,00,000 in Canada, and ₹1,00,000–₹1,20,000+ in the UK/USA/Ireland for living costs (excluding tuition). City matters a lot — London or New York cost far more than smaller towns." },
  { q: "Does this include tuition fees?", a: "No — this tool compares living costs only (rent, food, transport, utilities). Tuition varies hugely by university and program. Use our education-loan EMI and cost-of-studying calculators to plan the full budget." },
];

export default function CostOfLivingComparisonPage() {
  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: "/" }, { name: "Tools", url: "/tools" }, { name: "Cost of Living Comparison", url: "/tools/cost-of-living-comparison" },
  ]);
  const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: FAQS.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <nav className="text-sm text-gray-400 mb-6" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link><span className="mx-2">›</span>
        <Link href="/tools" className="hover:text-brand">Tools</Link><span className="mx-2">›</span>
        <span className="text-gray-700">Cost of Living Comparison</span>
      </nav>
      <header className="mb-8">
        <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3" style={{ background: "#EBF7FD", color: "#3AAFE5" }}>💸 Free Tool · No Signup</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-3" data-speakable="true">Cost of Living Comparison: Study Abroad</h1>
        <p className="text-base sm:text-lg text-gray-600 max-w-3xl" data-speakable="true">Compare monthly student living costs across top destinations — rent, food, transport and more, side by side in Indian Rupees.</p>
      </header>
      <CostOfLivingComparison />
      <EmbedBox embedUrl="https://www.edudhruv.com/embed/cost-of-living-comparison" toolUrl={URL} title="Cost of Living Comparison" height={700} />
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
