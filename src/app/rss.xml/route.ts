import { getRecentPosts } from "@/lib/supabase";

/**
 * RSS 2.0 feed of the latest published posts.
 *   URL: https://www.edudhruv.com/rss.xml
 *
 * Purpose: a standard feed that auto-posting bridges (Buffer / Zapier /
 * dlvr.it / IFTTT / Meta tools) subscribe to, so every new blog post is
 * automatically shared to the EduDhruv Facebook Page (and any other channel)
 * — no Facebook App Review needed, because the bridge already holds the
 * posting permission.
 *
 * Revalidated hourly so bridges see new posts quickly without hammering the DB.
 */
export const revalidate = 3600;

const SITE = "https://www.edudhruv.com";

function esc(s: string): string {
  // CDATA-safe: split any accidental "]]>" so it can't break the block.
  return String(s || "").replace(/]]>/g, "]]]]><![CDATA[>");
}

export async function GET() {
  const posts = await getRecentPosts(25);

  const items = posts
    .map((p: any) => {
      const url = `${SITE}/${p.category_slug}/${p.slug}`;
      const desc = p.excerpt || p.meta_description || "";
      const date = new Date(p.created_at || Date.now()).toUTCString(); // RFC-822
      const img = p.featured_image_url
        ? `<enclosure url="${p.featured_image_url}" type="image/jpeg" />`
        : "";
      return `    <item>
      <title><![CDATA[${esc(p.title)}]]></title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${date}</pubDate>
      <description><![CDATA[${esc(desc)}]]></description>
      ${img}
    </item>`;
    })
    .join("\n");

  const lastBuild = posts[0]?.created_at
    ? new Date(posts[0].created_at).toUTCString()
    : new Date().toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>EduDhruv — Study Abroad Guidance for Indian Students</title>
    <link>${SITE}</link>
    <description>Latest guides on studying abroad, education loans, scholarships, universities and visas for Indian students.</description>
    <language>en-in</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
