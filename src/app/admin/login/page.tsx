"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <AdminLoginInner />
    </Suspense>
  );
}

function AdminLoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const from   = params.get("from") || "/admin";

  // step: "pwd" → enter password · "2fa" → enter code · "go" → redirect
  const [step, setStep]         = useState<"pwd" | "2fa">(() => params.get("step") === "2fa" ? "2fa" : "pwd");
  const [password, setPassword] = useState("");
  const [code, setCode]         = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  // Skip directly to 2FA if URL says ?step=2fa
  useEffect(() => {
    if (params.get("step") === "2fa") setStep("2fa");
  }, [params]);

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "login", password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Login failed");
    } else if (data.requires2FA) {
      setStep("2fa");
    } else {
      router.push(from); router.refresh();
    }
    setLoading(false);
  }

  async function handleCodeSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "verify-2fa", code }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Invalid code");
    } else {
      router.push(from); router.refresh();
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center items-baseline gap-0.5 mb-8">
          <span className="text-white font-extrabold text-3xl tracking-tight">EDU</span>
          <span className="font-extrabold text-3xl tracking-tight" style={{ color: "#3AAFE5" }}>DHRUV</span>
          <span className="text-2xl ml-1" style={{ color: "#F5A71A", lineHeight: 1 }}>★</span>
        </div>

        <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-700">
          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <StepDot label="1" active={step === "pwd"} done={step === "2fa"} />
            <div className="w-8 h-px bg-gray-700" />
            <StepDot label="2" active={step === "2fa"} done={false} />
          </div>

          <h1 className="text-white font-bold text-xl mb-1 text-center">
            {step === "pwd" ? "Admin Login" : "Two-Factor Code"}
          </h1>
          <p className="text-gray-400 text-sm text-center mb-6">
            {step === "pwd"
              ? "Enter your admin password to continue"
              : "Enter the 6-digit code from your authenticator app"}
          </p>

          {/* STEP 1: Password */}
          {step === "pwd" && (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-medium uppercase tracking-wider">
                  Password
                </label>
                <input
                  type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Enter admin password" required autoFocus
                  autoComplete="current-password"
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand placeholder-gray-500"
                />
              </div>

              {error && (
                <div className="bg-red-900/40 border border-red-700 text-red-300 rounded-lg px-4 py-2.5 text-sm">
                  🚫 {error}
                </div>
              )}

              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-lg font-semibold text-white transition-colors disabled:opacity-60"
                style={{ background: "#3AAFE5" }}>
                {loading ? "Signing in…" : "Continue →"}
              </button>
            </form>
          )}

          {/* STEP 2: TOTP code */}
          {step === "2fa" && (
            <form onSubmit={handleCodeSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-medium uppercase tracking-wider">
                  6-digit code
                </label>
                <input
                  type="text" value={code} onChange={e => setCode(e.target.value.replace(/[^0-9A-Za-z-]/g, ""))}
                  placeholder="123456" required autoFocus
                  inputMode="numeric"
                  maxLength={12}
                  autoComplete="one-time-code"
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 text-center text-2xl tracking-[0.5em] font-mono focus:outline-none focus:border-brand placeholder-gray-500"
                />
                <p className="text-[10px] text-gray-500 mt-1.5">
                  Or use one of your backup codes (e.g. ABCD-1234)
                </p>
              </div>

              {error && (
                <div className="bg-red-900/40 border border-red-700 text-red-300 rounded-lg px-4 py-2.5 text-sm">
                  🚫 {error}
                </div>
              )}

              <button type="submit" disabled={loading || code.length < 6}
                className="w-full py-3 rounded-lg font-semibold text-white transition-colors disabled:opacity-60"
                style={{ background: "#3AAFE5" }}>
                {loading ? "Verifying…" : "Verify & Sign In →"}
              </button>

              <button type="button"
                onClick={() => { setStep("pwd"); setCode(""); setError(""); }}
                className="w-full text-center text-xs text-gray-500 hover:text-gray-300">
                ← Back to password
              </button>
            </form>
          )}

          <p className="text-center text-xs text-gray-600 mt-6">
            EduDhruv Admin · Secured by {step === "2fa" ? "Password + 2FA" : "Password"}
          </p>
        </div>
      </div>
    </div>
  );
}

function StepDot({ label, active, done }: { label: string; active: boolean; done: boolean }) {
  return (
    <div
      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
        done   ? "bg-green-500 text-white" :
        active ? "text-white" :
                 "bg-gray-700 text-gray-500"
      }`}
      style={active ? { background: "#3AAFE5" } : {}}
    >
      {done ? "✓" : label}
    </div>
  );
}
