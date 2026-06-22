/** Legacy WP /cities/{slug} → canonical via slug lookup */
import { redirectToCanonicalOrNotFound } from "@/lib/legacy-redirect";

export const dynamic = "force-dynamic";
export const revalidate = 3600; // CDN cache redirect for 1hr

export default async function LegacyCitiesSlug({ params }: { params: { slug: string } }) {
  await redirectToCanonicalOrNotFound(params.slug);
  return null;
}
