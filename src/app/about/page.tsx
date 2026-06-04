import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getStaticPage } from "@/lib/pages";
import StaticPageLayout from "@/components/blog/StaticPageLayout";

export const metadata: Metadata = {
  title: "About EduDhruv — India's Trusted Study Abroad Platform",
  description: "Learn about EduDhruv — founded by education professionals helping Indian students make confident study abroad decisions.",
  alternates: { canonical: "https://www.edudhruv.com/about" },
};

export default function AboutPage() {
  const page = getStaticPage("about-edudhruv");
  if (!page) notFound();
  return <StaticPageLayout page={page} />;
}
