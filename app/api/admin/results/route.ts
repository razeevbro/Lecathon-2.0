import { NextRequest, NextResponse } from "next/server";
import { listResultsTeams } from "@/lib/results-teams";
import { revalidatePublicSite } from "@/lib/revalidate-site";
import { requireSql } from "@/lib/sql";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await listResultsTeams();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to load results.",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const teamName = body.teamName?.trim();
    const college = body.college?.trim() || null;
    const rank = Number(body.rank);

    if (!teamName) {
      return NextResponse.json(
        { success: false, message: "Team name is required." },
        { status: 400 }
      );
    }

    if (!Number.isInteger(rank) || rank < 1 || rank > 10) {
      return NextResponse.json(
        { success: false, message: "Rank must be between 1 and 10." },
        { status: 400 }
      );
    }

    const sql = requireSql();
    const rows = await sql`
      INSERT INTO results_teams (rank, team_name, college)
      VALUES (${rank}, ${teamName}, ${college})
      RETURNING *
    `;

    revalidatePublicSite();
    return NextResponse.json({ success: true, data: rows[0] }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to add result team.";
    const isDuplicate =
      message.includes("results_teams_rank_key") ||
      message.includes("duplicate key");

    return NextResponse.json(
      {
        success: false,
        message: isDuplicate
          ? "That rank is already used. Edit or delete the existing team first."
          : message,
      },
      { status: isDuplicate ? 400 : 500 }
    );
  }
}
