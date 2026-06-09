/**
 * Affiliate disclosure — required by Google AdSense, FTC, and required
 * for YMYL (Your Money, Your Life) content like finance + education advice.
 *
 * Renders a compact banner at the top of every post that:
 *   - Discloses we use affiliate links + advertising
 *   - Names the categories of partners (banks, universities)
 *   - Links to fuller disclosure on editorial-standards page
 */
import Link from "next/link";

export default function AffiliateDisclosure() {
  return (
    <div className="mb-6 px-4 py-2.5 bg-gray-50 border-l-2 border-gray-300 rounded-r-md text-xs text-gray-500 leading-relaxed">
      <strong className="text-gray-600">Disclosure:</strong>{" "}
      Some links on EduDhruv are affiliate or sponsored — we may earn a small
      commission if you apply through them at no extra cost to you. This never
      affects which lenders, universities, or scholarships we recommend.{" "}
      <Link href="/editorial-standards" className="underline hover:text-brand">
        Read our editorial standards
      </Link>
      .
    </div>
  );
}
