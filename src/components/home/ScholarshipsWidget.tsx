import Link from "next/link";
import type { Scholarship } from "@/lib/scholarships";
import ScholarshipCard from "@/components/scholarships/ScholarshipCard";

interface Props {
  scholarships: Scholarship[];
}

export default function ScholarshipsWidget({ scholarships }: Props) {
  if (!scholarships || scholarships.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
        <div>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-2"
                style={{ background: "#FEF3D9", color: "#F5A71A" }}>
            💯 100% Funded
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold" style={{ color: "#333" }}>
            Latest Scholarships at Top Universities
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Fully-funded scholarships open to Indian students — verified daily
          </p>
        </div>
        <Link
          href="/scholarships"
          className="text-sm font-bold hover:underline whitespace-nowrap flex items-center gap-1"
          style={{ color: "#3AAFE5" }}
        >
          View all scholarships →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {scholarships.slice(0, 6).map((s) => <ScholarshipCard key={s.id} s={s} />)}
      </div>

      <p className="text-center text-xs text-gray-400 mt-6">
        💡 New 100% scholarship added every day. Bookmark this page or{" "}
        <Link href="/loan-portal" className="font-semibold hover:underline" style={{ color: "#3AAFE5" }}>
          chat with Priya
        </Link>{" "}
        to get personalised matches.
      </p>
    </section>
  );
}
