"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const WELCOME = "Haan ji! 👋 I'm Priya, your personal study abroad counsellor at EduDhruv.\n\nNow that you're logged in, I can help you track your loan application, upload documents, and answer any study abroad questions. What can I help you with today? 😊";

type Mode = "login" | "register" | "loggedIn";

export default function LoanPortalPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });

  // Chat state (only used when logged in)
  const [messages, setMessages] = useState<Message[]>([{ role: "assistant", content: WELCOME }]);
  const [input, setInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // ── Check existing session on load ──
  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("edudhruv_user") : null;
    if (stored) {
      try {
        const u = JSON.parse(stored);
        setUser(u);
        setMode("loggedIn");
      } catch {}
    }
  }, []);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  // ── Auth handlers ──
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/portal/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        localStorage.setItem("edudhruv_user", JSON.stringify(data.user));
        setMode("loggedIn");
      } else {
        setError(data.error || "Login failed");
      }
    } catch { setError("Network error"); }
    setLoading(false);
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/portal/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "register", ...form }),
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        localStorage.setItem("edudhruv_user", JSON.stringify(data.user));
        setMode("loggedIn");
      } else {
        setError(data.error || "Registration failed");
      }
    } catch { setError("Network error"); }
    setLoading(false);
  }

  function handleLogout() {
    localStorage.removeItem("edudhruv_user");
    setUser(null);
    setMode("login");
    setMessages([{ role: "assistant", content: WELCOME }]);
  }

  // ── Chat handler ──
  async function sendMessage() {
    const text = input.trim();
    if (!text || chatLoading) return;
    setInput("");
    const updated: Message[] = [...messages, { role: "user", content: text }];
    setMessages(updated);
    setChatLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updated, user }),
      });
      const data = await res.json();
      setMessages([...updated, { role: "assistant", content: data.reply || "Sorry, please try again." }]);
    } catch {
      setMessages([...updated, { role: "assistant", content: "Network error — please try again 🙏" }]);
    }
    setChatLoading(false);
  }

  // ═══════════════════════════════════════════════════════════════════
  // RENDER: Login / Register screen
  // ═══════════════════════════════════════════════════════════════════
  if (mode !== "loggedIn") {
    return (
      <div className="max-w-md mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="text-4xl mb-3">🎓</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {mode === "login" ? "Login to Loan Portal" : "Create Your Account"}
            </h1>
            <p className="text-sm text-gray-500">
              {mode === "login"
                ? "Access your education loan dashboard and chat with Priya."
                : "Register for free — upload documents, track loans, get expert guidance."}
            </p>
          </div>

          {/* Mode toggle */}
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-6">
            <button
              onClick={() => { setMode("login"); setError(""); }}
              className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${
                mode === "login" ? "bg-white shadow-sm" : "text-gray-500"
              }`}
              style={mode === "login" ? { color: "#3AAFE5" } : {}}
            >
              Login
            </button>
            <button
              onClick={() => { setMode("register"); setError(""); }}
              className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${
                mode === "register" ? "bg-white shadow-sm" : "text-gray-500"
              }`}
              style={mode === "register" ? { color: "#3AAFE5" } : {}}
            >
              Register
            </button>
          </div>

          {/* Form */}
          <form onSubmit={mode === "login" ? handleLogin : handleRegister} className="space-y-3">
            {mode === "register" && (
              <>
                <input
                  type="text" placeholder="Full Name *" required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-brand"
                />
                <input
                  type="tel" placeholder="WhatsApp Number *" required
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-brand"
                />
              </>
            )}
            <input
              type="email" placeholder="Email Address *" required
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-brand"
            />
            <input
              type="password" placeholder="Password *" required minLength={6}
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-brand"
            />

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-2.5 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg text-white font-semibold disabled:opacity-60 transition-opacity"
              style={{ background: "#3AAFE5" }}
            >
              {loading
                ? (mode === "login" ? "Signing in…" : "Creating account…")
                : (mode === "login" ? "Login →" : "Create Account →")}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6">
            🔒 100% Free · Your data stays private · By continuing you agree to our{" "}
            <Link href="/terms-and-conditions" className="underline">Terms</Link>
            {" "}and{" "}
            <Link href="/privacy-policy" className="underline">Privacy Policy</Link>
          </p>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  // RENDER: Authenticated user — chat + dashboard
  // ═══════════════════════════════════════════════════════════════════
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
               style={{ background: "#3AAFE5" }}>
            {(user?.name || "U").charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-gray-900">Welcome, {user?.name}!</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
        </div>
        <button onClick={handleLogout}
                className="text-sm text-gray-500 hover:text-red-500 px-4 py-2 border border-gray-200 rounded-lg hover:border-red-200 transition-colors">
          Log Out
        </button>
      </div>

      {/* Dashboard cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { icon: "📄", label: "Documents Uploaded", value: "0/5" },
          { icon: "🏦", label: "Loan Applications", value: "0" },
          { icon: "💬", label: "Chats with Priya", value: messages.filter(m => m.role === "user").length },
          { icon: "✅", label: "Account Status", value: "Active" },
        ].map(c => (
          <div key={c.label} className="bg-white border border-gray-100 rounded-xl p-4">
            <div className="text-xl mb-1">{c.icon}</div>
            <div className="text-xl font-bold" style={{ color: "#3AAFE5" }}>{c.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{c.label}</div>
          </div>
        ))}
      </div>

      {/* Chat with Priya */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
               style={{ background: "#3AAFE5" }}>P</div>
          <div>
            <h2 className="font-bold text-gray-900">Chat with Priya</h2>
            <p className="text-xs text-green-600 font-medium">● Online — Free Education Counsellor</p>
          </div>
        </div>

        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="h-[440px] overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                  msg.role === "user"
                    ? "text-white rounded-br-sm"
                    : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm"
                }`}
                  style={msg.role === "user" ? { background: "#3AAFE5" } : {}}>
                  {msg.content}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                  <span className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="border-t border-gray-200 bg-white p-3 flex gap-2">
            <input type="text" value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              placeholder="Ask Priya anything about studying abroad…"
              className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand"
            />
            <button onClick={sendMessage} disabled={chatLoading || !input.trim()}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-50 transition-opacity"
              style={{ background: "#3AAFE5" }}>
              Send
            </button>
          </div>
        </div>

        {/* Quick prompts */}
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            "How much loan can I get?",
            "Best universities in Canada",
            "Chevening scholarship 2026",
            "Visa requirements for UK",
            "How do I upload my documents?",
          ].map(q => (
            <button key={q} onClick={() => setInput(q)}
              className="text-xs font-medium px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors"
              style={{ background: "#EBF7FD", color: "#3AAFE5" }}>
              {q}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
