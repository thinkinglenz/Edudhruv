import { MetadataRoute } from "next";
import { getAllPublishedSlugs } from "@/lib/supabase";
import { CATEGORIES } from "@/lib/categories";

// Use SITE_URL env var if set (e.g. https://edudhruv.vercel.app while DNS propagates),
// otherwise default to the production domain.
const BASE = (process.env.SITE_URL || "https://www.edudhruv.com").replace(/\/$/, "");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getAllPublishedSlugs();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE}/about`,                changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/contact`,              changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/advertise`,            changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/editorial-standards`,  changeFrequency: "yearly",  priority: 0.5 },
    { url: `${BASE}/privacy-policy`,       changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE}/terms-and-conditions`, changeFrequency: "yearly",  priority: 0.3 },
    // /loan-portal deliberately excluded — it's a user dashboard (noindex)
    // /admin deliberately excluded — admin panel (noindex)
  ];

  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
    url: `${BASE}/${cat.slug}`,
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  const postPages: MetadataRoute.Sitemap = slugs.map(({ category_slug, slug }) => ({
    url: `${BASE}/${category_slug}/${slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...categoryPages, ...postPages];
}
