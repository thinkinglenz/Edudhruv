/**
 * TOTP (Time-based One-Time Password) helpers for admin 2FA.
 *
 * Flow:
 *   1. Admin enables 2FA → server generates a secret → shows QR code
 *   2. Admin scans with Google Authenticator / 1Password / Authy
 *   3. Admin confirms by entering a 6-digit code from the app
 *   4. Server verifies → enables 2FA + saves secret to env (or generates backup codes)
 *   5. Next login: password + 6-digit code required
 */

import { TOTP, Secret } from "otpauth";

const ISSUER = "EduDhruv Admin";

export function createTOTP(secret: string, label = "admin@edudhruv"): TOTP {
  return new TOTP({
    issuer:    ISSUER,
    label,
    algorithm: "SHA1",
    digits:    6,
    period:    30,
    secret:    Secret.fromBase32(secret),
  });
}

/** Generate a new random secret (base32-encoded) */
export function generateSecret(): string {
  return new Secret({ size: 20 }).base32;
}

/** Generate the otpauth:// URI for QR code scanning */
export function generateProvisioningURI(secret: string, label = "admin@edudhruv"): string {
  return createTOTP(secret, label).toString();
}

/**
 * Verify a 6-digit code against the secret.
 * Allows ±1 period window (30s drift) for user convenience.
 */
export function verifyTOTP(secret: string, code: string): boolean {
  if (!code || !secret) return false;
  const normalized = code.trim().replace(/\s/g, "");
  if (!/^\d{6}$/.test(normalized)) return false;
  try {
    const totp = createTOTP(secret);
    const delta = totp.validate({ token: normalized, window: 1 });
    return delta !== null;
  } catch {
    return false;
  }
}

/**
 * Generate 10 backup codes (8 chars each, alphanumeric).
 * Used if the admin loses access to their TOTP app.
 */
export function generateBackupCodes(count = 10): string[] {
  const codes: string[] = [];
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // no confusing chars (0/O, 1/I)
  for (let i = 0; i < count; i++) {
    let code = "";
    for (let j = 0; j < 8; j++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    codes.push(code.slice(0, 4) + "-" + code.slice(4));
  }
  return codes;
}
