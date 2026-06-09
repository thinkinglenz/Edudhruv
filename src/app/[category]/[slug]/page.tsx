import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Clock, Calendar } from "lucide-react";
import { getCategoryBySlug } from "@/lib/categories";
import { getPostBySlug, getRelatedPosts, getAllPublishedSlugs } from "@/lib/supabase";
import PostContent from "@/components/blog/PostContent";
import PostCard from "@/components/blog/PostCard";
import RotatingBanner, { ListMyAIBanner, ThinkingLenzBanner } from "@/components/ads/RotatingBanner";
import ShareButtons         from "@/components/social/ShareButtons";
import RatingWidget         from "@/components/social/RatingWidget";
import ReactionButtons      from "@/components/social/ReactionButtons";
import CommentsSection      from "@/components/social/CommentsSection";
import ReadingProgress      from "@/components/social/ReadingProgress";
import FloatingShareBar     from "@/components/social/FloatingShareBar";
import AuthorByline         from "@/components/blog/AuthorByline";
import TLDR                 from "@/components/blog/TLDR";
import { getAuthorForPost } from "@/lib/authors";
import { getPostStats }     from "@/lib/social";
import {
  breadcrumbSchema,
  howToFromContent,
  faqFromContent,
  articleSchema as buildArticleSchema,
} from "@/lib/seo-schemas";

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getAllPublishedSlugs();
  return slugs.map(({ category_slug, slug }) => ({ category: category_slug, slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { category: string; slug: string };
}): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) return {};
  const url = `https://www.edudhruv.com/${post.category_slug}/${post.slug}`;
  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt || "",
      images: post.featured_image_url ? [post.featured_image_url] : [],
      type: "article",
      publishedTime: post.created_at,
      modifiedTime: post.updated_at,
      url,
    },
    twitter: {
      card: "summary_large_image",
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt || "",
      images: post.featured_image_url ? [post.featured_image_url] : [],
    },
    other: post.focus_keyword ? { "article:tag": post.focus_keyword } : {},
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  });
}

