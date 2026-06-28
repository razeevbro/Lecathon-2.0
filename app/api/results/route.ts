import { NextResponse } from "next/server";
import { fetchSettingsFromDb } from "@/lib/admin-settings";
import { fetchResultsTeamsPublic } from "@/lib/results-teams";
import { isResultsRevealed } from "@/lib/results-announcement";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const settings = await fetchSettingsFromDb();
    const revealed = isResultsRevealed(settings.resultsAnnouncementDate);

    if (!revealed) {
      return NextResponse.json({ revealed: false, teams: [] });
    }

    const teams = await fetchResultsTeamsPublic();
    return NextResponse.json({ revealed: true, teams });
  } catch (error) {
    console.error("[GET /api/results]", error);
    return NextResponse.json(
      { revealed: false, teams: [], message: "Failed to load results." },
      { status: 500 }
    );
  }
}
