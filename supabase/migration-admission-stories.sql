-- Student admission stories — UGC for SEO + emotional engagement
-- Submissions are moderated (status='pending') before showing publicly.

CREATE TABLE IF NOT EXISTS admission_stories (
  id           SERIAL PRIMARY KEY,
  slug         TEXT UNIQUE NOT NULL,
  -- Submitter info
  name         TEXT NOT NULL,
  email        TEXT NOT NULL,
  city_india   TEXT,
  -- Admission details
  university   TEXT NOT NULL,
  country      TEXT NOT NULL,
  program      TEXT NOT NULL,       -- "MS Computer Science"
  degree       TEXT NOT NULL,       -- "Masters", "MBA", "PhD", "Bachelor's"
  intake_year  INTEGER NOT NULL,    -- 2027
  -- Their stats
  cgpa         NUMERIC(3,1),
  gre_score    INTEGER,
  gmat_score   INTEGER,
  ielts_band   NUMERIC(2,1),
  toefl_score  INTEGER,
  work_years   INTEGER,
  -- The story
  headline     TEXT NOT NULL,       -- "How I got into MIT with 8.0 CGPA"
  body         TEXT NOT NULL,       -- full story
  advice       TEXT,                -- 1-2 paragraphs of advice
  -- Funding
  funding_source TEXT,              -- "Scholarship", "Loan + savings", "Family"
  scholarship_name TEXT,            -- if applicable
  -- Moderation
  status       TEXT NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending', 'approved', 'rejected')),
  approved_at  TIMESTAMPTZ,
  moderator    TEXT,
  -- Tracking
  ip_address   TEXT,
  user_agent   TEXT,
  views        INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_stories_status_created ON admission_stories(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_stories_country        ON admission_stories(country);
CREATE INDEX IF NOT EXISTS idx_stories_university     ON admission_stories(university);
CREATE INDEX IF NOT EXISTS idx_stories_slug           ON admission_stories(slug);

ALTER TABLE admission_stories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read approved stories"
  ON admission_stories FOR SELECT
  USING (status = 'approved');

CREATE POLICY "Service role full access"
  ON admission_stories
  USING (auth.role() = 'service_role');
