import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getStaticPage } from "@/lib/pages";
import StaticPageLayout from "@/components/blog/StaticPageLayout";

export const metadata: Metadata = {
  title: "Terms and Conditions — EduDhruv",
  description: "Terms of use governing your access to and use of EduDhruv.com — please read carefully before using our services.",
  alternates: { canonical: "https://www.edudhruv.com/terms-and-conditions" },
};

export default function TermsPage() {
  const page = getStaticPage("terms-and-conditions");
  if (!page) notFound();
  return <StaticPageLayout page={page} />;
}
