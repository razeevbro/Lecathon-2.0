import { getSql } from "@/lib/sql";
import type { ValidatedRegistration } from "./registration";

export async function countRegistrations(): Promise<number> {
  const sql = getSql();
  if (!sql) {
    return 0;
  }
  const rows = await sql`SELECT COUNT(*)::int AS count FROM registrations`;
  return (rows[0] as { count: number } | undefined)?.count ?? 0;
}

export async function findDuplicateRegistration(
  leaderEmail: string,
  teamName: string,
  memberEmails: string[]
): Promise<string | null> {
  const sql = getSql();
  if (!sql) {
    return null;
  }

  const normalizedTeam = teamName.trim().toLowerCase();
  const emailSet = new Set(
    [leaderEmail, ...memberEmails].map((e) => e.trim().toLowerCase())
  );

  const rows = await sql`
    SELECT team_name, team_leader_email, members
    FROM registrations
  `;

  for (const row of rows as {
    team_name: string;
    team_leader_email: string;
    members: { name: string; email: string }[] | string;
  }[]) {
    if (row.team_name.trim().toLowerCase() === normalizedTeam) {
      return "A team with this name is already registered.";
    }

    const registeredEmails = new Set<string>();
    registeredEmails.add(row.team_leader_email.trim().toLowerCase());

    const members =
      typeof row.members === "string"
        ? (JSON.parse(row.members) as { email: string }[])
        : row.members;
    for (const member of members) {
      registeredEmails.add(member.email.trim().toLowerCase());
    }

    for (const email of emailSet) {
      if (registeredEmails.has(email)) {
        return `Email ${email} is already registered on another team.`;
      }
    }
  }

  return null;
}

export async function saveRegistration(
  data: ValidatedRegistration
): Promise<number | null> {
  const sql = getSql();
  if (!sql) {
    return null;
  }
  const rows = await sql`
    INSERT INTO registrations (
      team_leader_name,
      team_leader_email,
      phone,
      team_name,
      college,
      theme,
      video_url,
      project_description,
      team_size,
      members
    )
    VALUES (
      ${data.name},
      ${data.email},
      ${data.phone},
      ${data.teamName},
      ${data.college},
      ${data.theme || null},
      ${data.videoUrl},
      ${data.projectDescription},
      ${data.teamSize},
      ${JSON.stringify(data.members)}::jsonb
    )
    RETURNING id
  `;

  const row = rows[0] as { id: number } | undefined;
  return row?.id ?? null;
}
