import { defaultSettings } from "@/lib/defaults";
import type { SiteSettings } from "@/lib/types/site";

export const SETTINGS_DB_KEYS = {
  hackathonDate: "hackathon_date",
  scheduleDateLabel: "schedule_date_label",
  scheduleDay1Label: "schedule_day1_label",
  scheduleDay2Label: "schedule_day2_label",
  prizePool: "prize_pool",
  participantsLabel: "participants_label",
  durationLabel: "duration_label",
  venueName: "venue_name",
  venueAddress: "venue_address",
  registrationOpen: "registration_open",
  registrationDeadline: "registration_deadline",
  maxTeams: "max_teams",
  registrationClosedMessage: "registration_closed_message",
  resultsAnnouncementDate: "results_announcement_date",
  socialGithub: "social_github",
  socialInstagram: "social_instagram",
  socialFacebook: "social_facebook",
  socialWebsite: "social_website",
  contactEmail: "contact_email",
} as const;

export function parseSiteSettings(
  map: Map<string, string>
): SiteSettings {
  const d = defaultSettings;
  const bool = (key: string, fallback: boolean) => {
    const v = map.get(key);
    if (v === undefined) return fallback;
    return v === "true";
  };
  const num = (key: string, fallback: number) => {
    const v = map.get(key);
    if (v === undefined || v === "") return fallback;
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  };

  return {
    hackathonDate: map.get(SETTINGS_DB_KEYS.hackathonDate) ?? d.hackathonDate,
    scheduleDateLabel:
      map.get(SETTINGS_DB_KEYS.scheduleDateLabel) ?? d.scheduleDateLabel,
    scheduleDay1Label:
      map.get(SETTINGS_DB_KEYS.scheduleDay1Label) ?? d.scheduleDay1Label,
    scheduleDay2Label:
      map.get(SETTINGS_DB_KEYS.scheduleDay2Label) ?? d.scheduleDay2Label,
    prizePool: map.get(SETTINGS_DB_KEYS.prizePool) ?? d.prizePool,
    participantsLabel:
      map.get(SETTINGS_DB_KEYS.participantsLabel) ?? d.participantsLabel,
    durationLabel: map.get(SETTINGS_DB_KEYS.durationLabel) ?? d.durationLabel,
    venueName: map.get(SETTINGS_DB_KEYS.venueName) ?? d.venueName,
    venueAddress: map.get(SETTINGS_DB_KEYS.venueAddress) ?? d.venueAddress,
    registrationOpen: bool(SETTINGS_DB_KEYS.registrationOpen, d.registrationOpen),
    registrationDeadline:
      map.get(SETTINGS_DB_KEYS.registrationDeadline) || d.registrationDeadline,
    maxTeams: num(SETTINGS_DB_KEYS.maxTeams, d.maxTeams),
    registrationClosedMessage:
      map.get(SETTINGS_DB_KEYS.registrationClosedMessage) ??
      d.registrationClosedMessage,
    resultsAnnouncementDate:
      map.get(SETTINGS_DB_KEYS.resultsAnnouncementDate) ||
      d.resultsAnnouncementDate,
    socialGithub: map.get(SETTINGS_DB_KEYS.socialGithub) ?? d.socialGithub,
    socialInstagram:
      map.get(SETTINGS_DB_KEYS.socialInstagram) ?? d.socialInstagram,
    socialFacebook: map.get(SETTINGS_DB_KEYS.socialFacebook) ?? d.socialFacebook,
    socialWebsite: map.get(SETTINGS_DB_KEYS.socialWebsite) ?? d.socialWebsite,
    contactEmail: map.get(SETTINGS_DB_KEYS.contactEmail) ?? d.contactEmail,
  };
}

export function siteSettingsToDbEntries(
  settings: Partial<SiteSettings>
): [string, string][] {
  const entries: [string, string | undefined][] = [
    [SETTINGS_DB_KEYS.hackathonDate, settings.hackathonDate],
    [SETTINGS_DB_KEYS.scheduleDateLabel, settings.scheduleDateLabel],
    [SETTINGS_DB_KEYS.scheduleDay1Label, settings.scheduleDay1Label],
    [SETTINGS_DB_KEYS.scheduleDay2Label, settings.scheduleDay2Label],
    [SETTINGS_DB_KEYS.prizePool, settings.prizePool],
    [SETTINGS_DB_KEYS.participantsLabel, settings.participantsLabel],
    [SETTINGS_DB_KEYS.durationLabel, settings.durationLabel],
    [SETTINGS_DB_KEYS.venueName, settings.venueName],
    [SETTINGS_DB_KEYS.venueAddress, settings.venueAddress],
    [
      SETTINGS_DB_KEYS.registrationOpen,
      settings.registrationOpen === undefined
        ? undefined
        : String(settings.registrationOpen),
    ],
    [SETTINGS_DB_KEYS.registrationDeadline, settings.registrationDeadline],
    [
      SETTINGS_DB_KEYS.maxTeams,
      settings.maxTeams === undefined ? undefined : String(settings.maxTeams),
    ],
    [
      SETTINGS_DB_KEYS.registrationClosedMessage,
      settings.registrationClosedMessage,
    ],
    [SETTINGS_DB_KEYS.resultsAnnouncementDate, settings.resultsAnnouncementDate],
    [SETTINGS_DB_KEYS.socialGithub, settings.socialGithub],
    [SETTINGS_DB_KEYS.socialInstagram, settings.socialInstagram],
    [SETTINGS_DB_KEYS.socialFacebook, settings.socialFacebook],
    [SETTINGS_DB_KEYS.socialWebsite, settings.socialWebsite],
    [SETTINGS_DB_KEYS.contactEmail, settings.contactEmail],
  ];

  return entries.filter(
    (entry): entry is [string, string] => entry[1] !== undefined
  );
}

export function isRegistrationOpenBySettings(
  settings: SiteSettings,
  teamCount: number
): { open: boolean; reason?: string; spotsLeft?: number } {
  if (!settings.registrationOpen) {
    return {
      open: false,
      reason: settings.registrationClosedMessage,
    };
  }

  if (settings.registrationDeadline) {
    const deadline = new Date(settings.registrationDeadline);
    if (!Number.isNaN(deadline.getTime()) && Date.now() > deadline.getTime()) {
      return {
        open: false,
        reason: "Registration deadline has passed.",
      };
    }
  }

  if (settings.maxTeams > 0 && teamCount >= settings.maxTeams) {
    return {
      open: false,
      reason: "All registration slots are full.",
      spotsLeft: 0,
    };
  }

  const spotsLeft =
    settings.maxTeams > 0 ? Math.max(0, settings.maxTeams - teamCount) : undefined;

  return { open: true, spotsLeft };
}
