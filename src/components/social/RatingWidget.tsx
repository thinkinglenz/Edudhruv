"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useUser } from "@/lib/useUser";

interface Props {
  postSlug: string;
  initialAvg?: number;
  initialCount?: number;
}

export default function RatingWidget({ postSlug, initialAvg = 0, initialCount = 0 }: Props) {
  const { user } = useUser();
  const [avg, setAvg]           = useState(initialAvg);
  const [count, setCount]       = useState(initialCount);
  const [myRating, setMyRating] = useState<number | null>(null);
  const [hover, setHover]       = useState(0);
  const [msg, setMsg]           = useState("");
  const [saving, setSaving]     = useState(false);

  useEffect(() => {
    if (!user?.email) return;
    fetch(`/api/social/rating?slug=${encodeURIComponent(postSlug)}&email=${encodeURIComponent(user.email)}`)
      .then(r => r.json())
      .then(d => setMyRating(d.rating || null))
      .catch(() => {});
  }, [user?.email, postSlug]);

  async function submit(stars: number) {
    if (!user?.email) return;
    setSaving(true); setMsg("");
    try {
      const res = await fetch("/api/social/rating", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post_slug: postSlug, rating: stars, user }),
      });
      const data = await res.json();
      if (data.success) {
        const prevCount = myRating ? count : count + 1;
        const newAvg = myRating
          ? parseFloat(((avg * count - myRating + stars) / count).toFixed(1))
          : parseFloat(((avg * count + stars) / prevCount).toFixed(1));
        setAvg(newAvg);
        setCount(prevCount);
        setMyRating(stars);
        setMsg(`Thanks! You rated this ${stars}/5 ⭐`);
      } else {
        setMsg(data.error || "Could not save rating");
      }
    } catch { setMsg("Network error"); }
    setSaving(false);
    setTimeout(() => setMsg(""), 4000);
  }

  return (
    <div className="rounded-xl border-2 p-5" style={{ borderColor: "#3AAFE5", background: "#EBF7FD" }}>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="font-bold text-base mb-0.5" style={{ color: "#3AAFE5" }}>⭐ Rate this Article</h3>
          <p className="text-xs text-gray-500">
            {count > 0 ? <>Average: <strong>{avg}/5</strong> from {count} {count === 1 ? "rating" : "ratings"}</> : "Be the first to rate!"}
          </p>
        </div>

        {/* Star buttons */}
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map(n => {
            const filled = (hover || myRating || 0) >= n;
            return (
              <button
                key={n}
                disabled={!user || saving}
                onMouseEnter={() => user && setHover(n)}
                onMouseLeave={() => setHover(0)}
                onClick={() => submit(n)}
                className={`text-2xl transition-transform ${user ? "hover:scale-110 cursor-pointer" : "cursor-not-allowed opacity-60"}`}
                aria-label={`Rate ${n} of 5`}
              >
                <span style={{ color: filled ? "#F5A71A" : "#D1D5DB" }}>★</span>
              </button>
            );
          })}
        </div>
      </div>

      {!user && (
        <p className="text-xs text-gray-600 mt-3 pt-3 border-t border-blue-200">
          <Link href="/loan-portal" className="font-semibold hover:underline" style={{ color: "#3AAFE5" }}>
            Login →
          </Link>{" "}
          to rate and join the discussion.
        </p>
      )}

      {msg && <p className="text-xs text-green-700 font-medium mt-2">{msg}</p>}
    </div>
  );
}
