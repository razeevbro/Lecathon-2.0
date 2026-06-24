import nextEnv from "@next/env";
import { neon } from "@neondatabase/serverless";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const sql = neon(process.env.DATABASE_URL);

const OPEN_THEME = {
  title: "Open Theme",
  description:
    "Build anything you're passionate about. No sector limits — bring your best ideas and create solutions across any domain.",
  imageUrl:
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
};

await sql`DELETE FROM problem_themes`;

await sql`
  INSERT INTO problem_themes (title, description, image_url, sort_order)
  VALUES (
    ${OPEN_THEME.title},
    ${OPEN_THEME.description},
    ${OPEN_THEME.imageUrl},
    0
  )
`;

const rows = await sql`SELECT id, title FROM problem_themes`;
console.log("Updated problem_themes:", rows);
