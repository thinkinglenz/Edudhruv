-- ═══════════════════════════════════════════════════════════════════
-- Site-wide full-text search using Postgres tsvector
-- ═══════════════════════════════════════════════════════════════════
--
-- Auto-generated tsvector columns with weighted fields:
--   A = title          (highest priority)
--   B = excerpt / tags
--   C = category / focus_keyword
--   D = content body
--
-- GIN indexes for sub-50ms searches even on 1M+ rows.
-- Generated columns mean no triggers needed — Postgres recomputes
-- the tsvector automatically whenever a row is inserted/updated.

-- ─── POSTS ──────────────────────────────────────────────────────────
ALTER TABLE posts
  ADD COLUMN IF NOT EXISTS search_tsv tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title,           '')), 'A') ||
    setweight(to_tsvector('english', coalesce(excerpt,         '')), 'B') ||
    setweight(to_tsvector('english', coalesce(array_to_string(tags, ' '), '')), 'B') ||
    setweight(to_tsvector('english', coalesce(focus_keyword,   '')), 'C') ||
    setweight(to_tsvector('english', coalesce(category_slug,   '')), 'C') ||
    setweight(to_tsvector('english', coalesce(content,         '')), 'D')
  ) STORED;

CREATE INDEX IF NOT EXISTS idx_posts_search_tsv ON posts USING GIN(search_tsv);

-- ─── SCHOLARSHIPS ───────────────────────────────────────────────────
ALTER TABLE scholarships
  ADD COLUMN IF NOT EXISTS search_tsv tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(scholarship_name,    '')), 'A') ||
    setweight(to_tsvector('english', coalesce(university_name,     '')), 'A') ||
    setweight(to_tsvector('english', coalesce(country,             '')), 'B') ||
    setweight(to_tsvector('english', coalesce(eligibility_summary, '')), 'C') ||
    setweight(to_tsvector('english', coalesce(intake,              '')), 'C') ||
    setweight(to_tsvector('english', coalesce(array_to_string(courses_covered, ' '), '')), 'C')
  ) STORED;

CREATE INDEX IF NOT EXISTS idx_scholarships_search_tsv ON scholarships USING GIN(search_tsv);

-- ─── UNIVERSITIES ───────────────────────────────────────────────────
ALTER TABLE universities
  ADD COLUMN IF NOT EXISTS search_tsv tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(name,             '')), 'A') ||
    setweight(to_tsvector('english', coalesce(country,          '')), 'B') ||
    setweight(to_tsvector('english', coalesce(array_to_string(popular_courses, ' '), '')), 'C')
  ) STORED;

CREATE INDEX IF NOT EXISTS idx_universities_search_tsv ON universities USING GIN(search_tsv);

-- ─── pg_trgm — fuzzy matching for typos / partial words ────────────
-- Lets us match "stanfrd" → "Stanford" etc.
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX IF NOT EXISTS idx_posts_title_trgm ON posts USING gin (title gin_trgm_ops);
