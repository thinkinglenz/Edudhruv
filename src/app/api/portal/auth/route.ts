import { NextRequest, NextResponse } from "next/server";

/**
 * Student portal authentication.
 * When Supabase is configured, uses the `portal_users` table.
 * When in mock mode, stores users in-memory only (lost on server restart).
 */

const IS_MOCK = !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder") ||
  !process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY === "placeholder";

// In-memory user store for mock mode
const MOCK_USERS: Record<string, { name: string; email: string; phone: string; password: string }> = {
  "edudruv@gmail.com": { name: "Demo Student", email: "edudruv@gmail.com", phone: "+919999999999", password: "demo123" },
};

// Rate limiter: 5 attempts/IP/hour
const RATE_LIMIT = new Map<string, { count: number; ts: number }>();
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = RATE_LIMIT.get(ip);
  if (!entry || now - entry.ts > 3600000) {
    RATE_LIMIT.set(ip, { count: 1, ts: now });
    return false;
  }
  if (entry.count >= 5) return true;
  entry.count++;
  return false;
}

// Simple base64 password hashing (replace with bcrypt in production)
function hashPassword(pw: string): string {
  return btoa(`edudhruv::${pw}::salt`);
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";

  try {
    const body = await req.json();
    const { action, email, password, name, phone } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // ─── REGISTER ─────────────────────────────────────────────────
    if (action === "register") {
      if (!name || !phone) {
        return NextResponse.json({ error: "Name and phone required" }, { status: 400 });
      }
      if (password.length < 6) {
        return NextResponse.json({ error: "Password must be 6+ characters" }, { status: 400 });
      }
      if (isRateLimited(ip)) {
        return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
      }

      const emailLower = email.toLowerCase().trim();

      if (IS_MOCK) {
        if (MOCK_USERS[emailLower]) {
          return NextResponse.json({ error: "Email already registered. Please login." }, { status: 409 });
        }
        MOCK_USERS[emailLower] = {
          name: name.trim(),
          email: emailLower,
          phone: phone.trim(),
          password: hashPassword(password),
        };
        return NextResponse.json({
          success: true,
          user: { name: name.trim(), email: emailLower },
        });
      }

      // Supabase path
      const { getServiceClient } = await import("@/lib/supabase");
      const db = getServiceClient();

      const { data: existing } = await db
        .from("portal_users").select("id").eq("email", emailLower).maybeSingle();
      if (existing) {
        return NextResponse.json({ error: "Email already registered. Please login." }, { status: 409 });
      }

      const { error } = await db.from("portal_users").insert([{
        name: name.trim(),
        email: emailLower,
        phone: phone.trim(),
        password_hash: hashPassword(password),
        status: "active",
      }]);
      if (error) {
        return NextResponse.json({ error: "Registration failed" }, { status: 500 });
      }

      // Also save as a lead
      await db.from("leads").insert([{
        name: name.trim(),
        email: emailLower,
        phone: phone.trim(),
        source_post_slug: "loan-portal-registration",
        status: "new",
      }]);

      return NextResponse.json({
        success: true,
        user: { name: name.trim(), email: emailLower },
      });
    }

    // ─── LOGIN ────────────────────────────────────────────────────
    if (action === "login") {
      if (isRateLimited(ip)) {
        await new Promise(r => setTimeout(r, 1200)); // slow down brute force
        return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
      }

      const emailLower = email.toLowerCase().trim();
      const hashed = hashPassword(password);

      if (IS_MOCK) {
        const user = MOCK_USERS[emailLower];
        if (!user || user.password !== hashed) {
          await new Promise(r => setTimeout(r, 800));
          return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
        }
        return NextResponse.json({
          success: true,
          user: { name: user.name, email: user.email },
        });
      }

      // Supabase path
      const { getServiceClient } = await import("@/lib/supabase");
      const db = getServiceClient();

      const { data: user } = await db
        .from("portal_users")
        .select("name,email,password_hash,status")
        .eq("email", emailLower)
        .maybeSingle();

      if (!user || user.password_hash !== hashed || user.status !== "active") {
        await new Promise(r => setTimeout(r, 800));
        return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
      }

      return NextResponse.json({
        success: true,
        user: { name: user.name, email: user.email },
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });

  } catch (err) {
    console.error("Portal auth error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
