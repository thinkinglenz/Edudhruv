/**
 * Cloudflare Turnstile verification helpers.
 *
 * Setup:
 *   1. Go to https://dash.cloudflare.com/?to=/:account/turnstile
 *   2. Add site → mode: managed → domain: edudhruv.com (+ localhost for dev)
 *   3. Copy SITE KEY → NEXT_PUBLIC_TURNSTILE_SITE_KEY
 *   4. Copy SECRET KEY → TURNSTILE_SECRET_KEY
 *
 * When keys are not set (local dev), verification is skipped automatically.
 * That way devs don't need to set up keys to run the app.
 */

export const TURNSTILE_ENABLED =
  !!process.env.TURNSTILE_SECRET_KEY &&
  process.env.TURNSTILE_SECRET_KEY !== "placeholder";

/**
 * Server-side verification of a Turnstile token.
 * Returns true if valid OR if Turnstile isn't configured (dev mode).
 */
export async function verifyTurnstile(
  token: string | undefined | null,
  ip?: string
): Promise<{ success: boolean; error?: string }> {
  if (!TURNSTILE_ENABLED) {
    return { success: true }; // dev fallback
  }
  if (!token) {
    return { success: false, error: "Missing security verification" };
  }

  try {
    const formData = new URLSearchParams({
      secret:   process.env.TURNSTILE_SECRET_KEY!,
      response: token,
    });
    if (ip) formData.set("remoteip", ip);

    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      { method: "POST", body: formData }
    );
    const data = await res.json();

    if (!data.success) {
      return {
        success: false,
        error: `Security check failed${data["error-codes"]?.length ? `: ${data["error-codes"].join(", ")}` : ""}`,
      };
    }
    return { success: true };

  } catch (err) {
    console.error("Turnstile verification error:", err);
    return { success: false, error: "Could not verify security check" };
  }
}
