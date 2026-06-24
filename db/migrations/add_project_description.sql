-- Run in Neon SQL editor if registrations table already exists.
ALTER TABLE registrations
  ADD COLUMN IF NOT EXISTS project_description TEXT;
