import type { Metadata } from "next";
import Link from "next/link";
import { TESTS } from "@/lib/test-prep-data";
import { breadcrumbSchema } from "@/lib/seo-schemas";

const URL = "https://www.edudhruv.com/test-prep";

export const metadata: Metadata = {
  title: "Test Prep for Indian Students — GRE, GMAT, IELTS Guides",
  description: "Free study guides for GRE, GMAT, IELTS — Indian-student focused. Syllabus, fees, target scores, prep timelines, and FAQs.",
  alternates: { canonical: URL },
};

export default function TestPrepIndex() {
  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Test Prep", url: "/test-prep" },
  ]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <nav className="text-sm text-gray-400 mb-6" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-700">Test Prep</span>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 mb-3">
          📚 Test Prep for Indian Students
        </h1>
        <p className="text-base sm:text-lg text-gray-600 max-w-3xl">
          GRE, GMAT, IELTS — everything you need to know. Indian-context examples, target scores for top universities, realistic prep timelines.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {TESTS.map(t => (
          <Link key={t.slug} href={`/test-prep/${t.slug}`}
                className="bg-white rounded-2xl border-2 border-gray-100 p-6 hover:shadow-lg hover:border-brand transition-all">
            <p className="text-5xl mb-3">{t.icon}</p>
            <h2 className="font-extrabold text-xl text-gray-900 mb-1">{t.test}</h2>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">{t.fullName}</p>
            <p className="text-sm text-gray-600 leading-relaxed">{t.intro.slice(0, 140)}…</p>
            <p className="text-sm font-bold mt-3" style={{ color: "#3AAFE5" }}>
              Read full guide →
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
