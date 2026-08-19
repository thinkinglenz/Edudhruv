/**
 * Google Indexing API — request a crawl of a URL the moment it's published.
 *
 * Unlike IndexNow (Bing/Yandex only), this pings GOOGLE directly:
 *   POST https://indexing.googleapis.com/v3/urlNotifications:publish
 *
 * ⚠️ HONEST CAVEAT — read this:
 *   Google officially supports the Indexing API only for pages with
 *   JobPosting or BroadcastEvent structured data. Using it for general
 *   blog content is outside Google's stated guidelines. In practice it
 *   very often DOES trigger a faster crawl, but Google may ignore it, and
 *   it will NOT force Google to *index* thin content — it only requests a
 *   crawl. It is a speed lever, not a quality fix. Content quality is still
 *   what decides whether Google keeps the page.
 *
 * SETUP (one-time, done by you — see the notes returned to the chat):
 *   1. Google Cloud Console → create a project → enable "Indexing API".
 *   2. Create a Service Account → create a JSON key → download it.
 *   3. Search Console → Settings → Users and permissions → add the service
 *      account's email as an **Owner** of the property.
 *   4. Put the JSON key (whole file, as one line) in the GOOGLE_INDEXING_SA_KEY
 *      env var / GitHub secret.
 *
 * If GOOGLE_INDEXING_SA_KEY is not set, every function here is a safe no-op.
 */

import crypto from "crypto";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const INDEXING_URL = "https://indexing.googleapis.com/v3/urlNotifications:publish";
const SCOPE = "https://www.googleapis.com/auth/indexing";

interface ServiceAccount {
  client_email: string;
  private_key: string;
}

// Cache the access token in-memory for its ~1h lifetime to avoid re-signing.
let cachedToken: { token: string; expiresAt: number } | null = null;

function loadServiceAccount(): ServiceAccount | null {
  const raw = process.env.GOOGLE_INDEXING_SA_KEY;
  if (!raw) return null;
  try {
    const sa = JSON.parse(raw);
    if (sa.client_email && sa.private_key) {
      // Support keys stored with escaped newlines
      sa.private_key = String(sa.private_key).replace(/\\n/g, "\n");
      return sa;
    }
  } catch {
    console.warn("[google-indexing] GOOGLE_INDEXING_SA_KEY is not valid JSON");
  }
  return null;
}

function b64url(input: Buffer | string): string {
  return Buffer.from(input).toString("base64url");
}

/** Mint a Google OAuth access token from the service account via signed JWT. */
async function getAccessToken(sa: ServiceAccount): Promise<string | null> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.token;
  }
  try {
    const now = Math.floor(Date.now() / 1000);
    const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
    const claims = b64url(JSON.stringify({
      iss: sa.client_email,
      scope: SCOPE,
      aud: TOKEN_URL,
      iat: now,
      exp: now + 3600,
    }));
    const signingInput = `${header}.${claims}`;
    const signature = crypto
      .createSign("RSA-SHA256")
      .update(signingInput)
      .sign(sa.private_key)
      .toString("base64url");
    const jwt = `${signingInput}.${signature}`;

    const res = await fetch(TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: jwt,
      }),
    });
    if (!res.ok) {
      console.warn(`[google-indexing] token exchange HTTP ${res.status}:`, await res.text());
      return null;
    }
    const data = await res.json();
    cachedToken = {
      token: data.access_token,
      expiresAt: Date.now() + (data.expires_in ?? 3600) * 1000,
    };
    return cachedToken.token;
  } catch (e) {
    console.warn("[google-indexing] token error:", e);
    return null;
  }
}

/**
 * Notify Google that a URL was updated (or deleted). Fire-and-forget safe:
 * never throws, returns false on any failure or when unconfigured.
 */
export async function notifyGoogleIndexing(
  url: string,
  type: "URL_UPDATED" | "URL_DELETED" = "URL_UPDATED",
): Promise<boolean> {
  const sa = loadServiceAccount();
  if (!sa) return false; // not configured → silent no-op

  const token = await getAccessToken(sa);
  if (!token) return false;

  try {
    const res = await fetch(INDEXING_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url, type }),
    });
    if (res.ok) {
      console.log(`[google-indexing] ${type} submitted for ${url}`);
      return true;
    }
    console.warn(`[google-indexing] HTTP ${res.status}:`, await res.text());
    return false;
  } catch (e) {
    console.warn("[google-indexing] request error:", e);
    return false;
  }
}

/** True when the service-account key is configured. */
export function isGoogleIndexingConfigured(): boolean {
  return loadServiceAccount() !== null;
}
