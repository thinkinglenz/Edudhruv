-- ═══════════════════════════════════════════════════════
-- EduDhruv — Admin 2FA settings
-- Run this in Supabase SQL Editor (after schema.sql)
-- ═══════════════════════════════════════════════════════

create table if not exists admin_settings (
  id              integer primary key default 1,
  totp_secret     text,
  totp_enabled    boolean not null default false,
  backup_codes    text[] default '{}',  -- hashed backup codes
  enabled_at      timestamptz,
  last_used_at    timestamptz,
  updated_at      timestamptz not null default now(),
  -- Singleton constraint — only one row
  constraint admin_settings_singleton check (id = 1)
);

-- Insert default row
insert into admin_settings (id) values (1) on conflict (id) do nothing;

-- RLS — service role only (admin panel uses service key server-side)
alter table admin_settings enable row level security;
create policy "Service role only on admin_settings"
  on admin_settings using (auth.role() = 'service_role');
