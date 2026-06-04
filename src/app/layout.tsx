import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";
import SiteShell from "@/components/layout/SiteShell";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";

const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_ID || "ca-pub-8001713028154145";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.edudhruv.com"),
  title: {
    default: "EduDhruv — A One-Stop Solution for Your Career Progression",
    template: "%s | EduDhruv",
  },
  description: "EduDhruv — A one-stop solution for your career progression. Free guidance on education loans, scholarships, university admissions and visas for Indian students.",
  icons: { icon: "/favicon.jpg", shortcut: "/favicon.jpg", apple: "/favicon.jpg" },
  openGraph: {
    siteName: "EduDhruv", locale: "en_IN", type: "website",
    images: [{ url: "/logo.jpg", width: 300, height: 80, alt: "EduDhruv" }],
  },
  twitter: { card: "summary_large_image" },
  verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION },
};

const ORG_SCHEMA = {
  "@context": "https://schema.org", "@type": "Organization",
  name: "EduDhruv", url: "https://www.edudhruv.com", logo: "https://www.edudhruv.com/logo.jpg",
  description: "India's trusted study abroad guidance platform.",
  contactPoint: { "@type": "ContactPoint", contactType: "customer support", email: "edudruv@gmail.com" },
};

const WEBSITE_SCHEMA = {
  "@context": "https://schema.org", "@type": "WebSite",
  name: "EduDhruv", url: "https://www.edudhruv.com",
  potentialAction: { "@type": "SearchAction", target: "https://www.edudhruv.com/?s={search_term_string}", "query-input": "required name=search_term_string" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
      </head>
      <body>
        {/* SiteShell shows Header+Footer on public routes, raw on /admin */}
        <SiteShell>{children}</SiteShell>

        <Script async src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`} crossOrigin="anonymous" strategy="afterInteractive" />
        <GoogleAnalytics />
        <Script id="org-schema" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_SCHEMA) }} />
        <Script id="website-schema" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_SCHEMA) }} />
      </body>
    </html>
  );
}
