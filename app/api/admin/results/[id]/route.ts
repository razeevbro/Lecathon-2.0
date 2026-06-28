import { NextRequest, NextResponse } from "next/server";
import { revalidatePublicSite } from "@/lib/revalidate-site";
import { requireSql } from "@/lib/sql";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const sql = requireSql();

    const existing = await sql`SELECT * FROM results_teams WHERE id = ${Number(id)}`;
    const row = existing[0] as
      | { rank: number; team_name: string; college: string | null }
      | undefined;

    if (!row) {
      return NextResponse.json(
        { success: false, message: "Result team not found." },
        { status: 404 }
      );
    }

    const teamName =
      body.teamName !== undefined ? body.teamName?.trim() : row.team_name;
    const college =
      body.college !== undefined
        ? body.college?.trim() || null
        : row.college;
    const rank = body.rank !== undefined ? Number(body.rank) : row.rank;

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

    const rows = await sql`
      UPDATE results_teams
      SET rank = ${rank}, team_name = ${teamName}, college = ${college}
      WHERE id = ${Number(id)}
      RETURNING *
    `;

    revalidatePublicSite();
    return NextResponse.json({ success: true, data: rows[0] });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update result team.";
    const isDuplicate =
      message.includes("results_teams_rank_key") ||
      message.includes("duplicate key");

    return NextResponse.json(
      {
        success: false,
        message: isDuplicate
          ? "That rank is already used by another team."
          : message,
      },
      { status: isDuplicate ? 400 : 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sql = requireSql();
    await sql`DELETE FROM results_teams WHERE id = ${Number(id)}`;
    revalidatePublicSite();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to delete result team.",
      },
      { status: 500 }
    );
  }
}
