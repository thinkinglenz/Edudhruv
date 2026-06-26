/**
 * AMP Blog Post Page
 * Lightweight, super-fast version of blog posts
 * URL: edudhruv.com/amp/posts/[slug]
 *
 * How AMP works:
 * - No JavaScript (except AMP framework)
 * - Restricted HTML (no custom styles)
 * - Loads in <1 second
 * - Google Search Console shows AMP version separately
 */

import { redirect } from "next/navigation";

interface AmpPostPageProps {
  params: {
    slug: string;
  };
}

export const dynamic = "force-dynamic"; // Always fetch fresh data for AMP

export default async function AmpPostPage({ params }: AmpPostPageProps) {
  const { slug } = params;

  // Fetch the blog post from Supabase
  const response = await fetch(
    `https://efhxakbmhyysbfplpmjn.supabase.co/rest/v1/posts?slug=eq.${slug}&select=*`,
    {
      headers: {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
      },
    }
  );

  const posts = await response.json();
  if (!posts || posts.length === 0) {
    redirect("/");
  }

  const post = posts[0];
  const canonicalUrl = `https://www.edudhruv.com/posts/${post.slug}`;
  const ampUrl = `https://www.edudhruv.com/amp/posts/${post.slug}`;

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1" />
        <title>{post.title} — EduDhruv</title>
        <meta name="description" content={post.excerpt || post.title} />
        <link rel="canonical" href={canonicalUrl} />

        {/* AMP Runtime */}
        <script async src="https://cdn.ampproject.org/v0.js"></script>

        {/* AMP Auto-Ads */}
        <script
          async
          custom-element="amp-auto-ads"
          src="https://cdn.ampproject.org/v0/amp-auto-ads-0.1.js"
        />

        {/* AMP Image component */}
        <script async custom-element="amp-img" src="https://cdn.ampproject.org/v0/amp-img-0.1.js" />

        {/* Open Graph */}
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt || post.title} />
        <meta property="og:image" content={post.image_url || "https://www.edudhruv.com/logo.jpg"} />
        <meta property="og:url" content={ampUrl} />
        <meta property="og:type" content="article" />

        {/* Schema.org */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.excerpt,
            image: post.image_url,
            datePublished: post.created_at,
            author: {
              "@type": "Organization",
              name: "EduDhruv",
            },
          })}
        </script>

        {/* AMP Boilerplate */}
        <style amp-boilerplate>
          {`body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 both;animation:-amp-start 8s steps(1,end) 0s 1 both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}`}
        </style>
        <noscript>
          <style amp-boilerplate>
            {`body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}`}
          </style>
        </noscript>

        {/* Custom AMP Styles */}
        <style amp-custom>
          {`
            * { margin: 0; padding: 0; }
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            header { background: #f8f9fa; padding: 1.5rem; border-bottom: 1px solid #e0e0e0; }
            h1 { font-size: 1.8rem; margin-bottom: 1rem; }
            .meta { font-size: 0.9rem; color: #666; }
            main { max-width: 800px; margin: 0 auto; padding: 2rem 1rem; }
            .content { line-height: 1.8; }
            .content p { margin-bottom: 1.5rem; }
            .content h2 { font-size: 1.5rem; margin: 2rem 0 1rem; }
            .content h3 { font-size: 1.2rem; margin: 1.5rem 0 0.8rem; }
            amp-img { margin: 2rem 0; }
            .cta { background: #1a73e8; color: white; padding: 1.5rem; border-radius: 8px; text-align: center; margin: 2rem 0; }
            footer { background: #f8f9fa; padding: 2rem; text-align: center; border-top: 1px solid #e0e0e0; }
          `}
        </style>
      </head>
      <body>
        {/* Google AdSense Auto Ads */}
        <amp-auto-ads type="adsense" data-ad-client="ca-pub-8001713028154145" />

        {/* Header */}
        <header>
          <h1>{post.title}</h1>
          <div className="meta">
            <span>{new Date(post.created_at).toLocaleDateString()}</span>
            {post.category && <span> • {post.category}</span>}
          </div>
        </header>

        {/* Main Content */}
        <main>
          {/* Featured Image */}
          {post.image_url && (
            <amp-img
              src={post.image_url}
              alt={post.title}
              width="800"
              height="400"
              layout="responsive"
            />
          )}

          {/* Post Content */}
          <article className="content" dangerouslySetInnerHTML={{ __html: post.content }} />

          {/* Call to Action */}
          <div className="cta">
            <p>Want personalized study abroad guidance?</p>
            <a href="https://www.edudhruv.com/contact" style={{ color: "white", textDecoration: "none" }}>
              Get Free Help →
            </a>
          </div>
        </main>

        {/* Footer */}
        <footer>
          <p>
            Read full version:{" "}
            <a href={canonicalUrl}>Non-AMP version with full features</a>
          </p>
          <p style={{ marginTop: "1rem", fontSize: "0.9rem", color: "#666" }}>
            © 2026 EduDhruv. All rights reserved.
          </p>
        </footer>
      </body>
    </html>
  );
}
