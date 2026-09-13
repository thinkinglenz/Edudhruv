import type { Metadata } from "next";
import Link from "next/link";
import GpaConverter from "@/components/tools/GpaConverter";
import EmbedBox from "@/components/tools/EmbedBox";
import { breadcrumbSchema } from "@/lib/seo-schemas";

const URL = "https://www.edudhruv.com/tools/gpa-converter";

export const metadata: Metadata = {
  title: "GPA Converter — Indian Percentage & CGPA to US 4.0 GPA (Free)",
  description:
    "Free GPA converter for Indian students. Convert your percentage or 10-point CGPA to the US 4.0 GPA scale instantly, with the equivalent percentage and class. Handy for US/Canada university applications.",
  alternates: { canonical: URL },
  openGraph: {
    title: "GPA Converter — Indian % / CGPA to US 4.0 GPA",
    description: "Convert Indian percentage or CGPA to US GPA (4.0 scale) in seconds. Free, no signup.",
    url: URL, type: "website",
    images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: "EduDhruv GPA Converter" }],
  },
  twitter: { card: "summary_large_image", images: ["/og-default.jpg"] },
};

const FAQS = [
  {
    q: "How do I convert Indian percentage to US GPA?",
    a: "A common estimate maps percentage bands to the 4.0 scale: 85%+ ≈ 4.0, 80–84% ≈ 3.7, 75–79% ≈ 3.3, 70–74% ≈ 3.0, 65–69% ≈ 2.7, 60–64% ≈ 2.3. Our tool does this instantly. Note that each university and evaluators like WES use their own method, so treat it as a guide.",
  },
  {
    q: "How do I convert 10-point CGPA to percentage?",
    a: "Most Indian universities (including CBSE) use CGPA × 9.5 = percentage. So a 8.0 CGPA ≈ 76%. Our converter applies this automatically before mapping to US GPA. Always confirm your own university's official formula, as some differ.",
  },
  {
    q: "Is a converted GPA official for university applications?",
    a: "No. This is an estimate to help you gauge where you stand. US and Canadian universities typically either accept your original transcript and convert it themselves, or ask for a WES/credential evaluation. Never enter a self-converted GPA as official.",
  },
  {
    q: "What GPA do I need for US universities?",
    a: "It varies widely. Many US master's programs look for roughly a 3.0+ GPA (≈70%+ / 7.4 CGPA), while top schools expect 3.5+ (≈80%+). A lower GPA can be offset by strong GRE/GMAT, work experience, research, and a compelling SOP.",
  },
];

export default function GpaConverterPage() {
  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Tools", url: "/tools" },
    { name: "GPA Converter", url: "/tools/gpa-converter" },
  ]);
  const webAppSchema = {
    "@context": "https://schema.org", "@type": "WebApplication",
    name: "GPA Converter (Indian % / CGPA to US GPA)",
    description: "Convert Indian percentage or CGPA to the US 4.0 GPA scale.",
    url: URL, applicationCategory: "EducationApplication", operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  };
  const faqSchema = {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: FAQS.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <nav className="text-sm text-gray-400 mb-6" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link><span className="mx-2">›</span>
        <Link href="/tools" className="hover:text-brand">Tools</Link><span className="mx-2">›</span>
        <span className="text-gray-700">GPA Converter</span>
      </nav>

      <header className="mb-8">
        <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3"
              style={{ background: "#EBF7FD", color: "#3AAFE5" }}>🎓 Free Tool · No Signup</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-3" data-speakable="true">
          GPA Converter: Indian % / CGPA → US GPA
        </h1>
        <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-3xl" data-speakable="true">
          Instantly convert your Indian percentage or 10-point CGPA to the US 4.0 GPA scale — with the
          equivalent percentage and class. Perfect for shortlisting US and Canadian universities.
        </p>
      </header>

      <GpaConverter />

      <EmbedBox
        embedUrl="https://www.edudhruv.com/embed/gpa-converter"
        toolUrl={URL}
        title="GPA Converter"
        height={720}
      />

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
