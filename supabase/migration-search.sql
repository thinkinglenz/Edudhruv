-- ═══════════════════════════════════════════════════════════════════
-- Site-wide full-text search using Postgres tsvector
-- ═══════════════════════════════════════════════════════════════════
--
-- Postgres requires generated columns to use IMMUTABLE functions.
-- `to_tsvector(text, text)` is STABLE (not IMMUTABLE) because the
-- text->regconfig cast depends on current_setting.
--
-- Workaround: create an IMMUTABLE wrapper that hard-codes 'english'
-- as a regconfig literal. We can safely mark it IMMUTABLE because
-- 'english' is a fixed dictionary built into Postgres.
-- ═══════════════════════════════════════════════════════════════════

-- ─── IMMUTABLE wrapper ──────────────────────────────────────────────
CREATE OR REPLACE FUNCTION edudhruv_search_tsv(content text)
RETURNS tsvector
LANGUAGE sql
IMMUTABLE
PARALLEL SAFE
AS $$
  SELECT to_tsvector('english'::regconfig, coalesce(content, ''))
$$;

-- ─── POSTS ──────────────────────────────────────────────────────────
ALTER TABLE posts
  ADD COLUMN IF NOT EXISTS search_tsv tsvector
  GENERATED ALWAYS AS (
    setweight(edudhruv_search_tsv(title),                             'A') ||
    setweight(edudhruv_search_tsv(excerpt),                           'B') ||
    setweight(edudhruv_search_tsv(array_to_string(tags, ' ')),        'B') ||
    setweight(edudhruv_search_tsv(focus_keyword),                     'C') ||
    setweight(edudhruv_search_tsv(category_slug),                     'C') ||
    setweight(edudhruv_search_tsv(content),                           'D')
  ) STORED;

CREATE INDEX IF NOT EXISTS idx_posts_search_tsv ON posts USING GIN(search_tsv);

-- ─── SCHOLARSHIPS ───────────────────────────────────────────────────
ALTER TABLE scholarships
  ADD COLUMN IF NOT EXISTS search_tsv tsvector
  GENERATED ALWAYS AS (
    setweight(edudhruv_search_tsv(scholarship_name),                          'A') ||
    setweight(edudhruv_search_tsv(university_name),                           'A') ||
    setweight(edudhruv_search_tsv(country),                                   'B') ||
    setweight(edudhruv_search_tsv(eligibility_summary),                       'C') ||
    setweight(edudhruv_search_tsv(intake),                                    'C') ||
    setweight(edudhruv_search_tsv(array_to_string(courses_covered, ' ')),     'C')
  ) STORED;

CREATE INDEX IF NOT EXISTS idx_scholarships_search_tsv ON scholarships USING GIN(search_tsv);

-- ─── UNIVERSITIES ───────────────────────────────────────────────────
ALTER TABLE universities
  ADD COLUMN IF NOT EXISTS search_tsv tsvector
  GENERATED ALWAYS AS (
    setweight(edudhruv_search_tsv(name),                                       'A') ||
    setweight(edudhruv_search_tsv(country),                                    'B') ||
    setweight(edudhruv_search_tsv(array_to_string(popular_courses, ' ')),      'C')
  ) STORED;

CREATE INDEX IF NOT EXISTS idx_universities_search_tsv ON universities USING GIN(search_tsv);

-- ─── pg_trgm for fuzzy matching (typos / partial words) ────────────
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX IF NOT EXISTS idx_posts_title_trgm ON posts USING gin (title gin_trgm_ops);
