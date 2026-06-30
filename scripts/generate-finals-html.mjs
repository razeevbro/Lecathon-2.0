import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import nextEnv from "@next/env";
import { neon } from "@neondatabase/serverless";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const sql = neon(process.env.DATABASE_URL);

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function parseMembers(members) {
  if (Array.isArray(members)) return members;
  if (typeof members === "string") {
    try {
      return JSON.parse(members);
    } catch {
      return [];
    }
  }
  return [];
}

function formatDate(iso) {
  return new Date(iso).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kathmandu",
  });
}

function findRegistration(registrations, teamName) {
  const normalized = teamName.trim().toLowerCase();
  return registrations.find(
    (row) => row.team_name.trim().toLowerCase() === normalized
  );
}

function teamCardHtml(finalist, registration) {
  const members = registration ? parseMembers(registration.members) : [];
  const memberItems =
    members.length > 0
      ? members
          .map(
            (member) =>
              `<li><span class="member-name">${escapeHtml(member.name)}</span></li>`
          )
          .join("")
      : `<li class="member-missing">Member details not found in registrations.</li>`;

  const college = finalist.college || registration?.college || "—";

  return `
    <article class="team-card">
      <div class="rank-badge">#${finalist.rank}</div>
      <div class="team-body">
        <h2>${escapeHtml(finalist.team_name)}</h2>
        <p class="college">${escapeHtml(college)}</p>
        <div class="members">
          <p class="members-label">Team members</p>
          <ul>${memberItems}</ul>
        </div>
      </div>
    </article>
  `;
}

function buildHtml(finalists, generatedAt) {
  const cards =
    finalists.length > 0
      ? finalists.map((finalist) => teamCardHtml(finalist, finalist.registration)).join("\n")
      : `<p class="empty">No finalist teams have been added yet.</p>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Lecathon 2.0 — Top 10 Finalists</title>
  <style>
    :root { color-scheme: dark; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
      background: #0a0a0a;
      color: #f5f5f5;
      line-height: 1.5;
    }
    .page {
      max-width: 920px;
      margin: 0 auto;
      padding: 40px 20px 56px;
    }
    .hero {
      text-align: center;
      margin-bottom: 36px;
    }
    .eyebrow {
      display: inline-block;
      margin: 0 0 12px;
      padding: 6px 14px;
      border-radius: 999px;
      background: rgba(250, 204, 21, 0.1);
      border: 1px solid rgba(250, 204, 21, 0.25);
      color: #facc15;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }
    h1 {
      margin: 0 0 10px;
      font-size: clamp(2rem, 5vw, 2.75rem);
      font-weight: 900;
      letter-spacing: -0.03em;
    }
    .subtitle {
      margin: 0;
      color: #a3a3a3;
      font-size: 1rem;
      max-width: 560px;
      margin-inline: auto;
    }
    .meta {
      margin-top: 14px;
      color: #666;
      font-size: 0.85rem;
    }
    .teams {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .team-card {
      display: flex;
      gap: 18px;
      align-items: flex-start;
      background: linear-gradient(135deg, #141414, #111);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 18px;
      padding: 22px 24px;
      break-inside: avoid;
      page-break-inside: avoid;
    }
    .rank-badge {
      flex: 0 0 auto;
      width: 52px;
      height: 52px;
      display: grid;
      place-items: center;
      border-radius: 14px;
      background: rgba(250, 204, 21, 0.12);
      border: 1px solid rgba(250, 204, 21, 0.25);
      color: #facc15;
      font-size: 1.25rem;
      font-weight: 900;
    }
    .team-body { min-width: 0; flex: 1; }
    .team-body h2 {
      margin: 0 0 4px;
      font-size: 1.35rem;
      font-weight: 800;
    }
    .college {
      margin: 0 0 16px;
      color: #888;
      font-size: 0.92rem;
    }
    .members-label {
      margin: 0 0 8px;
      color: #facc15;
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }
    .members ul {
      margin: 0;
      padding-left: 18px;
      color: #d4d4d4;
    }
    .members li { margin: 4px 0; }
    .member-name { font-weight: 600; color: #fff; }
    .member-missing { color: #888; list-style: none; margin-left: -18px; }
    .empty {
      text-align: center;
      color: #888;
      padding: 48px 20px;
      border: 1px dashed rgba(255, 255, 255, 0.12);
      border-radius: 16px;
    }
    .footer {
      margin-top: 36px;
      text-align: center;
      color: #666;
      font-size: 0.85rem;
    }
    @media print {
      body { background: #fff; color: #111; }
      .team-card {
        background: #fff;
        border-color: #ddd;
      }
      .rank-badge {
        background: #fef9c3;
        border-color: #facc15;
        color: #854d0e;
      }
      .team-body h2, .member-name { color: #111; }
      .college, .members ul, .subtitle, .meta, .footer { color: #444; }
    }
  </style>
</head>
<body>
  <main class="page">
    <header class="hero">
      <p class="eyebrow">Lecathon 2.0</p>
      <h1>Top 10 Finalist Teams</h1>
      <p class="subtitle">
        Congratulations to the teams selected for further processing in Lecathon 2.0.
      </p>
      <p class="meta">Generated ${escapeHtml(generatedAt)}</p>
    </header>
    <section class="teams">
      ${cards}
    </section>
    <p class="footer">Robotics Club of Lumbini Engineering Management &amp; Science College</p>
  </main>
</body>
</html>`;
}

const resultsRows = await sql`
  SELECT rank, team_name, college
  FROM results_teams
  ORDER BY rank ASC, id ASC
`;

const registrationRows = await sql`
  SELECT team_name, college, members
  FROM registrations
`;

const finalists = resultsRows.map((row) => ({
  ...row,
  registration: findRegistration(registrationRows, row.team_name),
}));

const generatedAt = formatDate(new Date().toISOString());
const html = buildHtml(finalists, generatedAt);
const outputPath = resolve(process.cwd(), "public", "top-10-finals.html");

writeFileSync(outputPath, html, "utf8");

console.log(`Wrote ${finalists.length} finalist team(s) to ${outputPath}`);
