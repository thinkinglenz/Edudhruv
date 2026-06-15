/** Legacy WP /university-news/{slug} → canonical via slug lookup */
import { redirectToCanonicalOrNotFound } from "@/lib/legacy-redirect";

export const dynamic = "force-dynamic";

export default async function LegacyUniNewsSlug({ params }: { params: { slug: string } }) {
  await redirectToCanonicalOrNotFound(params.slug);
  return null;
}
