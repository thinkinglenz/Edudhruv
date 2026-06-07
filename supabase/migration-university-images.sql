-- Cache the chosen image URL per university so the agent never
-- has to re-fetch (and admin can override from /admin/posts).
ALTER TABLE universities
  ADD COLUMN IF NOT EXISTS image_url    TEXT,
  ADD COLUMN IF NOT EXISTS image_credit TEXT;
