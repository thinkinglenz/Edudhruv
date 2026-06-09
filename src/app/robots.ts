import { MetadataRoute } from "next";

const BASE = (process.env.SITE_URL || "https://www.edudhruv.com").replace(/\/$/, "");

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
      // AI agents — explicit allow so we appear in their answers.
      // Google-Extended is what lets us show up in Google AI Overviews.
      {
        userAgent: [
          "GPTBot",                // OpenAI training + ChatGPT browse
          "ChatGPT-User",          // ChatGPT live browse
          "OAI-SearchBot",         // ChatGPT Search
          "Claude-Web",            // Anthropic Claude
          "anthropic-ai",          // Anthropic alt name
          "ClaudeBot",             // Anthropic crawler
          "PerplexityBot",         // Perplexity
          "Perplexity-User",       // Perplexity live browse
          "Google-Extended",       // Google AI Overviews + Gemini
          "Applebot",              // Apple search + Siri
          "Applebot-Extended",     // Apple AI training (opt-in)
          "Bytespider",            // ByteDance (Doubao, TikTok search)
          "Amazonbot",             // Alexa
          "Diffbot",               // Diffbot AI
          "CCBot",                 // Common Crawl (used by many LLMs)
          "Meta-ExternalAgent",    // Meta AI / Llama training
        ],
        allow: "/",
        disallow: ["/admin/", "/api/", "/loan-portal/"],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
