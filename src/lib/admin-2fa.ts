/**
 * Server-side helpers for admin 2FA state.
 *
 * 2FA secret is stored in Supabase (admin_settings table) so it persists
 * across deploys without exposing it in env vars.
 *
 * In MOCK_MODE (no Supabase), 2FA is treated as disabled.
 */

const IS_MOCK = !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder") ||
  !process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY === "placeholder";

export interface AdminSettings {
  totp_enabled:      boolean;
  totp_secret:       string | null;
  backup_codes:      string[];
  email_2fa_enabled: boolean;
  email_2fa_address: string | null;
}

export async function getAdminSettings(): Promise<AdminSettings> {
  if (IS_MOCK) {
    return {
      totp_enabled: false, totp_secret: null, backup_codes: [],
      email_2fa_enabled: false, email_2fa_address: null,
    };
  }
  const { getServiceClient } = await import("@/lib/supabase");
  const { data } = await getServiceClient()
    .from("admin_settings")
    .select("totp_enabled,totp_secret,backup_codes,email_2fa_enabled,email_2fa_address")
    .eq("id", 1)
    .maybeSingle();
  return {
    totp_enabled:      !!data?.totp_enabled,
    totp_secret:       data?.totp_secret || null,
    backup_codes:      data?.backup_codes || [],
    email_2fa_enabled: !!data?.email_2fa_enabled,
    email_2fa_address: data?.email_2fa_address || null,
  };
}

export async function updateAdminSettings(patch: Partial<AdminSettings>): Promise<boolean> {
  if (IS_MOCK) return false;
  try {
    const { getServiceClient } = await import("@/lib/supabase");
    const update: any = { updated_at: new Date().toISOString() };
    if ("totp_enabled" in patch) update.totp_enabled = patch.totp_enabled;
    if ("totp_secret"  in patch) update.totp_secret  = patch.totp_secret;
    if ("backup_codes" in patch) update.backup_codes = patch.backup_codes;
    if ("email_2fa_enabled" in patch) update.email_2fa_enabled = patch.email_2fa_enabled;
    if ("email_2fa_address" in patch) update.email_2fa_address = patch.email_2fa_address;
    if (patch.totp_enabled === true) update.enabled_at = new Date().toISOString();

    const { error } = await getServiceClient()
      .from("admin_settings")
      .upsert({ id: 1, ...update }, { onConflict: "id" });
    if (error) console.error("admin_settings upsert error:", error);
    return !error;
  } catch (e) {
    console.error("Could not update admin_settings:", e);
    return false;
  }
}

/** Mark a backup code as used (remove it from the list) */
export async function consumeBackupCode(code: string): Promise<boolean> {
  if (IS_MOCK) return false;
  const { backup_codes } = await getAdminSettings();
  const normalized = code.trim().toUpperCase();
  if (!backup_codes.includes(normalized)) return false;
  const remaining = backup_codes.filter(c => c !== normalized);
  return await updateAdminSettings({ backup_codes: remaining });
}
