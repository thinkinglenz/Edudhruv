import { MetadataRoute } from "next";
import { getAllPublishedSlugs, getAllTagsWithCounts } from "@/lib/supabase";
import { CATEGORIES } from "@/lib/categories";
import { AUTHORS } from "@/lib/authors";
import { COUNTRIES } from "@/lib/countries";

// Use SITE_URL env var if set (e.g. https://edudhruv.vercel.app while DNS propagates),
// otherwise default to the production domain.
const BASE = (process.env.SITE_URL || "https://www.edudhruv.com").replace(/\/$/, "");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [slugs, tags] = await Promise.all([
    getAllPublishedSlugs(),
    getAllTagsWithCounts(),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE}/about`,                changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/contact`,              changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/advertise`,            changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/scholarships`,         changeFrequency: "daily",   priority: 0.9 },
    { url: `${BASE}/best-education-loans`, changeFrequency: "weekly",  priority: 0.95 },  // High commercial intent — top priority
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

  // Tag pages — long-tail SEO + AI context
  const tagPages: MetadataRoute.Sitemap = tags.map(({ slug }) => ({
    url: `${BASE}/tag/${slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  // Author pages — E-E-A-T signal
  const authorPages: MetadataRoute.Sitemap = AUTHORS.map(a => ({
    url: `${BASE}/author/${a.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.4,
  }));

  // Country guides — high-priority programmatic SEO pages
  const countryPages: MetadataRoute.Sitemap = COUNTRIES.map(c => ({
    url: `${BASE}/study-in/${c.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.9,  // Very high — buyer-intent
  }));

  return [...staticPages, ...categoryPages, ...postPages, ...tagPages, ...authorPages, ...countryPages];
}
