import { NextRequest, NextResponse } from "next/server";
import { sendThankYouToRegistrations } from "@/lib/email";
import { listRegistrations } from "@/lib/registrations";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as {
      ids?: number[];
    };

    const allRows = await listRegistrations();
    const ids = body.ids?.filter((id) => Number.isFinite(id));

    const targets =
      ids && ids.length > 0
        ? allRows.filter((row) => ids.includes(row.id))
        : allRows;

    if (targets.length === 0) {
      return NextResponse.json(
        { success: false, message: "No registrations found to email." },
        { status: 400 }
      );
    }

    const result = await sendThankYouToRegistrations(targets);

    return NextResponse.json({
      success: result.failed === 0,
      message:
        result.failed === 0
          ? `Thank-you email sent to ${result.sent} team leader${result.sent === 1 ? "" : "s"}.`
          : `Sent ${result.sent}, failed ${result.failed}. Check server logs for details.`,
      data: result,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to send emails.",
      },
      { status: 500 }
    );
  }
}
