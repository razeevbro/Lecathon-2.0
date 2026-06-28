import { getSql } from "@/lib/sql";
import { getDefaultSiteContent } from "@/lib/defaults";
import { countRegistrations } from "@/lib/db";
import {
  isRegistrationOpenBySettings,
  parseSiteSettings,
  siteSettingsToDbEntries,
} from "@/lib/site-settings";
import { normalizeSponsorTier, sponsorTierSortIndex } from "@/lib/sponsor-tiers";
import type {
  Faq,
  ProblemTheme,
  ResultsTeam,
  ScheduleItem,
  SiteContent,
  SiteSettings,
  Sponsor,
} from "@/lib/types/site";

type SponsorRow = {
  id: number;
  name: string;
  logo_url: string | null;
  logo_text: string | null;
  website_url: string | null;
  tier?: string | null;
  sort_order: number;
};

type ThemeRow = {
  id: number;
  title: string;
  description: string;
  image_url: string;
  sort_order: number;
};

type FaqRow = {
  id: number;
  question: string;
  answer: string;
  sort_order: number;
};

type ScheduleRow = {
  id: number;
  schedule_type: "leca_week" | "hackathon";
  time: string;
  phase: string;
  description: string;
  sort_order: number;
};

type ResultsTeamRow = {
  id: number;
  rank: number;
  team_name: string;
  college: string | null;
};

function mapResultsTeam(row: ResultsTeamRow): ResultsTeam {
  return {
    id: row.id,
    rank: row.rank,
    teamName: row.team_name,
    college: row.college,
  };
}

function mapSponsor(row: SponsorRow): Sponsor {
  return {
    id: row.id,
    name: row.name,
    logoUrl: row.logo_url,
    logoText: row.logo_text,
    websiteUrl: row.website_url,
    tier: normalizeSponsorTier(row.tier),
    sortOrder: row.sort_order,
  };
}

function sortSponsors(sponsors: Sponsor[]): Sponsor[] {
  return [...sponsors].sort((a, b) => {
    const tierDiff =
      sponsorTierSortIndex(a.tier) - sponsorTierSortIndex(b.tier);
    if (tierDiff !== 0) {
      return tierDiff;
    }
    return a.sortOrder - b.sortOrder;
  });
}

function mapTheme(row: ThemeRow): ProblemTheme {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    imageUrl: row.image_url,
    sortOrder: row.sort_order,
  };
}

function mapFaq(row: FaqRow): Faq {
  return {
    id: row.id,
    question: row.question,
    answer: row.answer,
    sortOrder: row.sort_order,
  };
}

function mapSchedule(row: ScheduleRow): ScheduleItem {
  return {
    id: row.id,
    scheduleType: row.schedule_type,
    time: row.time,
    phase: row.phase,
    description: row.description,
    sortOrder: row.sort_order,
  };
}

async function fetchSettings(sql: ReturnType<typeof getSql>): Promise<SiteSettings> {
  const defaults = getDefaultSiteContent().settings;
  if (!sql) {
    return defaults;
  }

  const rows = await sql`SELECT key, value FROM site_settings`;
  const map = new Map(
    (rows as { key: string; value: string }[]).map((r) => [r.key, r.value])
  );

  return parseSiteSettings(map);
}

export async function getSiteContent(): Promise<SiteContent> {
  const sql = getSql();
  const defaults = getDefaultSiteContent();

  if (!sql) {
    return defaults;
  }

  try {
    const [sponsorRows, themeRows, faqRows, scheduleRows, settings, teamCount] =
      await Promise.all([
        sql`SELECT * FROM sponsors ORDER BY sort_order ASC, id ASC`,
        sql`SELECT * FROM problem_themes ORDER BY sort_order ASC, id ASC`,
        sql`SELECT * FROM faqs ORDER BY sort_order ASC, id ASC`,
        sql`SELECT * FROM schedule_items ORDER BY sort_order ASC, id ASC`,
        fetchSettings(sql),
        countRegistrations(),
      ]);

    let resultsTeams: ResultsTeam[] = [];
    try {
      const resultsRows =
        await sql`SELECT * FROM results_teams ORDER BY rank ASC, id ASC`;
      resultsTeams = (resultsRows as ResultsTeamRow[]).map(mapResultsTeam);
    } catch (resultsError) {
      console.warn("[getSiteContent] results_teams unavailable:", resultsError);
    }

    const sponsors = sortSponsors((sponsorRows as SponsorRow[]).map(mapSponsor));
    const problemThemes = (themeRows as ThemeRow[]).map(mapTheme);
    const faqs = (faqRows as FaqRow[]).map(mapFaq);
    const schedules = (scheduleRows as ScheduleRow[]).map(mapSchedule);

    const lecaWeekSchedule = schedules.filter(
      (s) => s.scheduleType === "leca_week"
    );
    const hackathonSchedule = schedules.filter(
      (s) => s.scheduleType === "hackathon"
    );

    const themesForRegistration =
      problemThemes.length > 0 ? problemThemes : defaults.problemThemes;

    return {
      sponsors: sponsors.length > 0 ? sponsors : defaults.sponsors,
      problemThemes: themesForRegistration,
      faqs: faqs.length > 0 ? faqs : defaults.faqs,
      lecaWeekSchedule:
        lecaWeekSchedule.length > 0
          ? lecaWeekSchedule
          : defaults.lecaWeekSchedule,
      hackathonSchedule:
        hackathonSchedule.length > 0
          ? hackathonSchedule
          : defaults.hackathonSchedule,
      settings,
      registrationThemes: themesForRegistration.map((t) => t.title),
      registration: {
        ...isRegistrationOpenBySettings(settings, teamCount),
        teamCount,
      },
      resultsTeams,
    };
  } catch (error) {
    console.error("[getSiteContent] Database fetch failed:", error);
    return defaults;
  }
}

export async function updateSiteSettings(
  settings: Partial<SiteSettings>
): Promise<void> {
  const sql = getSql();
  if (!sql) {
    throw new Error("DATABASE_URL is not configured.");
  }

  const entries = siteSettingsToDbEntries(settings);

  for (const [key, value] of entries) {
    if (value === undefined) {
      continue;
    }
    await sql`
      INSERT INTO site_settings (key, value)
      VALUES (${key}, ${value})
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
    `;
  }
}
