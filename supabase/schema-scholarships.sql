-- ═══════════════════════════════════════════════════════
-- EduDhruv — Scholarship Discovery System
-- Run this in Supabase SQL Editor (after schema.sql)
-- ═══════════════════════════════════════════════════════

-- ─── UNIVERSITIES QUEUE ────────────────────────────────
-- The agent processes one university per day from this queue.
create table if not exists universities (
  id                  uuid primary key default gen_random_uuid(),
  name                text not null,
  country             text not null,
  country_code        text,                              -- 'US', 'UK', 'CA', 'AU' etc
  city                text,
  official_website    text,
  qs_rank             integer,                           -- World ranking (lower = better)
  popular_courses     text[] default '{}',               -- ['MS Computer Science', 'MBA', 'PhD Economics']
  status              text not null default 'pending'    -- pending, researched, skipped, failed
                      check (status in ('pending','researched','skipped','failed')),
  researched_at       timestamptz,
  research_error      text,
  created_at          timestamptz not null default now(),
  unique(name, country)
);

create index if not exists idx_universities_status_rank on universities(status, qs_rank);

-- ─── SCHOLARSHIPS ─────────────────────────────────────
create table if not exists scholarships (
  id                  uuid primary key default gen_random_uuid(),
  university_id       uuid references universities(id) on delete set null,
  university_name     text not null,                     -- denormalized for quick reads
  country             text not null,
  scholarship_name    text not null,
  coverage_percentage integer default 100               -- 100 means "fully funded"
                      check (coverage_percentage between 0 and 100),
  amount_inr          text,                              -- e.g. "₹40,00,000 – ₹80,00,000"
  amount_native       text,                              -- e.g. "$50,000 USD/year"
  courses_covered     text[] default '{}',               -- ['MS Computer Science', 'MBA']
  eligibility_summary text,                              -- 2-3 sentence summary
  indian_eligible     boolean default true,
  application_deadline date,
  intake              text,                              -- 'Fall 2026', 'Spring 2027'
  official_url        text,                              -- direct link to scholarship page
  status              text not null default 'active'     -- active, expired, draft
                      check (status in ('active','expired','draft')),
  /* Auto-generated post details */
  post_slug           text unique,                       -- e.g. /scholarship/harvard-knight-hennessy-2026
  featured_image_url  text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index if not exists idx_scholarships_active on scholarships(status, application_deadline) where status = 'active';
create index if not exists idx_scholarships_university on scholarships(university_id);
create index if not exists idx_scholarships_courses on scholarships using gin(courses_covered);

-- ─── ROW LEVEL SECURITY ───────────────────────────────
alter table universities enable row level security;
create policy "Public read universities" on universities for select using (true);

alter table scholarships enable row level security;
create policy "Public read active scholarships"
  on scholarships for select using (status = 'active');

-- ═══════════════════════════════════════════════════════
-- SEED — Top 50 universities globally for Indian students
-- ═══════════════════════════════════════════════════════
insert into universities (name, country, country_code, city, official_website, qs_rank, popular_courses) values
  -- USA (top 15)
  ('Harvard University',                     'USA',       'US', 'Cambridge MA',     'https://www.harvard.edu',         4,   array['MBA','MS Computer Science','PhD','JD','Public Policy']),
  ('Massachusetts Institute of Technology',  'USA',       'US', 'Cambridge MA',     'https://www.mit.edu',             1,   array['MS Computer Science','MS Data Science','MEng','PhD']),
  ('Stanford University',                    'USA',       'US', 'Stanford CA',      'https://www.stanford.edu',        5,   array['MS Computer Science','MBA','MS AI','PhD']),
  ('Yale University',                        'USA',       'US', 'New Haven CT',     'https://www.yale.edu',            20,  array['MBA','PhD','Public Health','Law']),
  ('Princeton University',                   'USA',       'US', 'Princeton NJ',     'https://www.princeton.edu',       22,  array['PhD','MS Engineering','Public Policy']),
  ('Columbia University',                    'USA',       'US', 'New York NY',      'https://www.columbia.edu',        23,  array['MBA','MS Data Science','MS Financial Engineering','Journalism']),
  ('University of Chicago',                  'USA',       'US', 'Chicago IL',       'https://www.uchicago.edu',        21,  array['MBA','MS Economics','PhD','Public Policy']),
  ('University of Pennsylvania',             'USA',       'US', 'Philadelphia PA',  'https://www.upenn.edu',           11,  array['MBA','MS Computer Science','Engineering']),
  ('University of California Berkeley',      'USA',       'US', 'Berkeley CA',      'https://www.berkeley.edu',        12,  array['MS Computer Science','MBA','MS Data Science','PhD']),
  ('UCLA',                                   'USA',       'US', 'Los Angeles CA',   'https://www.ucla.edu',            42,  array['MS Computer Science','MBA','Engineering','Film']),
  ('Carnegie Mellon University',             'USA',       'US', 'Pittsburgh PA',    'https://www.cmu.edu',             58,  array['MS Computer Science','MS AI','MISM','Robotics']),
  ('Cornell University',                     'USA',       'US', 'Ithaca NY',        'https://www.cornell.edu',         16,  array['MS Engineering','MEng','MBA','Hospitality']),
  ('University of Michigan',                 'USA',       'US', 'Ann Arbor MI',     'https://umich.edu',               33,  array['MS Computer Science','MBA','Engineering','MS Information']),
  ('Duke University',                        'USA',       'US', 'Durham NC',        'https://duke.edu',                57,  array['MBA','MS Engineering Management','Law']),
  ('Northwestern University',                'USA',       'US', 'Evanston IL',      'https://www.northwestern.edu',    47,  array['MBA','Journalism','MS Computer Science']),

  -- UK (top 8)
  ('University of Oxford',                   'UK',        'GB', 'Oxford',           'https://www.ox.ac.uk',            3,   array['MBA','MSc Computer Science','MPhil','DPhil']),
  ('University of Cambridge',                'UK',        'GB', 'Cambridge',        'https://www.cam.ac.uk',           2,   array['MPhil','PhD','MEng','MBA']),
  ('Imperial College London',                'UK',        'GB', 'London',           'https://www.imperial.ac.uk',      6,   array['MSc Computing','MEng','MBA','MSc Finance']),
  ('London School of Economics',             'UK',        'GB', 'London',           'https://www.lse.ac.uk',           50,  array['MSc Economics','MSc Finance','MPA','MPP']),
  ('University College London',              'UK',        'GB', 'London',           'https://www.ucl.ac.uk',           9,   array['MSc Computer Science','MArch','MSc Economics','PhD']),
  ('University of Edinburgh',                'UK',        'GB', 'Edinburgh',        'https://www.ed.ac.uk',            27,  array['MSc Data Science','MSc AI','MBA','PhD']),
  ('University of Manchester',               'UK',        'GB', 'Manchester',       'https://www.manchester.ac.uk',    34,  array['MSc Computer Science','MBA','MSc Finance']),
  ('Kings College London',                   'UK',        'GB', 'London',           'https://www.kcl.ac.uk',           40,  array['MSc Data Science','MBBS','MA International Relations']),

  -- Canada (top 6)
  ('University of Toronto',                  'Canada',    'CA', 'Toronto',          'https://www.utoronto.ca',         25,  array['MS Computer Science','MBA','MEng','MS Statistics']),
  ('McGill University',                      'Canada',    'CA', 'Montreal',         'https://www.mcgill.ca',           29,  array['MBA','MS Computer Science','MEng','MD']),
  ('University of British Columbia',         'Canada',    'CA', 'Vancouver',        'https://www.ubc.ca',              34,  array['MS Computer Science','MBA','MEng','MD']),
  ('University of Waterloo',                 'Canada',    'CA', 'Waterloo',         'https://uwaterloo.ca',            115, array['MS Computer Science','MEng','MMath','MBA']),
  ('McMaster University',                    'Canada',    'CA', 'Hamilton',         'https://www.mcmaster.ca',         189, array['MEng','MBA','MD','MHSc']),
  ('University of Alberta',                  'Canada',    'CA', 'Edmonton',         'https://www.ualberta.ca',         111, array['MS Computer Science','MEng','MBA','PhD']),

  -- Australia (top 6)
  ('University of Melbourne',                'Australia', 'AU', 'Melbourne',        'https://www.unimelb.edu.au',      19,  array['MBA','MS Computer Science','MS Data Science','MEng']),
  ('University of Sydney',                   'Australia', 'AU', 'Sydney',           'https://www.sydney.edu.au',       18,  array['MBA','MS Computer Science','MEng','MD']),
  ('Australian National University',         'Australia', 'AU', 'Canberra',         'https://www.anu.edu.au',          30,  array['MS Computing','MS Engineering','MA International Affairs']),
  ('Monash University',                      'Australia', 'AU', 'Melbourne',        'https://www.monash.edu',          37,  array['MBA','MS Computer Science','MEng','Pharmacy']),
  ('University of New South Wales',          'Australia', 'AU', 'Sydney',           'https://www.unsw.edu.au',         19,  array['MS Computer Science','MEng','MBA','MS Data Science']),
  ('University of Queensland',               'Australia', 'AU', 'Brisbane',         'https://www.uq.edu.au',           40,  array['MEng','MBA','MS Computer Science','MD']),

  -- Germany (top 5)
  ('Technical University of Munich',         'Germany',   'DE', 'Munich',           'https://www.tum.de',              28,  array['MSc Computer Science','MSc Data Engineering','MBA','MSc Robotics']),
  ('Heidelberg University',                  'Germany',   'DE', 'Heidelberg',       'https://www.uni-heidelberg.de',   87,  array['MSc Physics','MSc Computer Science','MSc Molecular Biotech']),
  ('RWTH Aachen University',                 'Germany',   'DE', 'Aachen',           'https://www.rwth-aachen.de',      99,  array['MSc Computer Science','MSc Mechanical Engineering','MSc Robotics']),
  ('LMU Munich',                             'Germany',   'DE', 'Munich',           'https://www.lmu.de',              63,  array['MSc Computer Science','MSc Data Science','MBA']),
  ('Humboldt University of Berlin',          'Germany',   'DE', 'Berlin',           'https://www.hu-berlin.de',        116, array['MSc Computer Science','MSc Economics','MSc Statistics']),

  -- Singapore + Asia (top 4)
  ('National University of Singapore',       'Singapore', 'SG', 'Singapore',        'https://www.nus.edu.sg',          8,   array['MSc Computing','MBA','MSc Data Science','MEng']),
  ('Nanyang Technological University',       'Singapore', 'SG', 'Singapore',        'https://www.ntu.edu.sg',          15,  array['MSc Computer Science','MBA','MEng','MSc AI']),
  ('University of Hong Kong',                'Hong Kong', 'HK', 'Hong Kong',        'https://www.hku.hk',              17,  array['MSc Computer Science','MBA','MEng','MFin']),
  ('Tsinghua University',                    'China',     'CN', 'Beijing',          'https://www.tsinghua.edu.cn',     14,  array['MSc Computer Science','MBA','MEng','MSc AI']),

  -- Europe (top 6)
  ('ETH Zurich',                             'Switzerland','CH','Zurich',           'https://ethz.ch',                 7,   array['MSc Computer Science','MSc Robotics','MSc Data Science']),
  ('EPFL',                                   'Switzerland','CH','Lausanne',         'https://www.epfl.ch',             26,  array['MSc Computer Science','MSc Data Science','MSc Robotics']),
  ('KU Leuven',                              'Belgium',   'BE', 'Leuven',           'https://www.kuleuven.be',         61,  array['MSc Engineering','MSc Computer Science','MBA']),
  ('Trinity College Dublin',                 'Ireland',   'IE', 'Dublin',           'https://www.tcd.ie',              81,  array['MSc Computer Science','MBA','MSc Data Science']),
  ('Sciences Po',                            'France',    'FR', 'Paris',            'https://www.sciencespo.fr',       295, array['MPA','MA International Affairs','MSc Economics']),
  ('University of Amsterdam',                'Netherlands','NL','Amsterdam',        'https://www.uva.nl',              53,  array['MSc Data Science','MSc Economics','MSc AI','MBA'])
on conflict (name, country) do nothing;
