"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

export default function AdminLogin() {
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get("from") || "/admin";
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "login", password }),
    });
    if (res.ok) {
      router.push(from);
      router.refresh();
    } else {
      const d = await res.json();
      setError(d.error || "Invalid password");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center items-baseline gap-0.5 mb-8">
          <span className="text-white font-extrabold text-3xl tracking-tight">EDU</span>
          <span className="font-extrabold text-3xl tracking-tight" style={{ color: "#3AAFE5" }}>DHRUV</span>
          <span className="text-2xl ml-1" style={{ color: "#F5A71A", lineHeight: 1 }}>★</span>
        </div>

        <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-700">
          <h1 className="text-white font-bold text-xl mb-1 text-center">Admin Panel</h1>
          <p className="text-gray-400 text-sm text-center mb-6">Enter your password to continue</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5 font-medium uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
                autoFocus
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand placeholder-gray-500"
              />
            </div>

            {error && (
              <div className="bg-red-900/40 border border-red-700 text-red-300 rounded-lg px-4 py-2.5 text-sm flex items-center gap-2">
                🚫 {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold text-white transition-colors disabled:opacity-60"
              style={{ background: "#3AAFE5" }}
            >
              {loading ? "Signing in…" : "Sign In →"}
            </button>
          </form>

          <p className="text-center text-xs text-gray-600 mt-6">
            EduDhruv Admin · Secured
          </p>
        </div>
      </div>
    </div>
  );
}
