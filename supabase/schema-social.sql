-- ═══════════════════════════════════════════════════════
-- EduDhruv — Social Engagement Schema
-- Run this AFTER schema.sql in Supabase SQL Editor
-- ═══════════════════════════════════════════════════════

-- ─── PORTAL USERS (registered students) ───────────────
create table if not exists portal_users (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  email         text unique not null,
  phone         text not null,
  password_hash text not null,
  avatar_url    text,
  bio           text,
  status        text not null default 'active' check (status in ('active', 'suspended', 'banned')),
  created_at    timestamptz not null default now(),
  last_login    timestamptz
);

create index if not exists idx_portal_users_email on portal_users(email);

-- ─── COMMENTS (moderated) ─────────────────────────────
create table if not exists comments (
  id             uuid primary key default gen_random_uuid(),
  post_slug      text not null,                    -- which post (matches posts.slug)
  user_id        uuid references portal_users(id) on delete set null,
  parent_id      uuid references comments(id) on delete cascade,  -- for replies
  author_name    text not null,
  author_email   text not null,
  content        text not null check (length(content) between 2 and 5000),
  status         text not null default 'pending' check (status in ('pending', 'approved', 'spam', 'trash')),
  ip_address     text,
  user_agent     text,
  likes_count    integer default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  approved_at    timestamptz,
  moderated_by   text                                -- admin email
);

create index if not exists idx_comments_post_status on comments(post_slug, status);
create index if not exists idx_comments_created    on comments(created_at desc);

-- ─── RATINGS (5-star, one per user per post) ──────────
create table if not exists post_ratings (
  id          uuid primary key default gen_random_uuid(),
  post_slug   text not null,
  user_id     uuid references portal_users(id) on delete cascade,
  user_email  text not null,                       -- denorm for analytics
  rating      integer not null check (rating between 1 and 5),
  review      text,                                -- optional written review
  created_at  timestamptz not null default now(),
  unique(post_slug, user_id)
);

create index if not exists idx_ratings_post on post_ratings(post_slug);

-- ─── REACTIONS (like, bookmark, share-count) ──────────
create table if not exists post_reactions (
  id          uuid primary key default gen_random_uuid(),
  post_slug   text not null,
  user_id     uuid references portal_users(id) on delete cascade,
  type        text not null check (type in ('like', 'bookmark', 'helpful')),
  created_at  timestamptz not null default now(),
  unique(post_slug, user_id, type)
);

create index if not exists idx_reactions_post on post_reactions(post_slug, type);

-- ─── POST STATS (denormalized counters for fast reads) ─
create table if not exists post_stats (
  post_slug      text primary key,
  view_count     integer default 0,
  share_count    integer default 0,
  like_count     integer default 0,
  bookmark_count integer default 0,
  comment_count  integer default 0,
  avg_rating     numeric(2,1) default 0,
  rating_count   integer default 0,
  updated_at     timestamptz default now()
);

-- ─── SHARE LOG (for analytics) ─────────────────────────
create table if not exists post_shares (
  id          serial primary key,
  post_slug   text not null,
  platform    text not null check (platform in ('whatsapp', 'twitter', 'facebook', 'linkedin', 'email', 'copy', 'native', 'pinterest', 'reddit', 'telegram')),
  user_id     uuid references portal_users(id) on delete set null,
  created_at  timestamptz default now()
);

create index if not exists idx_shares_post on post_shares(post_slug, platform);

-- ═══════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ═══════════════════════════════════════════════════════

alter table comments enable row level security;
create policy "Public read approved comments"
  on comments for select using (status = 'approved');

alter table post_ratings enable row level security;
create policy "Public read ratings" on post_ratings for select using (true);

alter table post_reactions enable row level security;
create policy "Public read reactions" on post_reactions for select using (true);

alter table post_stats enable row level security;
create policy "Public read stats" on post_stats for select using (true);

alter table portal_users enable row level security;
create policy "Service role only on portal_users"
  on portal_users using (auth.role() = 'service_role');

-- ═══════════════════════════════════════════════════════
-- TRIGGERS — auto-update post_stats when actions happen
-- ═══════════════════════════════════════════════════════

create or replace function update_post_stats()
returns trigger language plpgsql as $$
declare
  v_slug text;
begin
  v_slug := coalesce(new.post_slug, old.post_slug);

  insert into post_stats (post_slug) values (v_slug)
    on conflict (post_slug) do nothing;

  -- Comments
  update post_stats set
    comment_count = (select count(*) from comments where post_slug = v_slug and status = 'approved'),
    updated_at = now()
  where post_slug = v_slug;

  -- Likes
  update post_stats set
    like_count = (select count(*) from post_reactions where post_slug = v_slug and type = 'like'),
    bookmark_count = (select count(*) from post_reactions where post_slug = v_slug and type = 'bookmark'),
    updated_at = now()
  where post_slug = v_slug;

  -- Ratings
  update post_stats set
    rating_count = (select count(*) from post_ratings where post_slug = v_slug),
    avg_rating   = coalesce((select round(avg(rating)::numeric, 1) from post_ratings where post_slug = v_slug), 0),
    updated_at = now()
  where post_slug = v_slug;

  -- Shares
  update post_stats set
    share_count = (select count(*) from post_shares where post_slug = v_slug),
    updated_at = now()
  where post_slug = v_slug;

  return coalesce(new, old);
end; $$;

create trigger trg_comments_stats
  after insert or update or delete on comments
  for each row execute function update_post_stats();

create trigger trg_reactions_stats
  after insert or update or delete on post_reactions
  for each row execute function update_post_stats();

create trigger trg_ratings_stats
  after insert or update or delete on post_ratings
  for each row execute function update_post_stats();

create trigger trg_shares_stats
  after insert or update or delete on post_shares
  for each row execute function update_post_stats();
