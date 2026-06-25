/**
 * AMP Layout Component
 * Lightweight HTML wrapper for AMP pages (Accelerated Mobile Pages)
 * - Loads ~90% faster than regular pages
 * - Higher Google ranking on mobile search
 * - Auto-ads support for monetization
 */

interface AmpLayoutProps {
  title: string;
  description: string;
  canonical: string;
  imageUrl?: string;
  children: React.ReactNode;
}

export default function AmpLayout({
  title,
  description,
  canonical,
  imageUrl = "https://www.edudhruv.com/logo.jpg",
  children,
}: AmpLayoutProps) {
  return (
    <>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />

        {/* AMP Runtime — required for all AMP pages */}
        <script async src="https://cdn.ampproject.org/v0.js"></script>

        {/* AMP Auto-Ads — Google AdSense ads (loads ads automatically) */}
        <script
          async
          custom-element="amp-auto-ads"
          src="https://cdn.ampproject.org/v0/amp-auto-ads-0.1.js"
        ></script>

        {/* AMP Image component — for responsive images */}
        <script async custom-element="amp-img" src="https://cdn.ampproject.org/v0/amp-img-0.1.js"></script>

        {/* AMP Sidebar — for mobile menu */}
        <script
          async
          custom-element="amp-sidebar"
          src="https://cdn.ampproject.org/v0/amp-sidebar-0.1.js"
        ></script>

        {/* Google Analytics for AMP */}
        <script async custom-element="amp-analytics" src="https://cdn.ampproject.org/v0/amp-analytics-0.1.js"></script>

        {/* Minimal AMP CSS */}
        <style amp-boilerplate>
          {`body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 both;animation:-amp-start 8s steps(1,end) 0s 1 both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}`}
        </style>
        <noscript>
          <style amp-boilerplate>
            {`body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}`}
          </style>
        </noscript>

        {/* Open Graph for social sharing */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:url" content={canonical} />

        {/* Schema.org — helps Google understand content */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: title,
            description: description,
            image: imageUrl,
            publisher: {
              "@type": "Organization",
              name: "EduDhruv",
            },
          })}
        </script>
      </head>
      <body>
        {/* Google AdSense Auto Ads */}
        <amp-auto-ads type="adsense" data-ad-client="ca-pub-8001713028154145"></amp-auto-ads>

        {/* Google Analytics */}
        <amp-analytics type="googleanalytics">
          <script type="application/json">
            {JSON.stringify({
              vars: {
                account: "UA-XXXXXXXXX-X", // Replace with your GA ID
              },
              triggers: {
                trackPageview: {
                  on: "visible",
                  request: "pageview",
                },
              },
            })}
          </script>
        </amp-analytics>

        {/* Page Content */}
        <main>{children}</main>
      </body>
    </>
  );
}
