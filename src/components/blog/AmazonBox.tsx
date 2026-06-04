// Amazon Associates affiliate box
// Associate ID: edudhruv-20 (Amazon.in)
// Required disclosure: "As an Amazon Associate, EduDhruv earns from qualifying purchases."

const PRODUCTS: Record<string, { title: string; keyword: string; description: string }> = {
  "education-loan": {
    title: "Personal Finance Books for Students",
    keyword: "personal finance book students india education loan",
    description: "Top-rated books to manage your education loan and plan your finances abroad.",
  },
  "indian-students-abroad": {
    title: "Must-Have Items for Indians Studying Abroad",
    keyword: "study abroad essentials indian students kit",
    description: "Essential items trusted by thousands of Indian students living abroad.",
  },
  scholarship: {
    title: "IELTS & Scholarship Prep Books",
    keyword: "IELTS preparation books 2025 band 7",
    description: "Best-selling IELTS and scholarship application guides — trusted by 10,000+ Indian students.",
  },
  "top-universities": {
    title: "GRE / GMAT Preparation Guides",
    keyword: "GRE GMAT preparation books 2025 India",
    description: "Top-rated GRE and GMAT prep books used by Indian students targeting top universities.",
  },
  "student-accommodation": {
    title: "Student Room Essentials Kit",
    keyword: "student room essentials kit abroad bedroom",
    description: "Everything you need to set up your student room abroad — compact, affordable, essential.",
  },
  "travel-essentials": {
    title: "Travel Gear for Students",
    keyword: "lightweight cabin baggage backpack students travel",
    description: "Lightweight carry-on backpacks and travel gear rated #1 by student travellers.",
  },
  latest: {
    title: "Study Abroad Guides",
    keyword: "study abroad guide book indian students 2025",
    description: "Comprehensive study abroad preparation guides for Indian students.",
  },
};

const ASSOCIATE_ID = process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_ID || "edudhruv-20";

export default function AmazonBox({ categorySlug }: { categorySlug: string }) {
  const p = PRODUCTS[categorySlug] || PRODUCTS["indian-students-abroad"];

  // Amazon.in for Indian audience (edudhruv-20 is an .in Associate ID)
  const url = `https://www.amazon.in/s?k=${encodeURIComponent(p.keyword)}&tag=${ASSOCIATE_ID}&linkCode=ll2&ref=as_li_ss_tl`;

  return (
    <div
      className="rounded-xl p-5 sm:p-6 my-8 border"
      style={{ background: "#FFFBF0", borderColor: "#F5A71A" }}
    >
      {/* Required Amazon disclosure label */}
      <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">
        Amazon Associate Recommendation
      </p>

      <div className="flex items-start gap-3">
        {/* Amazon logo placeholder */}
        <div
          className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-lg font-black text-white"
          style={{ background: "#FF9900" }}
        >
          a
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-gray-800 text-base mb-1">📦 {p.title}</h4>
          <p className="text-sm text-gray-600 mb-3 leading-relaxed">{p.description}</p>

          <a
            href={url}
            target="_blank"
            rel="noopener sponsored nofollow"
            className="inline-flex items-center gap-2 font-semibold text-sm px-5 py-2 rounded-lg transition-colors"
            style={{ background: "#FF9900", color: "#111" }}
          >
            Shop on Amazon.in →
          </a>
        </div>
      </div>

      {/* Legally required FTC disclosure */}
      <p className="text-[11px] text-gray-400 mt-3 pt-3 border-t border-yellow-100">
        <strong>Disclosure:</strong> As an Amazon Associate, EduDhruv earns a small commission from qualifying
        purchases. This helps keep our guidance free for students — at no extra cost to you.
      </p>
    </div>
  );
}
