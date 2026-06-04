"use client";
import { useEffect, useState } from "react";

/** Top bar showing how much of the article the user has read. */
export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function update() {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, pct)));
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-gray-100 z-50 pointer-events-none">
      <div
        className="h-full transition-all duration-100 ease-out"
        style={{ width: `${progress}%`, background: "linear-gradient(90deg, #3AAFE5, #F5A71A)" }}
      />
    </div>
  );
}
