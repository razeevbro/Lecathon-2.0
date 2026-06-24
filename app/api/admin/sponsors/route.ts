import { NextRequest, NextResponse } from "next/server";
import { revalidatePublicSite } from "@/lib/revalidate-site";
import { normalizeSponsorTier } from "@/lib/sponsor-tiers";
import { requireSql } from "@/lib/sql";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const sql = requireSql();
    const rows = await sql`
      SELECT * FROM sponsors ORDER BY sort_order ASC, id ASC
    `;
    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to load sponsors.",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = body.name?.trim();
    if (!name) {
      return NextResponse.json(
        { success: false, message: "Sponsor name is required." },
        { status: 400 }
      );
    }

    const sql = requireSql();
    const tier = normalizeSponsorTier(body.tier);
    const rows = await sql`
      INSERT INTO sponsors (name, logo_url, logo_text, website_url, tier, sort_order)
      VALUES (
        ${name},
        ${body.logoUrl?.trim() || null},
        ${body.logoText?.trim() || name},
        ${body.websiteUrl?.trim() || null},
        ${tier},
        ${Number(body.sortOrder) || 0}
      )
      RETURNING *
    `;

    revalidatePublicSite();
    return NextResponse.json({ success: true, data: rows[0] }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to create sponsor.",
      },
      { status: 500 }
    );
  }
}
