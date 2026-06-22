/**
 * Legacy redirect: /latest/{slug} → /{actual-category}/{slug}
 *
 * Old WordPress structure had posts under /latest/. Now they live under
 * their proper category. This handler looks up the slug and 301-redirects.
 *
 * CDN Caching: Vercel edge caches redirect responses for 1hr to prevent
 * repeated DB lookups during bot crawls.
 */
import { redirectToCanonicalOrNotFound } from "@/lib/legacy-redirect";

export const dynamic = "force-dynamic";
export const revalidate = 3600; // Cache redirect at edge for 1 hour

export default async function LegacyLatestSlug({ params }: { params: { slug: string } }) {
  await redirectToCanonicalOrNotFound(params.slug);
  return null;
}
