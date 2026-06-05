import Link from "next/link";
import { getAuthorForPost, getInitials, type Author } from "@/lib/authors";

interface Props {
  postSlug:     string;
  categorySlug: string;
  publishedAt:  string;
  readingTime?: number | null;
  /** "compact" = single line · "card" = full author card */
  variant?: "compact" | "card";
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  });
}

export default function AuthorByline({ postSlug, categorySlug, publishedAt, readingTime, variant = "compact" }: Props) {
  const author = getAuthorForPost(postSlug, categorySlug);
  const initials = getInitials(author.name);

  if (variant === "card") {
    return (
      <div className="flex items-start gap-4 p-5 rounded-xl border border-gray-100 bg-gray-50 mt-12">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-white text-lg flex-shrink-0"
          style={{ background: author.color }}
        >
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <Link href={`/author/${author.slug}`} className="font-bold text-gray-900 hover:text-brand text-base">
            {author.name}
          </Link>
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mt-0.5">{author.role}</p>
          <p className="text-sm text-gray-600 mt-2 leading-relaxed">{author.bio}</p>
          <div className="flex gap-3 mt-3">
            <Link href={`/author/${author.slug}`} className="text-xs hover:underline" style={{ color: "#3AAFE5" }}>
              More from {author.name.split(" ")[0]} →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Compact variant — single line for top of article
  return (
    <div className="flex items-center gap-3">
      <Link href={`/author/${author.slug}`} className="flex items-center gap-2 group">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-sm flex-shrink-0"
          style={{ background: author.color }}
        >
          {initials}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900 group-hover:text-brand transition-colors leading-tight">
            {author.name}
          </p>
          <p className="text-[11px] text-gray-500 uppercase tracking-wider">{author.role}</p>
        </div>
      </Link>
      <div className="flex items-center gap-3 text-xs text-gray-400 ml-auto">
        <span>{formatDate(publishedAt)}</span>
        {readingTime && <span>· {readingTime} min read</span>}
      </div>
    </div>
  );
}

export function getAuthorForSchema(postSlug: string, categorySlug: string): Author {
  return getAuthorForPost(postSlug, categorySlug);
}
