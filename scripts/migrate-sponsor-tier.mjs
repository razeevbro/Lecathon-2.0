import nextEnv from "@next/env";
import { neon } from "@neondatabase/serverless";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const sql = neon(process.env.DATABASE_URL);

await sql`
  ALTER TABLE sponsors
  ADD COLUMN IF NOT EXISTS tier TEXT NOT NULL DEFAULT 'supporting_partner'
`;

await sql`
  ALTER TABLE sponsors DROP CONSTRAINT IF EXISTS sponsors_tier_check
`;

await sql`
  ALTER TABLE sponsors
  ADD CONSTRAINT sponsors_tier_check
  CHECK (tier IN ('title', 'platinum', 'gold', 'silver', 'supporting_partner'))
`;

console.log("Added tier column to sponsors");
