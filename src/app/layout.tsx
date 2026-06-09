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
  // Site ownership verifications for Google Search Console & AdSense.
  // Both can use the same content meta tag if "google-site-verification" is set.
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: {
      // AdSense specific verification meta tag (optional but helps speed up approval)
      ...(process.env.NEXT_PUBLIC_ADSENSE_VERIFICATION && {
        "google-adsense-account": process.env.NEXT_PUBLIC_ADSENSE_VERIFICATION,
      }),
    },
  },
};

const ORG_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "EduDhruv",
  alternateName: "Edu Dhruv",
  url: "https://www.edudhruv.com",
  logo: "https://www.edudhruv.com/logo.jpg",
  image: "https://www.edudhruv.com/logo.jpg",
  description: "India's trusted study-abroad guidance platform. Free advice on education loans, scholarships, university admissions, accommodation, and student visas for Indian students applying overseas.",
  email: "edudruv@gmail.com",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: "edudruv@gmail.com",
    areaServed: "IN",
    availableLanguage: ["English", "Hindi"],
  },
  knowsAbout: [
    "Study Abroad", "Education Loans", "Scholarships",
    "University Admissions", "Student Visa", "Student Accommodation",
    "GRE", "GMAT", "IELTS", "TOEFL", "SAT",
  ],
  areaServed: { "@type": "Country", name: "India" },
  sameAs: [
    "https://www.facebook.com/edudhruv",
    "https://www.linkedin.com/company/edudhruv",
    "https://twitter.com/edudhruv",
  ],
};

const WEBSITE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "EduDhruv",
  url: "https://www.edudhruv.com",
  inLanguage: "en-IN",
  publisher: { "@type": "Organization", name: "EduDhruv" },
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: "https://www.edudhruv.com/?s={search_term_string}" },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />

        {/* AdSense account verification — required for site approval */}
        <meta name="google-adsense-account" content={ADSENSE_ID} />

        {/* Sitewide schemas — server-rendered so crawlers + AI agents read them on first byte */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_SCHEMA) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_SCHEMA) }}
        />
      </head>
      <body>
        {/* SiteShell shows Header+Footer on public routes, raw on /admin */}
        <SiteShell>{children}</SiteShell>

        <Script async src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`} crossOrigin="anonymous" strategy="afterInteractive" />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
