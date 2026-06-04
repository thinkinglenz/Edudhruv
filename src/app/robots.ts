import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Default rule — most bots
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",          // admin panel
          "/api/",            // all API routes
          "/loan-portal/",    // user dashboard (after login)
          "/wp-admin/",       // legacy WP — redirects but still block crawl
          "/wp-login.php",    // legacy WP login
          "/_next/",          // Next.js internals
          "/migration/",      // raw migration data
          "/*?page=*",        // pagination — index canonical only
          "/*?status=*",      // filtered admin views
          "/*.json$",         // any json files
        ],
      },
      // Block bad bots completely
      {
        userAgent: [
          "AhrefsBot",
          "SemrushBot",
          "MJ12bot",
          "DotBot",
          "PetalBot",
          "BLEXBot",
          "DataForSeoBot",
          "MauiBot",
          "ZoominfoBot",
          "SerpstatBot",
        ],
        disallow: "/",
      },
      // GPTBot — allow blog reading (good for AI search engines like ChatGPT)
      // but block admin / api
      {
        userAgent: ["GPTBot", "ChatGPT-User", "Claude-Web", "anthropic-ai", "PerplexityBot"],
        allow: "/",
        disallow: ["/admin/", "/api/", "/loan-portal/"],
      },
    ],
    sitemap: "https://www.edudhruv.com/sitemap.xml",
    host: "https://www.edudhruv.com",
  };
}
