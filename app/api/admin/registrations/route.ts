import { NextRequest, NextResponse } from "next/server";
import { listRegistrations } from "@/lib/registrations";
import {
  registrationsToCsv,
  registrationsToXlsx,
} from "@/lib/registrations-export";

export const dynamic = "force-dynamic";

function exportFilename(ext: "csv" | "xlsx"): string {
  return `lecathon-registrations-${new Date().toISOString().slice(0, 10)}.${ext}`;
}

export async function GET(req: NextRequest) {
  try {
    const q = req.nextUrl.searchParams.get("q") ?? undefined;
    const theme = req.nextUrl.searchParams.get("theme") ?? undefined;
    const rows = await listRegistrations({ q, theme });
    const format = req.nextUrl.searchParams.get("format");

    if (format === "csv") {
      const csv = registrationsToCsv(rows);
      return new NextResponse(csv, {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="${exportFilename("csv")}"`,
        },
      });
    }

    if (format === "xlsx") {
      const xlsx = await registrationsToXlsx(rows);
      return new NextResponse(new Uint8Array(xlsx), {
        status: 200,
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": `attachment; filename="${exportFilename("xlsx")}"`,
        },
      });
    }

    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to load registrations.",
      },
      { status: 500 }
    );
  }
}
