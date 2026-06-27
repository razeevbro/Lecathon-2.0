import { requireSql } from "@/lib/sql";
import type { RegistrationRow } from "@/lib/types/site";

type RegistrationDbRow = {
  id: number;
  team_leader_name: string;
  team_leader_email: string;
  phone: string;
  team_name: string;
  college: string;
  theme: string | null;
  video_url: string | null;
  project_description: string | null;
  team_size: number;
  members: { name: string; email: string }[];
  registered_at: string;
};

function parseMembers(
  members: RegistrationDbRow["members"]
): { name: string; email: string }[] {
  if (Array.isArray(members)) {
    return members;
  }
  if (typeof members === "string") {
    try {
      return JSON.parse(members) as { name: string; email: string }[];
    } catch {
      return [];
    }
  }
  return [];
}

function mapRow(row: RegistrationDbRow): RegistrationRow {
  return {
    id: row.id,
    teamLeaderName: row.team_leader_name,
    teamLeaderEmail: row.team_leader_email,
    phone: row.phone,
    teamName: row.team_name,
    college: row.college,
    theme: row.theme,
    videoUrl: row.video_url,
    projectDescription: row.project_description,
    teamSize: row.team_size,
    members: parseMembers(row.members),
    registeredAt: row.registered_at,
  };
}

export async function listRegistrations(options?: {
  q?: string;
  theme?: string;
}): Promise<RegistrationRow[]> {
  const sql = requireSql();
  const q = options?.q?.trim().toLowerCase();
  const theme = options?.theme?.trim();

  const rows =
    theme && theme !== "all"
      ? await sql`
          SELECT *
          FROM registrations
          WHERE theme = ${theme}
          ORDER BY registered_at DESC
        `
      : await sql`
          SELECT *
          FROM registrations
          ORDER BY registered_at DESC
        `;

  let mapped = (rows as RegistrationDbRow[]).map(mapRow);

  if (q) {
    mapped = mapped.filter(
      (row) =>
        row.teamName.toLowerCase().includes(q) ||
        row.teamLeaderName.toLowerCase().includes(q) ||
        row.teamLeaderEmail.toLowerCase().includes(q) ||
        row.college.toLowerCase().includes(q) ||
        (row.projectDescription?.toLowerCase().includes(q) ?? false)
    );
  }

  return mapped;
}

export async function deleteRegistration(id: number): Promise<boolean> {
  const sql = requireSql();
  const rows = await sql`
    DELETE FROM registrations
    WHERE id = ${id}
    RETURNING id
  `;
  return rows.length > 0;
}