export default async function PostPage({
  params,
}: {
  params: { category: string; slug: string };
}) {
  const post = await getPostBySlug(params.slug);
  if (!post || post.category_slug !== params.category) notFound();

  const cat     = getCategoryBySlug(post.category_slug);
  const related = await getRelatedPosts(post.category_slug, post.slug, 3);
  const stats   = await getPostStats(post.slug);
  const fullUrl = `https://www.edudhruv.com/${post.category_slug}/${post.slug}`;

  // Pick a deterministic author for this post (E-E-A-T SEO)
  const author = getAuthorForPost(post.slug, post.category_slug);

  // ─── Schemas (built server-side, rendered in HTML) ────────────────────
  const breadcrumb = breadcrumbSchema([
    { name: "Home",      url: "/" },
    { name: cat?.name || post.category_slug, url: `/${post.category_slug}` },
    { name: post.title,  url: `/${post.category_slug}/${post.slug}` },
  ]);

  const article = buildArticleSchema({
    url:           fullUrl,
    title:         post.title,
    description:   post.meta_description || post.excerpt || "",
    image:         post.featured_image_url,
    datePublished: post.created_at,
    dateModified:  post.updated_at,
    author:        { name: author.name, slug: author.slug, role: author.role, bio: author.bio },
    keywords:      post.tags || [],
    category:      cat?.name,
  });

  const faq   = faqFromContent(post.content);
  const howto = howToFromContent(post.title, post.content, fullUrl);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Reading progress + floating share */}
      <ReadingProgress />
      <FloatingShareBar url={fullUrl} title={post.title} slug={post.slug} />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">
        {/* Main article */}
        <article>
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-400 mb-5">
            <Link href="/" className="hover:text-brand">Home</Link>
            <span className="mx-2">›</span>
            {cat && <Link href={`/${cat.slug}`} className="hover:text-brand">{cat.name}</Link>}
            <span className="mx-2">›</span>
            <span className="text-gray-600 line-clamp-1">{post.title}</span>
          </nav>

          {/* Category pill */}
          {cat && (
            <Link href={`/${cat.slug}`}>
              <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full mb-4 ${cat.color}`}>
                {cat.icon} {cat.name}
              </span>
            </Link>
          )}

          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-4" data-speakable="true">
            {post.title}
          </h1>

          {/* TL;DR — visible summary AI agents extract verbatim */}
          <TLDR excerpt={post.excerpt} />

          {/* Author + date + rating — combined byline */}
          <div className="mb-5 pb-5 border-b border-gray-100">
            <AuthorByline
              postSlug={post.slug}
              categorySlug={post.category_slug}
              publishedAt={post.created_at}
              readingTime={post.reading_time}
            />
            {stats.avg_rating > 0 && (
              <div className="mt-2 text-sm text-gray-400 flex items-center gap-1.5">
                <span style={{ color: "#F5A71A" }}>★</span>
                <strong className="text-gray-700">{stats.avg_rating}</strong>
                <span>({stats.rating_count} {stats.rating_count === 1 ? "rating" : "ratings"})</span>
              </div>
            )}
          </div>

          {/* Engagement: like, bookmark, views, comments */}
          <ReactionButtons
            postSlug={post.slug}
            initialLikes={stats.like_count}
            initialBookmarks={stats.bookmark_count}
            views={stats.view_count}
            comments={stats.comment_count}
          />

          <div className="mt-6 mb-6"></div>

          {/* Featured image */}
          {post.featured_image_url && (
            <figure className="mb-8">
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden">
                <Image
                  src={post.featured_image_url}
                  alt={post.featured_image_alt || post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              {post.featured_image_credit && (
                <figcaption
                  className="text-center text-xs text-gray-400 mt-2"
                  dangerouslySetInnerHTML={{ __html: post.featured_image_credit }}
                />
              )}
            </figure>
          )}

          {/* Article content with injected lead form + amazon box */}
          <PostContent
            content={post.content}
            slug={post.slug}
            categorySlug={post.category_slug}
          />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-gray-100">
              {post.tags.map((tag) => (
                <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* End-of-article: Author card + Share + Rate */}
          <div className="mt-10 space-y-6">
            <AuthorByline
              postSlug={post.slug}
              categorySlug={post.category_slug}
              publishedAt={post.created_at}
              variant="card"
            />
            <ShareButtons url={fullUrl} title={post.title} slug={post.slug} />
            <RatingWidget
              postSlug={post.slug}
              initialAvg={stats.avg_rating}
              initialCount={stats.rating_count}
            />
          </div>

          {/* Sponsored banner before related posts */}
          <div className="mt-10">
            <ThinkingLenzBanner size="leaderboard" />
          </div>

          {/* Related posts */}
          {related.length > 0 && (
            <section className="mt-12">
              <h2 className="text-xl font-bold text-gray-900 mb-5">Related Articles</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {related.map((p) => <PostCard key={p.id} post={p} />)}
              </div>
            </section>
          )}

          {/* Comments section */}
          <CommentsSection postSlug={post.slug} />

          {/* Final sponsored banner */}
          <div className="mt-10">
            <ListMyAIBanner size="leaderboard" />
          </div>
        </article>

        {/* Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-6">
            {/* Rotating sponsored banner — top of sidebar */}
            <RotatingBanner size="sidebar" interval={5000} />

            {/* Quick lead form */}
            <div className="rounded-xl p-5 border" style={{ background: "#EBF7FD", borderColor: "#3AAFE5" }}>
              <h3 className="font-bold mb-1" style={{ color: "#3AAFE5" }}>Free Guidance</h3>
              <p className="text-xs text-gray-500 mb-4">Talk to our counsellor Priya — no fees, ever.</p>
              <Link
                href="/loan-portal"
                className="block text-center text-white text-sm font-semibold py-2.5 rounded-lg transition-opacity hover:opacity-90"
                style={{ background: "#3AAFE5" }}
              >
                Chat with Priya →
              </Link>
            </div>

            {/* Categories */}
            <div className="bg-white border border-gray-100 rounded-xl p-5">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">Browse Topics</h3>
              <ul className="space-y-2">
                {[
                  ["Education Loan", "/education-loan", "🏦"],
                  ["Scholarships", "/scholarship", "🎓"],
                  ["Top Universities", "/top-universities", "🏛️"],
                  ["Indians Abroad", "/indian-students-abroad", "✈️"],
                  ["Accommodation", "/student-accommodation", "🏠"],
                  ["Travel", "/travel-essentials", "🧳"],
                ].map(([label, href, icon]) => (
                  <li key={href}>
                    <Link href={href} className="flex items-center gap-2 text-sm text-gray-600 hover:text-brand">
                      <span>{icon}</span>{label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Second sponsored banner */}
            <ListMyAIBanner size="sidebar" />
          </div>
        </aside>
      </div>

      {/* ── Structured data (server-rendered for crawlers + AI agents) ── */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }} />
      {faq && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
      )}
      {howto && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howto) }} />
      )}
    </div>
  );
}
