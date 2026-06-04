import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { AUTHORS, getAuthorBySlug, getInitials } from "@/lib/authors";
import { getRecentPosts } from "@/lib/supabase";
import { getAuthorForPost } from "@/lib/authors";
import PostCard from "@/components/blog/PostCard";

export async function generateStaticParams() {
  return AUTHORS.map(a => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const author = getAuthorBySlug(params.slug);
  if (!author) return {};
  return {
    title:       `${author.name} — ${author.role} at EduDhruv`,
    description: author.bio,
    alternates:  { canonical: `https://www.edudhruv.com/author/${author.slug}` },
    openGraph:   {
      title:       `${author.name} — EduDhruv`,
      description: author.bio,
      type:        "profile",
    },
  };
}

export default async function AuthorPage({ params }: { params: { slug: string } }) {
  const author = getAuthorBySlug(params.slug);
  if (!author) notFound();

  // Get posts attributed to this author
  const allRecent = await getRecentPosts(50);
  const authorPosts = allRecent.filter(p => getAuthorForPost(p.slug, p.category_slug).slug === author.slug);

  const initials = getInitials(author.name);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-2">›</span>
        <span>Authors</span>
        <span className="mx-2">›</span>
        <span className="text-gray-700">{author.name}</span>
      </nav>

      {/* Author hero */}
      <div className="flex items-start gap-6 p-6 sm:p-8 rounded-2xl border border-gray-100 mb-10"
           style={{ background: `linear-gradient(135deg, ${author.color}10, #ffffff)` }}>
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center font-bold text-white text-3xl flex-shrink-0"
          style={{ background: author.color }}
        >
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-extrabold text-2xl sm:text-3xl text-gray-900">{author.name}</h1>
          <p className="text-xs font-semibold uppercase tracking-wider mt-1" style={{ color: author.color }}>
            {author.role}
          </p>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed mt-4">{author.bio}</p>
          <div className="flex gap-3 mt-4 flex-wrap">
            {author.linkedin && (
              <a href={author.linkedin} target="_blank" rel="noopener"
                 className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-gray-200 hover:bg-gray-50">
                💼 LinkedIn →
              </a>
            )}
            {author.twitter && (
              <a href={author.twitter} target="_blank" rel="noopener"
                 className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-gray-200 hover:bg-gray-50">
                𝕏 Twitter →
              </a>
            )}
            <a href={`mailto:edudruv@gmail.com?subject=Question for ${author.name}`}
               className="text-xs font-semibold px-3 py-1.5 rounded-lg text-white"
               style={{ background: author.color }}>
              ✉ Ask {author.name.split(" ")[0]}
            </a>
          </div>
        </div>
      </div>

      {/* Specialties */}
      <div className="mb-10">
        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Specialises in</h2>
        <div className="flex flex-wrap gap-2">
          {author.specialties.map(s => (
            <Link key={s} href={`/${s}`}
                  className="text-xs px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 capitalize">
              {s.replace(/-/g, " ")}
            </Link>
          ))}
        </div>
      </div>

      {/* Articles by author */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-5">
          Articles by {author.name}
          <span className="text-sm font-normal text-gray-400 ml-2">({authorPosts.length})</span>
        </h2>
        {authorPosts.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-12">
            No articles yet — check back soon!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {authorPosts.map(p => <PostCard key={p.id} post={p} />)}
          </div>
        )}
      </div>

      {/* Person schema for E-E-A-T */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context":   "https://schema.org",
            "@type":      "Person",
            name:         author.name,
            jobTitle:     author.role,
            description:  author.bio,
            url:          `https://www.edudhruv.com/author/${author.slug}`,
            worksFor:     { "@type": "Organization", name: "EduDhruv" },
            ...(author.linkedin && { sameAs: [author.linkedin, ...(author.twitter ? [author.twitter] : [])] }),
            knowsAbout:   author.specialties,
          }),
        }}
      />
    </div>
  );
}
