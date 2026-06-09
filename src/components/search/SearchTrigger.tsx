"use client";
import { useState, useEffect } from "react";
import SearchModal from "./SearchModal";

/**
 * Pill-style search button + Cmd+K keyboard shortcut.
 * Drop anywhere in the layout (we use it in Header).
 */
export default function SearchTrigger({ compact = false }: { compact?: boolean }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const isMac = navigator.platform.toUpperCase().includes("MAC");
      const modifier = isMac ? e.metaKey : e.ctrlKey;
      if (modifier && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      } else if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        setOpen(true);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  if (compact) {
    // Mobile / hamburger version — just an icon button
    return (
      <>
        <button
          onClick={() => setOpen(true)}
          aria-label="Search"
          className="p-2 text-gray-600 hover:text-brand transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
        <SearchModal open={open} onClose={() => setOpen(false)} />
      </>
    );
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-500 text-sm transition-colors min-w-[200px]"
        aria-label="Search the site"
      >
        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span className="flex-1 text-left">Search…</span>
        <kbd className="text-[10px] font-mono bg-white border border-gray-200 px-1.5 py-0.5 rounded text-gray-400">⌘K</kbd>
      </button>
      <SearchModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
