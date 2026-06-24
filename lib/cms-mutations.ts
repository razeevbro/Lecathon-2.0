import { requireSql } from "@/lib/sql";
import { normalizeSponsorTier } from "@/lib/sponsor-tiers";

export async function updateSponsor(
  id: number,
  body: {
    name?: string;
    logoUrl?: string | null;
    logoText?: string | null;
    websiteUrl?: string | null;
    tier?: string;
    sortOrder?: number;
  }
) {
  const sql = requireSql();
  const existing = await sql`SELECT * FROM sponsors WHERE id = ${id}`;
  const row = existing[0] as
    | {
        name: string;
        logo_url: string | null;
        logo_text: string | null;
        website_url: string | null;
        tier: string;
        sort_order: number;
      }
    | undefined;

  if (!row) {
    return null;
  }

  const name = body.name?.trim() ?? row.name;
  const logoUrl =
    body.logoUrl !== undefined ? body.logoUrl?.trim() || null : row.logo_url;
  const logoText =
    body.logoText !== undefined ? body.logoText?.trim() || null : row.logo_text;
  const websiteUrl =
    body.websiteUrl !== undefined
      ? body.websiteUrl?.trim() || null
      : row.website_url;
  const tier =
    body.tier !== undefined
      ? normalizeSponsorTier(body.tier)
      : normalizeSponsorTier(row.tier);
  const sortOrder =
    body.sortOrder !== undefined ? body.sortOrder : row.sort_order;

  const rows = await sql`
    UPDATE sponsors
    SET
      name = ${name},
      logo_url = ${logoUrl},
      logo_text = ${logoText},
      website_url = ${websiteUrl},
      tier = ${tier},
      sort_order = ${sortOrder}
    WHERE id = ${id}
    RETURNING *
  `;

  return rows[0] ?? null;
}

export async function updateTheme(
  id: number,
  body: {
    title?: string;
    description?: string;
    imageUrl?: string;
    sortOrder?: number;
  }
) {
  const sql = requireSql();
  const existing = await sql`SELECT * FROM problem_themes WHERE id = ${id}`;
  const row = existing[0] as
    | {
        title: string;
        description: string;
        image_url: string;
        sort_order: number;
      }
    | undefined;

  if (!row) {
    return null;
  }

  const rows = await sql`
    UPDATE problem_themes
    SET
      title = ${body.title?.trim() ?? row.title},
      description = ${body.description?.trim() ?? row.description},
      image_url = ${body.imageUrl?.trim() ?? row.image_url},
      sort_order = ${body.sortOrder !== undefined ? body.sortOrder : row.sort_order}
    WHERE id = ${id}
    RETURNING *
  `;

  return rows[0] ?? null;
}

export async function updateFaq(
  id: number,
  body: { question?: string; answer?: string; sortOrder?: number }
) {
  const sql = requireSql();
  const existing = await sql`SELECT * FROM faqs WHERE id = ${id}`;
  const row = existing[0] as
    | { question: string; answer: string; sort_order: number }
    | undefined;

  if (!row) {
    return null;
  }

  const rows = await sql`
    UPDATE faqs
    SET
      question = ${body.question?.trim() ?? row.question},
      answer = ${body.answer?.trim() ?? row.answer},
      sort_order = ${body.sortOrder !== undefined ? body.sortOrder : row.sort_order}
    WHERE id = ${id}
    RETURNING *
  `;

  return rows[0] ?? null;
}

export async function updateScheduleItem(
  id: number,
  body: {
    scheduleType?: "leca_week" | "hackathon";
    time?: string;
    phase?: string;
    description?: string;
    sortOrder?: number;
  }
) {
  const sql = requireSql();
  const existing = await sql`SELECT * FROM schedule_items WHERE id = ${id}`;
  const row = existing[0] as
    | {
        schedule_type: "leca_week" | "hackathon";
        time: string;
        phase: string;
        description: string;
        sort_order: number;
      }
    | undefined;

  if (!row) {
    return null;
  }

  const rows = await sql`
    UPDATE schedule_items
    SET
      schedule_type = ${body.scheduleType ?? row.schedule_type},
      time = ${body.time?.trim() ?? row.time},
      phase = ${body.phase?.trim() ?? row.phase},
      description = ${body.description?.trim() ?? row.description},
      sort_order = ${body.sortOrder !== undefined ? body.sortOrder : row.sort_order}
    WHERE id = ${id}
    RETURNING *
  `;

  return rows[0] ?? null;
}
