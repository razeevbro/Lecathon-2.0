-- Run in Neon SQL editor (or psql) after creating your database.

CREATE TABLE IF NOT EXISTS registrations (
  id SERIAL PRIMARY KEY,
  team_leader_name TEXT NOT NULL,
  team_leader_email TEXT NOT NULL,
  phone TEXT NOT NULL,
  team_name TEXT NOT NULL,
  college TEXT NOT NULL,
  theme TEXT,
  video_url TEXT,
  project_description TEXT,
  team_size INTEGER NOT NULL CHECK (team_size >= 1 AND team_size <= 4),
  members JSONB NOT NULL,
  registered_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS registrations_registered_at_idx
  ON registrations (registered_at DESC);

CREATE TABLE IF NOT EXISTS sponsors (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  logo_text TEXT,
  website_url TEXT,
  tier TEXT NOT NULL DEFAULT 'supporting_partner'
    CHECK (tier IN ('title', 'platinum', 'gold', 'silver', 'supporting_partner', 'community_partner')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS problem_themes (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS faqs (
  id SERIAL PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS schedule_items (
  id SERIAL PRIMARY KEY,
  schedule_type TEXT NOT NULL CHECK (schedule_type IN ('leca_week', 'hackathon')),
  time TEXT NOT NULL,
  phase TEXT NOT NULL,
  description TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS results_teams (
  id SERIAL PRIMARY KEY,
  rank INTEGER NOT NULL UNIQUE CHECK (rank >= 1 AND rank <= 10),
  team_name TEXT NOT NULL,
  college TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Rate limiting for registration and admin login (run once in Neon)
CREATE TABLE IF NOT EXISTS security_events (
  id SERIAL PRIMARY KEY,
  event_key TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS security_events_key_created_idx
  ON security_events (event_key, created_at DESC);
