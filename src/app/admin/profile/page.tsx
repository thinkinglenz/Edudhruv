"use client";
import { useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import TwoFactorSetup from "@/components/admin/TwoFactorSetup";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [tab, setTab] = useState<"profile" | "password" | "twofa" | "session">("profile");

  // Profile state — saved to localStorage (or Supabase admin_profile table in prod)
  const [profile, setProfile] = useState({
    name:    typeof window !== "undefined" ? (localStorage.getItem("admin_name")  || "Admin") : "Admin",
    email:   typeof window !== "undefined" ? (localStorage.getItem("admin_email") || "edudruv@gmail.com") : "edudruv@gmail.com",
    role:    "Super Admin",
    timezone: "Asia/Kolkata",
  });
  const [pwd, setPwd] = useState({ current: "", next: "", confirm: "" });
  const [msg, setMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  function saveProfile() {
    localStorage.setItem("admin_name",  profile.name);
    localStorage.setItem("admin_email", profile.email);
    setMsg({ text: "✅ Profile updated! (Saved to browser localStorage)", type: "success" });
    setTimeout(() => setMsg(null), 4000);
  }

  async function changePassword() {
    setMsg(null);
    if (pwd.next !== pwd.confirm) {
      setMsg({ text: "New passwords don't match", type: "error" }); return;
    }
    if (pwd.next.length < 8) {
      setMsg({ text: "Password must be at least 8 characters", type: "error" }); return;
    }
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "change-password", current: pwd.current, next: pwd.next }),
      });
      const data = await res.json();
      if (data.success) {
        setMsg({ text: "✅ Password changed! You'll need to log in again on next session.", type: "success" });
        setPwd({ current: "", next: "", confirm: "" });
      } else {
        setMsg({ text: data.error || "Could not change password", type: "error" });
      }
    } catch {
      setMsg({ text: "Network error", type: "error" });
    }
  }

  async function logout() {
    await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    router.push("/admin/login");
    router.refresh();
  }

  async function logoutEverywhere() {
    if (!confirm("Sign out from every device and browser?")) return;
    await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout-all" }),
    });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader title="Profile & Account" subtitle="Manage your admin account, password and sessions" />

      <div className="flex-1 flex overflow-hidden">
        {/* Left tabs */}
        <div className="w-48 flex-shrink-0 bg-gray-900 border-r border-gray-800 py-4 px-3 space-y-0.5">
          {[
            { key: "profile",  icon: "👤", label: "Profile"          },
            { key: "password", icon: "🔒", label: "Change Password"  },
            { key: "twofa",    icon: "🔐", label: "Two-Factor Auth"   },
            { key: "session",  icon: "🚪", label: "Sessions & Logout" },
          ].map(t => (
            <button key={t.key} onClick={() => { setTab(t.key as any); setMsg(null); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                tab === t.key ? "text-white" : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
              style={tab === t.key ? { background: "#3AAFE5" } : {}}>
              <span>{t.icon}</span>{t.label}
            </button>
          ))}
        </div>

        {/* Right pane */}
        <div className="flex-1 overflow-y-auto p-6 max-w-2xl">
          {msg && (
            <div className={`rounded-xl px-5 py-3 text-sm mb-5 ${
              msg.type === "success" ? "bg-green-900/40 border border-green-700 text-green-300"
                                     : "bg-red-900/40 border border-red-700 text-red-300"
            }`}>
              {msg.text}
            </div>
          )}

          {/* Profile tab */}
          {tab === "profile" && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-5">
              <h2 className="text-white font-bold text-lg">Profile Details</h2>

              <div className="flex items-center gap-4 pb-5 border-b border-gray-800">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white"
                  style={{ background: "#3AAFE5" }}>
                  {profile.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-white font-bold text-lg">{profile.name}</p>
                  <p className="text-gray-500 text-sm">{profile.email}</p>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-900/60 text-purple-300 font-bold uppercase tracking-wider mt-1 inline-block">
                    {profile.role}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { key: "name",  label: "Display Name", type: "text" },
                  { key: "email", label: "Email Address", type: "email" },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-xs text-gray-400 mb-1.5 uppercase tracking-wider font-medium">{f.label}</label>
                    <input type={f.type} value={(profile as any)[f.key]}
                      onChange={e => setProfile({ ...profile, [f.key]: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand" />
                  </div>
                ))}
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5 uppercase tracking-wider font-medium">Role</label>
                  <input value={profile.role} disabled
                    className="w-full bg-gray-800 border border-gray-700 text-gray-500 rounded-lg px-4 py-2.5 text-sm cursor-not-allowed" />
                  <p className="text-xs text-gray-500 mt-1">Contact a Super Admin to change roles</p>
                </div>
              </div>

              <button onClick={saveProfile}
                className="text-white font-semibold px-5 py-2.5 rounded-lg transition-opacity hover:opacity-90"
                style={{ background: "#3AAFE5" }}>
                Save Profile
              </button>
            </div>
          )}

          {/* Password tab */}
          {tab === "password" && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-5">
              <h2 className="text-white font-bold text-lg">Change Password</h2>
              <p className="text-sm text-gray-400">
                Use a strong password with 12+ characters, mixing letters, numbers and symbols.
              </p>

              <div className="space-y-4">
                {[
                  { key: "current", label: "Current Password" },
                  { key: "next",    label: "New Password" },
                  { key: "confirm", label: "Confirm New Password" },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-xs text-gray-400 mb-1.5 uppercase tracking-wider font-medium">{f.label}</label>
                    <input type="password" value={(pwd as any)[f.key]}
                      onChange={e => setPwd({ ...pwd, [f.key]: e.target.value })}
                      autoComplete={f.key === "current" ? "current-password" : "new-password"}
                      className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand" />
                  </div>
                ))}
              </div>

              <button onClick={changePassword}
                disabled={!pwd.current || !pwd.next || !pwd.confirm}
                className="text-white font-semibold px-5 py-2.5 rounded-lg transition-opacity disabled:opacity-50 hover:opacity-90"
                style={{ background: "#3AAFE5" }}>
                Update Password
              </button>

              <div className="border-t border-gray-800 pt-5 mt-5">
                <h3 className="text-white font-semibold text-sm mb-2">⚠️ Important — Production Note</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  The password is stored as <code className="bg-gray-800 px-1 rounded">ADMIN_PASSWORD</code> in your Vercel environment variables.
                  When you change it here, you must also update the env var on Vercel and redeploy for the change to persist after server restart.
                </p>
              </div>
            </div>
          )}

          {/* 2FA tab */}
          {tab === "twofa" && (
            <div className="space-y-5">
              <div>
                <h2 className="text-white font-bold text-lg mb-1">Two-Factor Authentication</h2>
                <p className="text-sm text-gray-400">
                  Add a second layer of security to your admin login. Even if your password is stolen,
                  no one can log in without your authenticator app.
                </p>
              </div>
              <TwoFactorSetup />
            </div>
          )}

          {/* Sessions tab */}
          {tab === "session" && (
            <div className="space-y-5">
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h2 className="text-white font-bold text-lg mb-1">Active Session</h2>
                <p className="text-sm text-gray-400 mb-4">You're currently logged in on this browser.</p>

                <div className="bg-gray-800 rounded-lg p-4 flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">💻</span>
                    <div>
                      <p className="text-white text-sm font-semibold">This browser · {typeof navigator !== "undefined" ? (navigator.platform || "Unknown") : "Server"}</p>
                      <p className="text-xs text-gray-500">Session expires in 24 hours</p>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-900/60 text-green-400 font-bold uppercase tracking-wider">CURRENT</span>
                </div>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h2 className="text-white font-bold text-lg mb-1">Sign Out</h2>
                <p className="text-sm text-gray-400 mb-4">Choose how you want to end your session.</p>

                <div className="space-y-3">
                  <button onClick={logout}
                    className="w-full text-left bg-gray-800 hover:bg-gray-700 rounded-lg p-4 transition-colors flex items-center justify-between">
                    <div>
                      <p className="text-white font-semibold">🚪 Sign Out (this device)</p>
                      <p className="text-xs text-gray-400">End your session on this browser only</p>
                    </div>
                    <span className="text-gray-500">→</span>
                  </button>

                  <button onClick={logoutEverywhere}
                    className="w-full text-left bg-red-950/40 hover:bg-red-950/60 border border-red-900/50 rounded-lg p-4 transition-colors flex items-center justify-between">
                    <div>
                      <p className="text-red-300 font-semibold">⚠️ Sign Out Everywhere</p>
                      <p className="text-xs text-red-400/70">End all sessions on every device — useful if your account is compromised</p>
                    </div>
                    <span className="text-red-400">→</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
