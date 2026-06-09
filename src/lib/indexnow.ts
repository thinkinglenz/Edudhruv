/**
 * IndexNow — instant URL submission to Bing, Yandex, Seznam (and now
 * indirectly Google since they read these signals).
 *
 * Free, no auth required beyond hosting a key file. Submitting through
 * IndexNow gets new posts indexed within hours instead of days/weeks.
 *
 * Spec: https://www.indexnow.org/documentation
 */

const INDEXNOW_KEY = process.env.INDEXNOW_KEY || "edudhruv-2026-1f4a7c2e9b3d";
const HOST = "www.edudhruv.com";

/** Submit one or many URLs to IndexNow. Returns true on success. */
export async function pingIndexNow(urls: string | string[]): Promise<boolean> {
  const list = Array.isArray(urls) ? urls : [urls];
  if (list.length === 0) return false;

  // Normalize URLs to fully qualified
  const fullUrls = list.map(u => u.startsWith("http") ? u : `https://${HOST}${u.startsWith("/") ? u : "/" + u}`);

  const payload = {
    host: HOST,
    key:  INDEXNOW_KEY,
    keyLocation: `https://${HOST}/${INDEXNOW_KEY}.txt`,
    urlList: fullUrls,
  };

  try {
    const r = await fetch("https://api.indexnow.org/IndexNow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload),
    });
    // 200 = success, 202 = accepted, 422 = invalid key/host
    if (r.ok || r.status === 202) {
      console.log(`[indexnow] submitted ${fullUrls.length} URLs (HTTP ${r.status})`);
      return true;
    }
    console.warn(`[indexnow] HTTP ${r.status}:`, await r.text());
    return false;
  } catch (e) {
    console.warn("[indexnow] error:", e);
    return false;
  }
}

export function indexNowKey(): string {
  return INDEXNOW_KEY;
}
