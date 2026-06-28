import nextEnv from "@next/env";
import { neon } from "@neondatabase/serverless";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const sql = neon(process.env.DATABASE_URL);

await sql`
  CREATE TABLE IF NOT EXISTS results_teams (
    id SERIAL PRIMARY KEY,
    rank INTEGER NOT NULL UNIQUE CHECK (rank >= 1 AND rank <= 10),
    team_name TEXT NOT NULL,
    college TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )
`;

console.log("Created results_teams table");
