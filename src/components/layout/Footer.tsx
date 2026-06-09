import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          {/* Text logo with brand colors + star — no white patch */}
          <div className="mb-3 flex items-baseline gap-0.5">
            <span className="text-white font-extrabold text-2xl tracking-tight">EDU</span>
            <span className="font-extrabold text-2xl tracking-tight" style={{ color: "#3AAFE5" }}>DHRUV</span>
            <span className="text-2xl ml-1" style={{ color: "#F5A71A", lineHeight: 1 }}>★</span>
          </div>
          <p className="text-xs mb-1 font-medium" style={{ color: "#3AAFE5" }}>
            A one-stop solution for your career progression
          </p>
          <p className="text-sm leading-relaxed text-gray-400 mt-2">
            Helping Indian students navigate study abroad — loans, scholarships, visas and beyond.
          </p>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Topics</h3>
          <ul className="space-y-2 text-sm">
            {[
              ["Best Education Loans",   "/best-education-loans"],
              ["100% Scholarships",       "/scholarships"],
              ["Free Tools",              "/tools"],
              ["EMI Calculator",          "/tools/education-loan-emi-calculator"],
              ["Cost Calculator",         "/tools/cost-of-studying-abroad-calculator"],
              ["Top Universities",        "/top-universities"],
              ["Study Abroad Guides",     "/indian-students-abroad"],
            ].map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="hover:text-white transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            {[
              ["Free Consultation",     "/loan-portal"],
              ["About EduDhruv",         "/about"],
              ["Advertise with us",      "/advertise"],
              ["Editorial Standards",    "/editorial-standards"],
              ["Contact Us",             "/contact"],
              ["Privacy Policy",         "/privacy-policy"],
              ["Terms & Conditions",     "/terms-and-conditions"],
            ].map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="hover:text-white transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Get Help</h3>
          <p className="text-sm text-gray-400 mb-4">Free guidance from our education experts. No fees ever.</p>
          <Link
            href="/loan-portal"
            className="inline-block bg-brand text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-brand-dark transition-colors"
          >
            Talk to Priya →
          </Link>
        </div>
      </div>

      <div className="border-t border-gray-800 py-5 text-center text-xs text-gray-500">
        <p>© {new Date().getFullYear()} EduDhruv. All rights reserved.</p>
        <p className="mt-1">
          As an Amazon Associate, EduDhruv earns from qualifying purchases. |{" "}
          <a href="/ads.txt" className="hover:text-gray-400">ads.txt</a>
        </p>
      </div>
    </footer>
  );
}
