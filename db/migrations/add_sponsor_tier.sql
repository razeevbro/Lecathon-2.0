-- Run in Neon SQL editor if sponsors table already exists.
ALTER TABLE sponsors
  ADD COLUMN IF NOT EXISTS tier TEXT NOT NULL DEFAULT 'supporting_partner';

ALTER TABLE sponsors DROP CONSTRAINT IF EXISTS sponsors_tier_check;

ALTER TABLE sponsors
  ADD CONSTRAINT sponsors_tier_check
  CHECK (tier IN ('title', 'platinum', 'gold', 'silver', 'supporting_partner', 'community_partner'));
