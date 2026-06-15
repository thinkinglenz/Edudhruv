import { MetadataRoute } from "next";
import { getAllPublishedSlugs, getAllTagsWithCounts } from "@/lib/supabase";
import { CATEGORIES } from "@/lib/categories";
import { AUTHORS } from "@/lib/authors";
import { COUNTRIES } from "@/lib/countries";
import { UNIVERSITY_DETAILS } from "@/lib/universities-detail";
import { COURSES } from "@/lib/courses-data";
import { TESTS } from "@/lib/test-prep-data";

// Use SITE_URL env var if set (e.g. https://edudhruv.vercel.app while DNS propagates),
// otherwise default to the production domain.
const BASE = (process.env.SITE_URL || "https://www.edudhruv.com").replace(/\/$/, "");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [slugs, tags] = await Promise.all([
    getAllPublishedSlugs(),
    getAllTagsWithCounts(),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, changeFrequency: "daily", priority: 1.0 },  // Trailing slash — avoids 308 redirect
    { url: `${BASE}/latest`,               changeFrequency: "daily",   priority: 0.85 },
    { url: `${BASE}/about`,                changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/contact`,              changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/advertise`,            changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/scholarships`,         changeFrequency: "daily",   priority: 0.9 },
    { url: `${BASE}/best-education-loans`, changeFrequency: "weekly",  priority: 0.95 },  // High commercial intent — top priority
    { url: `${BASE}/tools`,                                                              changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/tools/education-loan-emi-calculator`,                                changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/tools/cost-of-studying-abroad-calculator`,                           changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/tools/study-abroad-roi-calculator`,                                   changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/tools/university-shortlist-quiz`,                                     changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/tools/profile-evaluator`,                                             changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/tools/application-timeline`,                                          changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/test-prep`,                                                           changeFrequency: "monthly", priority: 0.85 },
    ...TESTS.map(t => ({
      url: `${BASE}/test-prep/${t.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    { url: `${BASE}/free-guides/100-funded-scholarships`,                                 changeFrequency: "monthly", priority: 0.85 },
    { url: `${BASE}/free-guides/sop-samples`,                                             changeFrequency: "monthly", priority: 0.85 },
    { url: `${BASE}/admission-stories`,                                                   changeFrequency: "daily",   priority: 0.85 },
    { url: `${BASE}/admission-stories/submit`,                                            changeFrequency: "monthly", priority: 0.6 },
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
    priority: 0.9,
  }));

  // University detail pages — highest buyer-intent commercial pages
  const universityPages: MetadataRoute.Sitemap = UNIVERSITY_DETAILS.map(u => ({
    url: `${BASE}/university/${u.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.95,  // Highest after best-loans + scholarships
  }));

  // Course landing pages — buyer-intent ("MS CS in USA", "MBA in UK")
  const coursePages: MetadataRoute.Sitemap = COURSES.map(c => ({
    url: `${BASE}/courses/${c.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  return [
    ...staticPages, ...categoryPages, ...postPages, ...tagPages,
    ...authorPages, ...countryPages, ...universityPages, ...coursePages,
  ];
}
