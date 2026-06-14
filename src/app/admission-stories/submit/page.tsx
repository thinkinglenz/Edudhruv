import type { Metadata } from "next";
import Link from "next/link";
import StorySubmitForm from "@/components/blog/StorySubmitForm";
import { breadcrumbSchema } from "@/lib/seo-schemas";

const URL = "https://www.edudhruv.com/admission-stories/submit";

export const metadata: Metadata = {
  title: "Share Your Admission Story — Inspire Future Indian Students",
  description: "Got admitted to a top university abroad? Share your story to help future Indian students. Your profile, prep journey, funding, and advice. Reviewed in 3-5 days.",
  alternates: { canonical: URL },
};

export default function SubmitStoryPage() {
  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Admission Stories", url: "/admission-stories" },
    { name: "Share Your Story", url: "/admission-stories/submit" },
  ]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <nav className="text-sm text-gray-400 mb-6" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-2">›</span>
        <Link href="/admission-stories" className="hover:text-brand">Admission Stories</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-700">Share Your Story</span>
      </nav>

      <header className="mb-8">
        <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3"
              style={{ background: "#FEE2E2", color: "#991B1B" }}>
          ❤️ Pay it forward
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-3">
          Share your admission story
        </h1>
        <p className="text-base text-gray-600 max-w-2xl">
          Indian students applying to universities abroad lose months of confidence by reading only the
          highlight reel. Real stories — including the hard parts — change that.
          We'll review your submission within 3-5 days and publish if accepted.
        </p>
      </header>

      <StorySubmitForm />
    </div>
  );
}
