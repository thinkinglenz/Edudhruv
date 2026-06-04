import LeadForm from "./LeadForm";
import AmazonBox from "./AmazonBox";

interface Props {
  content: string;
  slug: string;
  categorySlug: string;
}

/**
 * Splits the raw HTML content at the ~40% mark (after 2nd </h2>)
 * and inserts LeadForm + AmazonBox in the right positions.
 */
export default function PostContent({ content, slug, categorySlug }: Props) {
  // Find insertion point: after 2nd H2
  const h2Matches: RegExpExecArray[] = [];
  const h2Regex = /<\/h2>/gi;
  let m: RegExpExecArray | null;
  while ((m = h2Regex.exec(content)) !== null) h2Matches.push(m);
  const insertAt = h2Matches.length >= 2
    ? h2Matches[1].index + 5
    : Math.floor(content.length * 0.4);

  const top = content.substring(0, insertAt);
  const bottom = content.substring(insertAt);

  return (
    <div className="prose-blog">
      <div dangerouslySetInnerHTML={{ __html: top }} />
      <LeadForm sourceSlug={slug} />
      <div dangerouslySetInnerHTML={{ __html: bottom }} />
      <AmazonBox categorySlug={categorySlug} />
    </div>
  );
}
