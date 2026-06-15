/**
 * /latest — paginated list of ALL published posts across categories.
 * Fixes the 404 hit when users click "View all" / "See all" from homepage.
 */
import type { Metadata } from "next";
import Link from "next/link";
import PostCard from "@/components/blog/PostCard";
import Pagination from "@/components/admin/Pagination";
import { getAllPostsPaginated } from "@/lib/all-posts";
import { breadcrumbSchema } from "@/lib/seo-schemas";

const URL = "https://www.edudhruv.com/latest";
export const revalidate = 600;

export async function generateMetadata({ searchParams }: { searchParams: { page?: string } }): Promise<Metadata> {
  const page = parseInt(searchParams.page || "1");
  return {
    title: page > 1 ? `Latest Articles — Page ${page}` : "Latest Articles — EduDhruv",
    description: "All published articles on EduDhruv across education loans, scholarships, top universities, study abroad guides, accommodation, and visa essentials. Updated daily.",
    alternates: { canonical: page > 1 ? `${URL}?page=${page}` : URL },
  };
}

export default async function LatestPage({ searchParams }: { searchParams: { page?: string } }) {
  const page = Math.max(1, parseInt(searchParams.page || "1"));
  const { posts, total, totalPages } = await getAllPostsPaginated(page, 24);

  const breadcrumb = breadcrumbSchema([
    { name: "Home",    url: "/" },
    { name: "Latest",  url: "/latest" },
  ]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <nav className="text-sm text-gray-400 mb-6" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-700">Latest</span>
      </nav>

      <header className="mb-8">
        <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3"
              style={{ background: "#EBF7FD", color: "#3AAFE5" }}>
          📰 All Articles
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-2">
          Latest Articles
        </h1>
        <p className="text-base text-gray-600">
          {total > 0 ? `${total} articles` : "Articles"} across study-abroad guides, scholarships, education loans, and more — newest first.
        </p>
      </header>

      {posts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <p className="text-5xl mb-3">📰</p>
          <p className="text-gray-600">No articles yet. Check back soon!</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map(p => <PostCard key={p.id} post={p} />)}
          </div>

          {totalPages > 1 && (
            <Pagination
              page={page}
              totalItems={total}
              pageSize={24}
              basePath="/latest"
              extraParams={{}}
            />
          )}
        </>
      )}
    </div>
  );
}
