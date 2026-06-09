import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getCategoryBySlug, CATEGORY_SLUGS } from "@/lib/categories";
import { getPostsByCategory } from "@/lib/supabase";
import PostCard from "@/components/blog/PostCard";
import RotatingBanner, { ListMyAIBanner, ThinkingLenzBanner } from "@/components/ads/RotatingBanner";
import { breadcrumbSchema, collectionPageSchema } from "@/lib/seo-schemas";

export const revalidate = 3600;

export async function generateStaticParams() {
  return CATEGORY_SLUGS.map((slug) => ({ category: slug }));
}

export async function generateMetadata({ params }: { params: { category: string } }): Promise<Metadata> {
  const cat = getCategoryBySlug(params.category);
  if (!cat) return {};
  return {
    title: `${cat.name} — EduDhruv`,
    description: cat.description,
    alternates: { canonical: `https://www.edudhruv.com/${cat.slug}` },
    openGraph: { title: `${cat.name} | EduDhruv`, description: cat.description },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { category: string };
  searchParams: { page?: string };
}) {
  const cat = getCategoryBySlug(params.category);
  if (!cat) notFound();

  const page = parseInt(searchParams.page || "1");
  const { posts, total } = await getPostsByCategory(cat.slug, page, 12);
  const totalPages = Math.ceil(total / 12);

  // Schemas for crawlers + AI agents
  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: "/" },
    { name: cat.name, url: `/${cat.slug}` },
  ]);
  const collection = collectionPageSchema(
    `${cat.name} — EduDhruv`,
    cat.description,
    `https://www.edudhruv.com/${cat.slug}`,
    total,
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Schemas */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collection) }} />

      {/* Breadcrumb */}
      <nav className="text-sm text-gray-400 mb-6" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-700">{cat.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className={`inline-flex items-center gap-2 text-sm font-semibold px-3 py-1 rounded-full mb-3 ${cat.color}`}>
          {cat.icon} {cat.name}
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{cat.name}</h1>
        <p className="text-gray-500 max-w-xl">{cat.description}</p>
      </div>

      {/* Top sponsored banner */}
      <div className="mb-8">
        <ThinkingLenzBanner size="leaderboard" />
      </div>

      {/* Posts grid — with mid-grid banner insertion */}
      {posts.length === 0 ? (
        <p className="text-gray-400 text-center py-20">No articles yet — check back soon!</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {posts.slice(0, 6).map((post) => <PostCard key={post.id} post={post} />)}
          </div>
          {posts.length > 6 && (
            <div className="mb-10">
              <RotatingBanner size="leaderboard" interval={6000} />
            </div>
          )}
          {posts.length > 6 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {posts.slice(6).map((post) => <PostCard key={post.id} post={post} />)}
            </div>
          )}
          {/* Bottom banner */}
          <div className="mb-10">
            <ListMyAIBanner size="leaderboard" />
          </div>
        </>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/${cat.slug}?page=${p}`}
              className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium border transition-colors ${
                p === page
                  ? "bg-brand text-white border-brand"
                  : "border-gray-200 text-gray-600 hover:border-brand hover:text-brand"
              }`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}

      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `${cat.name} — EduDhruv`,
          description: cat.description,
          url: `https://www.edudhruv.com/${cat.slug}`,
        })}}
      />
    </div>
  );
}
