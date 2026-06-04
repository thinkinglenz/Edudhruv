import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getStaticPage } from "@/lib/pages";
import StaticPageLayout from "@/components/blog/StaticPageLayout";

export const metadata: Metadata = {
  title: "Contact EduDhruv — Get in Touch with Our Team",
  description: "Have a question, partnership idea, or sponsorship enquiry? Contact EduDhruv — we'd love to hear from you.",
  alternates: { canonical: "https://www.edudhruv.com/contact" },
};

export default function ContactPage() {
  const page = getStaticPage("contact-us");
  if (!page) notFound();
  return <StaticPageLayout page={page} />;
}
