/**
 * Legacy redirect: /latest/{slug} → /{actual-category}/{slug}
 *
 * Old WordPress structure had posts under /latest/. Now they live under
 * their proper category. This handler looks up the slug and 301-redirects.
 */
import { redirectToCanonicalOrNotFound } from "@/lib/legacy-redirect";

export const dynamic = "force-dynamic";

export default async function LegacyLatestSlug({ params }: { params: { slug: string } }) {
  await redirectToCanonicalOrNotFound(params.slug);
  return null;
}
