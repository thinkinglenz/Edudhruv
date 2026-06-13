"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Post } from "@/lib/types";
import { getCategoryBySlug } from "@/lib/categories";

interface SponsoredSlide {
  type: "sponsored";
  image: string;
  title: string;
  subtitle?: string;
  cta: string;
  ctaUrl: string;
  label?: string;
  bg?: string;
}

interface PostSlide extends Post {
  type: "post";
}

type Slide = PostSlide | SponsoredSlide;

interface Props {
  posts: Post[];
  /** Optional sponsored slides injected at position 2, 5, etc. */
  sponsored?: SponsoredSlide[];
}

function buildSlides(posts: Post[], sponsored: SponsoredSlide[]): Slide[] {
  const slides: Slide[] = posts.slice(0, 5).map(p => ({ ...p, type: "post" as const }));
  // Inject sponsored slide at index 2 if provided
  if (sponsored.length > 0) {
    slides.splice(2, 0, sponsored[0]);
  }
  return slides;
}

export default function HeroBanner({ posts, sponsored = [] }: Props) {
  const slides = buildSlides(posts, sponsored);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setCurrent(c => (c + 1) % slides.length), [slides.length]);
  const prev = () => setCurrent(c => (c - 1 + slides.length) % slides.length);

  // Auto-rotate every 5 s
  useEffect(() => {
    if (paused || slides.length <= 1) return;
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [next, paused, slides.length]);

  if (slides.length === 0) return null;
  const slide = slides[current];

  return (
    <div
      className="relative w-full overflow-hidden bg-gray-900"
      style={{ aspectRatio: "16/7", minHeight: 240, maxHeight: 440 }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Slides ── */}
      {slides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ${i === current ? "opacity-100 z-10" : "opacity-0 z-0"}`}
        >
          {s.type === "post" ? (
            <PostSlideView post={s} />
          ) : (
            <SponsoredSlideView slide={s} />
          )}
        </div>
      ))}

      {/* ── Prev / Next arrows ── */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-colors"
            aria-label="Previous"
          >
            ‹
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-colors"
            aria-label="Next"
          >
            ›
          </button>
        </>
      )}

      {/* ── Dot indicators ── */}
      {slides.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
          {slides.map((s, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all ${
                i === current
                  ? "w-5 h-2 bg-white"
                  : "w-2 h-2 bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* ── Slide counter ── */}
      <div className="absolute top-3 right-3 z-20 bg-black/40 text-white text-xs px-2 py-0.5 rounded-full">
        {current + 1} / {slides.length}
      </div>
    </div>
  );
}

// ─── Post Slide ──────────────────────────────────────────────────────────────
function PostSlideView({ post }: { post: Post }) {
  const cat = getCategoryBySlug(post.category_slug);
  const href = `/${post.category_slug}/${post.slug}`;

  return (
    <Link href={href} className="block w-full h-full relative group">
      {/* Background image */}
      {post.featured_image_url ? (
        <Image
          src={post.featured_image_url}
          alt={post.featured_image_alt || post.title}
          fill
          sizes="(max-width: 1280px) 100vw, 1152px"
          quality={70}
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          priority
          fetchPriority="high"
        />
      ) : (
        <div className="w-full h-full" style={{ background: "linear-gradient(135deg, #3AAFE5, #1575A8)" }} />
      )}

      {/* Dark overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

      {/* Text overlay — bottom left */}
      <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 z-10">
        {cat && (
          <span
            className="inline-block text-xs font-bold px-2.5 py-1 rounded-full mb-2 text-white"
            style={{ background: "#3AAFE5" }}
          >
            {cat.icon} {cat.name}
          </span>
        )}
        <h2 className="text-white font-extrabold text-lg sm:text-2xl md:text-3xl leading-snug max-w-2xl drop-shadow">
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="text-white/75 text-sm mt-1.5 line-clamp-2 max-w-xl hidden sm:block">
            {post.excerpt}
          </p>
        )}
        <span
          className="inline-block mt-3 text-xs font-semibold px-4 py-1.5 rounded-lg text-white transition-colors"
          style={{ background: "#F5A71A" }}
        >
          Read Article →
        </span>
      </div>
    </Link>
  );
}

// ─── Sponsored Slide ─────────────────────────────────────────────────────────
function SponsoredSlideView({ slide }: { slide: SponsoredSlide }) {
  return (
    <a
      href={slide.ctaUrl}
      target="_blank"
      rel="noopener sponsored"
      className="block w-full h-full relative group overflow-hidden"
    >
      {/* Background */}
      {slide.image ? (
        <Image
          src={slide.image}
          alt={slide.title}
          fill
          sizes="(max-width: 1280px) 100vw, 1152px"
          quality={70}
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />
      ) : (
        <div
          className="w-full h-full"
          style={{ background: slide.bg || "linear-gradient(135deg, #1a1a2e, #16213e)" }}
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* Sponsored label */}
      <div className="absolute top-3 left-3 z-20">
        <span className="bg-gold text-gray-900 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider"
          style={{ background: "#F5A71A" }}>
          {slide.label || "Sponsored"}
        </span>
      </div>

      {/* Text */}
      <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 z-10">
        <h2 className="text-white font-extrabold text-lg sm:text-2xl md:text-3xl leading-snug drop-shadow max-w-2xl">
          {slide.title}
        </h2>
        {slide.subtitle && (
          <p className="text-white/75 text-sm mt-1.5 max-w-xl hidden sm:block">{slide.subtitle}</p>
        )}
        <span
          className="inline-block mt-3 text-xs font-semibold px-4 py-1.5 rounded-lg text-white"
          style={{ background: "#3AAFE5" }}
        >
          {slide.cta} →
        </span>
      </div>
    </a>
  );
}
