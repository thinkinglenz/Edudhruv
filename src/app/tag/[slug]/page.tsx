/**
 * Tag landing pages — /tag/[slug]
 *
 * Why these matter:
 *   - Long-tail keyword variations that don't fit the 6 main categories
 *     (e.g. "MBA", "Oxford", "Canada PR", "GRE" — each can become a hub)
 *   - Each tag page typically ranks for 10-30 related queries
 *   - Search Console picks these up within days when sitemap'd
 *   - AI agents follow tag links from posts → broader site context
 */
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getAllTagsWithCounts, getPostsByTag, slugToTagLabel } from "@/lib/supabase";
import PostCard from "@/components/blog/PostCard";
import { breadcrumbSchema, collectionPageSchema } from "@/lib/seo-schemas";

export const revalidate = 3600;

export async function generateStaticParams() {
  const tags = await getAllTagsWithCounts();
  // Only generate tag pages that actually have content
  return tags.filter(t => t.count >= 1).map(t => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const label = slugToTagLabel(params.slug);
  return {
    title: `${label} — Articles & Guides`,
    description: `All EduDhruv guides tagged with ${label}. Updated regularly with the latest information for Indian students planning to study abroad.`,
    alternates: { canonical: `https://www.edudhruv.com/tag/${params.slug}` },
    openGraph: {
      title: `${label} — EduDhruv`,
      description: `Articles tagged ${label} — guidance for Indian students.`,
      type: "website",
    },
  };
}

export default async function TagPage({ params }: { params: { slug: string } }) {
  const posts = await getPostsByTag(params.slug);
  if (posts.length === 0) notFound();

  const label = slugToTagLabel(params.slug);
  const url = `https://www.edudhruv.com/tag/${params.slug}`;

  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Tags", url: "/latest" },
    { name: label, url: `/tag/${params.slug}` },
  ]);
  const collection = collectionPageSchema(
    `${label} — EduDhruv`,
    `Guides for Indian students tagged ${label}`,
    url,
    posts.length,
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collection) }} />

      <nav className="text-sm text-gray-400 mb-6" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-2">›</span>
        <Link href="/latest" className="hover:text-brand">All Articles</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-700">#{label}</span>
      </nav>

      <header className="mb-8">
        <span className="inline-block text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3"
              style={{ background: "#EBF7FD", color: "#3AAFE5" }}>
          🏷 Tag
        </span>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          #{label}
        </h1>
        <p className="text-gray-500">
          {posts.length} {posts.length === 1 ? "article" : "articles"} for Indian students
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {posts.map(p => <PostCard key={p.id} post={p} />)}
      </div>
    </div>
  );
}
