import Link from "next/link";
import { getAuthorForPost, getInitials, type Author } from "@/lib/authors";

interface Props {
  postSlug:     string;
  categorySlug: string;
  publishedAt:  string;
  /** Optional — if more than 1 day after publish, shown as "Updated" */
  updatedAt?:   string | null;
  readingTime?: number | null;
  /** "compact" = single line · "card" = full author card */
  variant?: "compact" | "card";
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  });
}

/** Returns "Updated 9 Jun 2026" if updatedAt is meaningfully later than publishedAt. */
function freshnessLabel(publishedAt: string, updatedAt?: string | null): string | null {
  if (!updatedAt) return null;
  const pub = new Date(publishedAt).getTime();
  const upd = new Date(updatedAt).getTime();
  if (isNaN(pub) || isNaN(upd)) return null;
  // Only show "Updated" if revision is at least 1 day after publish
  if (upd - pub < 86_400_000) return null;
  return `Updated ${formatDate(updatedAt)}`;
}

export default function AuthorByline({ postSlug, categorySlug, publishedAt, updatedAt, readingTime, variant = "compact" }: Props) {
  const author = getAuthorForPost(postSlug, categorySlug);
  const initials = getInitials(author.name);
  const updatedLabel = freshnessLabel(publishedAt, updatedAt);

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
      <div className="flex items-center gap-3 text-xs text-gray-400 ml-auto flex-wrap justify-end">
        {updatedLabel ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 text-green-700 font-semibold border border-green-200">
            ✓ {updatedLabel}
          </span>
        ) : (
          <span>{formatDate(publishedAt)}</span>
        )}
        {readingTime && <span>· {readingTime} min read</span>}
      </div>
    </div>
  );
}

export function getAuthorForSchema(postSlug: string, categorySlug: string): Author {
  return getAuthorForPost(postSlug, categorySlug);
}
