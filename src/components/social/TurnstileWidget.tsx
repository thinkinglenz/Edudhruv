"use client";
import { useEffect, useRef, useState } from "react";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

interface Props {
  /** Called with the token when Turnstile verifies successfully */
  onVerify: (token: string) => void;
  /** Called when token expires / is reset */
  onExpire?: () => void;
  /** Optional: light or dark theme */
  theme?: "light" | "dark" | "auto";
  /** Optional className for wrapper */
  className?: string;
}

declare global {
  interface Window {
    turnstile?: {
      render: (container: string | HTMLElement, options: any) => string;
      reset:  (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
    onTurnstileLoad?: () => void;
  }
}

let scriptLoaded = false;
let scriptLoading = false;
const loadCallbacks: (() => void)[] = [];

function loadTurnstileScript(): Promise<void> {
  return new Promise((resolve) => {
    if (scriptLoaded) return resolve();
    loadCallbacks.push(resolve);
    if (scriptLoading) return;
    scriptLoading = true;

    const s = document.createElement("script");
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    s.async = true;
    s.defer = true;
    s.onload = () => {
      scriptLoaded = true;
      loadCallbacks.forEach(cb => cb());
      loadCallbacks.length = 0;
    };
    document.head.appendChild(s);
  });
}

export default function TurnstileWidget({ onVerify, onExpire, theme = "light", className = "" }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef  = useRef<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ── Dev fallback: no site key → auto-verify with "dev-bypass" token ──
  useEffect(() => {
    if (!SITE_KEY || SITE_KEY === "placeholder") {
      onVerify("dev-bypass");
      return;
    }

    let cancelled = false;
    loadTurnstileScript().then(() => {
      if (cancelled || !containerRef.current || !window.turnstile) return;

      try {
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey:    SITE_KEY,
          theme,
          // Invisible mode — no visible widget unless suspicious activity.
          // Cleaner UX: no Cloudflare branding on the form.
          size:       "invisible",
          appearance: "interaction-only",
          callback:           (token: string) => onVerify(token),
          "expired-callback": () => onExpire?.(),
          "error-callback":   () => setError("Security check failed. Please refresh."),
        });
      } catch (e: any) {
        setError(e?.message || "Failed to load security check");
      }
    });

    return () => {
      cancelled = true;
      if (widgetIdRef.current && window.turnstile) {
        try { window.turnstile.remove(widgetIdRef.current); } catch {}
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // No widget rendered when Turnstile isn't configured (dev mode)
  if (!SITE_KEY || SITE_KEY === "placeholder") {
    return null;
  }

  return (
    <div className={className} style={{ display: "contents" }}>
      {/* Invisible Turnstile — only renders an iframe when challenge is needed */}
      <div ref={containerRef} aria-hidden="true" />
      {error && <p className="text-xs text-red-600 mt-1">⚠ {error}</p>}
    </div>
  );
}
