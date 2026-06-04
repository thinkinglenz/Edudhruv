// Edge Runtime safe — no Node.js Buffer

export const ADMIN_COOKIE   = "edudhruv_admin_v2";  // bumped (was v1) — old cookies invalidated
export const COOKIE_MAX_AGE = 60 * 60 * 24;          // 24 h

/**
 * Session token format: btoa(`edudhruv::{password}::{stage}_ok`)
 *
 * Stages:
 *   "pwd_pending"  — password verified, 2FA pending (limited access — only /admin/login)
 *   "admin_ok"     — fully authenticated (password + 2FA, OR password if 2FA disabled)
 */
export function makeSessionToken(password: string, stage: "pwd_pending" | "admin_ok" = "admin_ok"): string {
  return btoa(`edudhruv::${password}::${stage}`).replace(/=/g, "");
}

export function verifySession(cookieValue: string, password: string, stage: "pwd_pending" | "admin_ok" = "admin_ok"): boolean {
  if (!cookieValue || !password) return false;
  return cookieValue === makeSessionToken(password, stage);
}
