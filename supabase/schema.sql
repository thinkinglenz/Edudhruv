-- ═══════════════════════════════════════════════════════
-- EduDhruv — Supabase Schema
-- Run this in Supabase SQL Editor
-- ═══════════════════════════════════════════════════════

-- ─── POSTS ────────────────────────────────────────────
create table if not exists posts (
  id                    uuid primary key default gen_random_uuid(),
  title                 text not null,
  slug                  text unique not null,
  content               text not null,
  excerpt               text,
  category_slug         text not null,
  meta_title            text,
  meta_description      text,
  focus_keyword         text,
  featured_image_url    text,
  featured_image_alt    text,
  featured_image_credit text,
  reading_time          integer,
  tags                  text[],
  status                text not null default 'published' check (status in ('published', 'draft')),
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create index if not exists idx_posts_category_slug on posts(category_slug);
create index if not exists idx_posts_status        on posts(status);
create index if not exists idx_posts_created_at    on posts(created_at desc);
create index if not exists idx_posts_slug          on posts(slug);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create trigger posts_updated_at
  before update on posts
  for each row execute function update_updated_at();

-- ─── LEADS ────────────────────────────────────────────
create table if not exists leads (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  email            text not null,
  phone            text not null,
  source_post_slug text,
  destination      text,
  loan_amount      text,
  status           text not null default 'new' check (status in ('new', 'contacted', 'converted', 'closed')),
  notes            text,
  created_at       timestamptz not null default now()
);

create index if not exists idx_leads_email      on leads(email);
create index if not exists idx_leads_status     on leads(status);
create index if not exists idx_leads_created_at on leads(created_at desc);

-- ─── AGENT STATE ──────────────────────────────────────
-- Tracks which topics have been published so agent avoids duplicates
create table if not exists agent_state (
  id           serial primary key,
  category_slug text not null,
  topic         text not null,
  published_at  timestamptz not null default now(),
  post_slug     text,
  unique(category_slug, topic)
);

-- ─── ROW LEVEL SECURITY ───────────────────────────────
-- Posts: public read, service role write
alter table posts enable row level security;
create policy "Public read posts"
  on posts for select using (status = 'published');

-- Leads: service role only (no public access)
alter table leads enable row level security;
create policy "Service role full access on leads"
  on leads using (auth.role() = 'service_role');

-- Agent state: service role only
alter table agent_state enable row level security;
create policy "Service role full access on agent_state"
  on agent_state using (auth.role() = 'service_role');

-- ─── SEED CATEGORIES (informational) ──────────────────
-- Categories are defined in code (src/lib/categories.ts), not DB.
-- This comment is just for reference:
-- education-loan, indian-students-abroad, scholarship, top-universities,
-- student-accommodation, travel-essentials, latest
