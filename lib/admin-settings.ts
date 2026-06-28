import { getDefaultSiteContent } from "@/lib/defaults";
import type { SiteSettings } from "@/lib/types/site";
import { getSql } from "@/lib/sql";
import { parseSiteSettings } from "@/lib/site-settings";

export async function fetchSettingsFromDb(): Promise<SiteSettings> {
  const defaults = getDefaultSiteContent().settings;
  const sql = getSql();
  if (!sql) {
    return defaults;
  }

  const rows = await sql`SELECT key, value FROM site_settings`;
  const map = new Map(
    (rows as { key: string; value: string }[]).map((r) => [r.key, r.value])
  );

  return { ...defaults, ...parseSiteSettings(map) };
}
