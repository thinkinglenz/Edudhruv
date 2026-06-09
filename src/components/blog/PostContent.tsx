import LeadForm from "./LeadForm";
import AmazonBox from "./AmazonBox";
import NewsletterSignup from "./NewsletterSignup";
import { applyInternalLinks } from "@/lib/internal-links";

interface Props {
  content: string;
  slug: string;
  categorySlug: string;
}

/**
 * Splits the raw HTML content at the ~40% mark (after 2nd </h2>)
 * and inserts LeadForm + AmazonBox in the right positions.
 *
 * Also auto-injects internal links into the content for SEO + dwell time:
 * first mention of "scholarship", "education loan", "study abroad", etc.
 * becomes a link to the relevant category page.
 */
export default function PostContent({ content, slug, categorySlug }: Props) {
  // Auto-link key terms to category pages (skip self-link to current category)
  const linkedContent = applyInternalLinks(content, `/${categorySlug}`);

  // Find insertion point: after 2nd H2
  const h2Matches: RegExpExecArray[] = [];
  const h2Regex = /<\/h2>/gi;
  let m: RegExpExecArray | null;
  while ((m = h2Regex.exec(linkedContent)) !== null) h2Matches.push(m);
  const insertAt = h2Matches.length >= 2
    ? h2Matches[1].index + 5
    : Math.floor(linkedContent.length * 0.4);

  const top    = linkedContent.substring(0, insertAt);
  const bottom = linkedContent.substring(insertAt);

  return (
    <div className="prose-blog">
      <div dangerouslySetInnerHTML={{ __html: top }} />
      <LeadForm sourceSlug={slug} />
      <div dangerouslySetInnerHTML={{ __html: bottom }} />
      <NewsletterSignup sourceSlug={slug} variant="inline" />
      <AmazonBox categorySlug={categorySlug} />
    </div>
  );
}
