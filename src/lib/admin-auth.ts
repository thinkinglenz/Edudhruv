// Edge Runtime safe — no Node.js Buffer

export const ADMIN_COOKIE  = "edudhruv_admin_v1";
export const COOKIE_MAX_AGE = 60 * 60 * 24; // 24 h

/** btoa works in both Edge Runtime and Node.js (Node 16+) */
export function makeSessionToken(password: string): string {
  return btoa(`edudhruv::${password}::admin_ok`).replace(/=/g, "");
}

export function verifySession(cookieValue: string, password: string): boolean {
  if (!cookieValue || !password) return false;
  return cookieValue === makeSessionToken(password);
}
