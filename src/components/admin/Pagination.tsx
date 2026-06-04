import Link from "next/link";

interface Props {
  /** Current page (1-indexed) */
  page: number;
  /** Total items across all pages */
  totalItems: number;
  /** Items per page */
  pageSize: number;
  /** Base path for the page links (without ?page=...) */
  basePath: string;
  /** Optional extra query params to preserve, e.g. {status:"pending"} */
  extraParams?: Record<string, string>;
}

export default function Pagination({ page, totalItems, pageSize, basePath, extraParams = {} }: Props) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  if (totalPages <= 1) return null;

  const buildHref = (p: number) => {
    const params = new URLSearchParams({ ...extraParams, page: String(p) });
    return `${basePath}?${params.toString()}`;
  };

  // Build visible page numbers — show first, last, current ±2
  const pages: (number | "...")[] = [];
  const window = 2;
  const start = Math.max(2, page - window);
  const end   = Math.min(totalPages - 1, page + window);

  pages.push(1);
  if (start > 2) pages.push("...");
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < totalPages - 1) pages.push("...");
  if (totalPages > 1) pages.push(totalPages);

  const from = (page - 1) * pageSize + 1;
  const to   = Math.min(page * pageSize, totalItems);

  return (
    <div className="flex items-center justify-between mt-6 flex-wrap gap-3">
      <p className="text-xs text-gray-400">
        Showing <strong className="text-gray-300">{from}–{to}</strong> of <strong className="text-gray-300">{totalItems}</strong>
      </p>

      <div className="flex items-center gap-1">
        {/* Prev */}
        {page > 1 ? (
          <Link href={buildHref(page - 1)}
            className="px-3 py-1.5 rounded-lg text-sm text-gray-300 border border-gray-700 hover:bg-gray-800 transition-colors">
            ← Prev
          </Link>
        ) : (
          <span className="px-3 py-1.5 rounded-lg text-sm text-gray-600 border border-gray-800 cursor-not-allowed">← Prev</span>
        )}

        {/* Page numbers */}
        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`dot-${i}`} className="px-2 text-gray-500 text-sm">…</span>
          ) : (
            <Link key={p} href={buildHref(p)}
              className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                p === page
                  ? "text-white"
                  : "text-gray-400 border border-gray-700 hover:bg-gray-800"
              }`}
              style={p === page ? { background: "#3AAFE5" } : {}}>
              {p}
            </Link>
          )
        )}

        {/* Next */}
        {page < totalPages ? (
          <Link href={buildHref(page + 1)}
            className="px-3 py-1.5 rounded-lg text-sm text-gray-300 border border-gray-700 hover:bg-gray-800 transition-colors">
            Next →
          </Link>
        ) : (
          <span className="px-3 py-1.5 rounded-lg text-sm text-gray-600 border border-gray-800 cursor-not-allowed">Next →</span>
        )}
      </div>
    </div>
  );
}
