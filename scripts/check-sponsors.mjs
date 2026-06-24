import nextEnv from "@next/env";
import { neon } from "@neondatabase/serverless";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const sql = neon(process.env.DATABASE_URL);

try {
  const rows = await sql`SELECT * FROM sponsors ORDER BY id`;
  console.log("sponsors:", JSON.stringify(rows, null, 2));
} catch (e) {
  console.error("sponsors query failed:", e.message);
}

try {
  const cols = await sql`
    SELECT column_name, data_type, is_nullable, column_default
    FROM information_schema.columns
    WHERE table_name = 'sponsors'
    ORDER BY ordinal_position
  `;
  console.log("columns:", JSON.stringify(cols, null, 2));
} catch (e) {
  console.error("columns query failed:", e.message);
}
