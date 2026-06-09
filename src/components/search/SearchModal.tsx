"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SearchResult {
  type:     "post" | "scholarship" | "university" | "page";
  title:    string;
  subtitle?:string;
  url:      string;
  excerpt?: string;
  image?:   string | null;
  badge?:   string;
}

interface SearchResponse {
  query: string;
  total: number;
  grouped: {
    posts:        SearchResult[];
    scholarships: SearchResult[];
    universities: SearchResult[];
    pages:        SearchResult[];
  };
  durationMs: number;
}

const POPULAR = [
  "education loan",
  "scholarship MIT",
  "study in canada",
  "EMI calculator",
  "fully funded oxford",
  "MBA usa",
  "germany free tuition",
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function SearchModal({ open, onClose }: Props) {
  const router = useRouter();
  const [q, setQ]               = useState("");
  const [loading, setLoading]   = useState(false);
  const [data, setData]         = useState<SearchResponse | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef                = useRef<HTMLInputElement>(null);
  const debounceTimer           = useRef<NodeJS.Timeout | null>(null);

  // Focus input when opening
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setActiveIdx(0);
    } else {
      setQ("");
      setData(null);
    }
  }, [open]);

  // Esc to close + global keyboard nav
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") { onClose(); return; }
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  // Debounced search
  const runSearch = useCallback(async (query: string) => {
    if (!query.trim()) { setData(null); return; }
    setLoading(true);
    try {
      const r = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const d = (await r.json()) as SearchResponse;
      setData(d);
      setActiveIdx(0);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => runSearch(q), 250);
    return () => { if (debounceTimer.current) clearTimeout(debounceTimer.current); };
  }, [q, runSearch]);

  // Flat list of results for keyboard nav
  const flatResults: SearchResult[] = data
    ? [...data.grouped.pages, ...data.grouped.scholarships, ...data.grouped.posts, ...data.grouped.universities]
    : [];

  function onInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx(i => Math.min(flatResults.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx(i => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = flatResults[activeIdx];
      if (target) {
        router.push(target.url);
        onClose();
      } else if (q.trim()) {
        router.push(`/search?q=${encodeURIComponent(q.trim())}`);
        onClose();
      }
    }
  }

  if (!open) return null;

  const showPopular = !q.trim();
  const showEmpty   = q.trim() && data && data.total === 0 && !loading;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[8vh] px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[80vh] flex flex-col">
        {/* Input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
          <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={q}
            onChange={e => setQ(e.target.value)}
            onKeyDown={onInputKeyDown}
            placeholder="Search posts, scholarships, calculators…"
            className="flex-1 text-base bg-transparent text-gray-900 placeholder-gray-400 outline-none border-0"
          />
          {loading && <span className="text-xs text-gray-400">Searching…</span>}
          <kbd className="hidden sm:inline-block text-[10px] font-mono text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">ESC</kbd>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto">
          {showPopular && (
            <div className="p-5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-3">Popular searches</p>
              <div className="flex flex-wrap gap-2">
                {POPULAR.map(p => (
                  <button key={p} onClick={() => setQ(p)}
                          className="text-sm px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 hover:bg-brand-light hover:text-brand transition-colors">
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          {showEmpty && (
            <div className="p-10 text-center">
              <p className="text-5xl mb-3">🔍</p>
              <p className="text-gray-700 font-semibold">No results for "{q}"</p>
              <p className="text-sm text-gray-500 mt-1">Try shorter or different keywords</p>
            </div>
          )}

          {data && data.total > 0 && (
            <div>
              {/* Top — Static high-value pages */}
              {data.grouped.pages.length > 0 && (
                <ResultGroup label="Quick links" results={data.grouped.pages}
                             startIdx={0} activeIdx={activeIdx} onSelect={onClose} q={q} />
              )}
              {/* Scholarships */}
              {data.grouped.scholarships.length > 0 && (
                <ResultGroup label="100% Funded Scholarships" results={data.grouped.scholarships}
                             startIdx={data.grouped.pages.length}
                             activeIdx={activeIdx} onSelect={onClose} q={q} />
              )}
              {/* Posts */}
              {data.grouped.posts.length > 0 && (
                <ResultGroup label="Articles & Guides" results={data.grouped.posts}
                             startIdx={data.grouped.pages.length + data.grouped.scholarships.length}
                             activeIdx={activeIdx} onSelect={onClose} q={q} />
              )}
              {/* Universities */}
              {data.grouped.universities.length > 0 && (
                <ResultGroup label="Universities" results={data.grouped.universities}
                             startIdx={data.grouped.pages.length + data.grouped.scholarships.length + data.grouped.posts.length}
                             activeIdx={activeIdx} onSelect={onClose} q={q} />
              )}

              {/* See all */}
              <Link
                onClick={onClose}
                href={`/search?q=${encodeURIComponent(q.trim())}`}
                className="block px-5 py-3 text-sm text-center text-brand hover:bg-gray-50 border-t border-gray-100 font-semibold"
                style={{ color: "#3AAFE5" }}
              >
                See all results for "{q}" →
              </Link>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-2.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
          <div className="flex items-center gap-3">
            <span><kbd className="bg-white border border-gray-200 px-1 rounded text-[10px]">↑↓</kbd> navigate</span>
            <span><kbd className="bg-white border border-gray-200 px-1 rounded text-[10px]">↵</kbd> open</span>
          </div>
          {data && <span>{data.total} results · {data.durationMs}ms</span>}
        </div>
      </div>
    </div>
  );
}

function ResultGroup({
  label, results, startIdx, activeIdx, onSelect, q,
}: {
  label: string;
  results: SearchResult[];
  startIdx: number;
  activeIdx: number;
  onSelect: () => void;
  q: string;
}) {
  return (
    <div className="border-t border-gray-100 first:border-t-0">
      <p className="px-5 pt-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">{label}</p>
      <ul>
        {results.map((r, i) => {
          const isActive = startIdx + i === activeIdx;
          return (
            <li key={`${r.type}-${r.url}-${i}`}>
              <Link
                href={r.url}
                onClick={onSelect}
                className={`flex items-start gap-3 px-5 py-3 transition-colors ${
                  isActive ? "bg-blue-50" : "hover:bg-gray-50"
                }`}
              >
                <span className="text-xl flex-shrink-0 mt-0.5">{ICON_MAP[r.type]}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-gray-900">
                      <Highlight text={r.title} q={q} />
                    </span>
                    {r.badge && (
                      <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                            style={{ background: "#EBF7FD", color: "#3AAFE5" }}>
                        {r.badge}
                      </span>
                    )}
                  </div>
                  {r.subtitle && (
                    <p className="text-xs text-gray-500 mt-0.5 capitalize">{r.subtitle}</p>
                  )}
                  {r.excerpt && (
                    <p className="text-xs text-gray-400 mt-1 line-clamp-1">{r.excerpt}</p>
                  )}
                </div>
                <span className="text-gray-300 text-base flex-shrink-0">↗</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

const ICON_MAP: Record<string, string> = {
  post:        "📄",
  scholarship: "🎓",
  university:  "🏛️",
  page:        "⚡",
};

function Highlight({ text, q }: { text: string; q: string }) {
  if (!q || q.length < 2) return <>{text}</>;
  try {
    const parts = text.split(new RegExp(`(${q.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
    return (
      <>
        {parts.map((p, i) =>
          p.toLowerCase() === q.toLowerCase()
            ? <mark key={i} className="bg-yellow-200 text-gray-900 rounded px-0.5">{p}</mark>
            : <span key={i}>{p}</span>
        )}
      </>
    );
  } catch { return <>{text}</>; }
}
