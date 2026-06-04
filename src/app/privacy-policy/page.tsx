import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getStaticPage } from "@/lib/pages";
import StaticPageLayout from "@/components/blog/StaticPageLayout";

export const metadata: Metadata = {
  title: "Privacy Policy — EduDhruv",
  description: "Read our Privacy Policy describing how EduDhruv collects, uses, and protects your personal data.",
  alternates: { canonical: "https://www.edudhruv.com/privacy-policy" },
  robots: { index: true, follow: true },
};

export default function PrivacyPolicyPage() {
  const page = getStaticPage("privacy-policy");
  if (!page) notFound();
  return <StaticPageLayout page={page} />;
}
