import { requireSql } from "@/lib/sql";
import type { ResultsTeam } from "@/lib/types/site";

type ResultsTeamRow = {
  id: number;
  rank: number;
  team_name: string;
  college: string | null;
};

function mapRow(row: ResultsTeamRow): ResultsTeam {
  return {
    id: row.id,
    rank: row.rank,
    teamName: row.team_name,
    college: row.college,
  };
}

export async function listResultsTeams(): Promise<ResultsTeam[]> {
  const sql = requireSql();
  const rows = await sql`
    SELECT * FROM results_teams ORDER BY rank ASC, id ASC
  `;
  return (rows as ResultsTeamRow[]).map(mapRow);
}

export async function fetchResultsTeamsPublic(): Promise<ResultsTeam[]> {
  try {
    const { getSql } = await import("@/lib/sql");
    const sql = getSql();
    if (!sql) {
      return [];
    }
    const rows = await sql`
      SELECT * FROM results_teams ORDER BY rank ASC, id ASC
    `;
    return (rows as ResultsTeamRow[]).map(mapRow);
  } catch {
    return [];
  }
}
