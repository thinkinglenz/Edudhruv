"use client";
import { useState, useEffect } from "react";

export interface PortalUser {
  name: string;
  email: string;
}

/** React hook that reads the logged-in portal user from localStorage. */
export function useUser(): { user: PortalUser | null; isLoading: boolean } {
  const [user, setUser] = useState<PortalUser | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("edudhruv_user");
      if (stored) setUser(JSON.parse(stored));
    } catch {}
    setLoading(false);

    // Listen for cross-tab login/logout
    const handler = () => {
      try {
        const stored = localStorage.getItem("edudhruv_user");
        setUser(stored ? JSON.parse(stored) : null);
      } catch { setUser(null); }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  return { user, isLoading };
}
