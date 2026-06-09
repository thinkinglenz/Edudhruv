-- ═══════════════════════════════════════════════════════════════════
-- Site-wide full-text search using Postgres tsvector
-- ═══════════════════════════════════════════════════════════════════
--
-- Approach: regular tsvector columns + trigger functions that update
-- them on insert/update. This is more reliable than generated columns
-- because Postgres won't inline trigger functions, so the IMMUTABLE
-- check that breaks generated columns doesn't apply.
-- ═══════════════════════════════════════════════════════════════════

-- ─── POSTS ──────────────────────────────────────────────────────────
ALTER TABLE posts ADD COLUMN IF NOT EXISTS search_tsv tsvector;

CREATE OR REPLACE FUNCTION posts_search_tsv_update() RETURNS trigger AS $$
BEGIN
  NEW.search_tsv :=
    setweight(to_tsvector('english', coalesce(NEW.title,          '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.excerpt,        '')), 'B') ||
    setweight(to_tsvector('english', coalesce(array_to_string(NEW.tags, ' '), '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.focus_keyword,  '')), 'C') ||
    setweight(to_tsvector('english', coalesce(NEW.category_slug,  '')), 'C') ||
    setweight(to_tsvector('english', coalesce(NEW.content,        '')), 'D');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_posts_search_tsv ON posts;
CREATE TRIGGER trg_posts_search_tsv
  BEFORE INSERT OR UPDATE OF title, excerpt, tags, focus_keyword, category_slug, content
  ON posts
  FOR EACH ROW EXECUTE FUNCTION posts_search_tsv_update();

-- Backfill existing rows
UPDATE posts SET search_tsv = NULL;  -- triggers UPDATE → fills via trigger

CREATE INDEX IF NOT EXISTS idx_posts_search_tsv ON posts USING GIN(search_tsv);

-- ─── SCHOLARSHIPS ───────────────────────────────────────────────────
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS search_tsv tsvector;

CREATE OR REPLACE FUNCTION scholarships_search_tsv_update() RETURNS trigger AS $$
BEGIN
  NEW.search_tsv :=
    setweight(to_tsvector('english', coalesce(NEW.scholarship_name,    '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.university_name,     '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.country,             '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.eligibility_summary, '')), 'C') ||
    setweight(to_tsvector('english', coalesce(NEW.intake,              '')), 'C') ||
    setweight(to_tsvector('english', coalesce(array_to_string(NEW.courses_covered, ' '), '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_scholarships_search_tsv ON scholarships;
CREATE TRIGGER trg_scholarships_search_tsv
  BEFORE INSERT OR UPDATE OF scholarship_name, university_name, country, eligibility_summary, intake, courses_covered
  ON scholarships
  FOR EACH ROW EXECUTE FUNCTION scholarships_search_tsv_update();

UPDATE scholarships SET search_tsv = NULL;  -- backfill

CREATE INDEX IF NOT EXISTS idx_scholarships_search_tsv ON scholarships USING GIN(search_tsv);

-- ─── UNIVERSITIES ───────────────────────────────────────────────────
ALTER TABLE universities ADD COLUMN IF NOT EXISTS search_tsv tsvector;

CREATE OR REPLACE FUNCTION universities_search_tsv_update() RETURNS trigger AS $$
BEGIN
  NEW.search_tsv :=
    setweight(to_tsvector('english', coalesce(NEW.name,    '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.country, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(array_to_string(NEW.popular_courses, ' '), '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_universities_search_tsv ON universities;
CREATE TRIGGER trg_universities_search_tsv
  BEFORE INSERT OR UPDATE OF name, country, popular_courses
  ON universities
  FOR EACH ROW EXECUTE FUNCTION universities_search_tsv_update();

UPDATE universities SET search_tsv = NULL;  -- backfill

CREATE INDEX IF NOT EXISTS idx_universities_search_tsv ON universities USING GIN(search_tsv);

-- ─── pg_trgm for fuzzy matching (typos / partial words) ────────────
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX IF NOT EXISTS idx_posts_title_trgm ON posts USING gin (title gin_trgm_ops);
