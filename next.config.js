/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "m.media-amazon.com" },
      { protocol: "https", hostname: "**.cloudfront.net" },
    ],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Clickjacking protection
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          // MIME sniffing protection
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Referrer
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // XSS (legacy browsers)
          { key: "X-XSS-Protection", value: "1; mode=block" },
          // HSTS — force HTTPS for 1 year
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
          // Permissions — disable camera/mic/geolocation
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          // Cross-origin policies
          { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
          { key: "Cross-Origin-Embedder-Policy", value: "unsafe-none" },
        ],
      },
      // ads.txt served as plain text
      {
        source: "/ads.txt",
        headers: [{ key: "Content-Type", value: "text/plain" }],
      },
      // ─── Admin panel — block ALL search engines ─────────────────
      // X-Robots-Tag works even if bots ignore robots.txt or run JS
      {
        source: "/admin/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive, nosnippet, noimageindex" },
          { key: "Cache-Control", value: "no-store, no-cache, must-revalidate, private" },
        ],
      },
      {
        source: "/admin",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive, nosnippet, noimageindex" },
          { key: "Cache-Control", value: "no-store, no-cache, must-revalidate, private" },
        ],
      },
      // ─── API routes — block crawling ──────────────────────────────
      {
        source: "/api/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
      // ─── Loan portal — user dashboard, don't index ────────────────
      {
        source: "/loan-portal/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
      {
        source: "/loan-portal",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
    ];
  },

  async redirects() {
    return [
      // ─── Legacy WordPress page slugs → clean new URLs ───────────
      // 301 redirects preserve all SEO juice from old URLs
      { source: "/about-edudhruv",  destination: "/about",   permanent: true },
      { source: "/contact-us",      destination: "/contact", permanent: true },

      // ─── WordPress generic URL patterns ──────────────────────────
      { source: "/category/:slug",  destination: "/:slug",      permanent: true },
      { source: "/tag/:slug",       destination: "/latest",     permanent: true },
      { source: "/author/:slug",    destination: "/",           permanent: true },
      { source: "/page/:num",       destination: "/",           permanent: true },

      // ─── WordPress admin → Vercel admin ──────────────────────────
      { source: "/wp-admin",        destination: "/admin",       permanent: false },
      { source: "/wp-login.php",    destination: "/admin/login", permanent: false },
    ];
  },
};

module.exports = nextConfig;
