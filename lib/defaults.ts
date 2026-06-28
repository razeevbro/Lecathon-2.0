import type { SiteContent, SiteSettings } from "@/lib/types/site";
import {
  problemThemes,
  partners,
  lecaWeekSchedule,
  hackathonSchedule,
  faqs,
} from "@/app/constants";

export const defaultSettings: SiteSettings = {
  hackathonDate: "2026-06-26T09:00:00",
  scheduleDateLabel: "Asar 18,19, 2083",
  scheduleDay1Label: "Day 1",
  scheduleDay2Label: "Day 2",
  prizePool: "NPR 1Lakh+",
  participantsLabel: "50+",
  durationLabel: "48hrs",
  venueName:
    "Lumbini Engineering Management & Science college",
  venueAddress: "Tilottama-7, Rupandehi, Nepal",
  registrationOpen: true,
  registrationDeadline: "2026-06-27T23:00:00+05:45",
  maxTeams: 0,
  registrationClosedMessage:
    "Registration is closed. Follow Robotics Club of Lumbini Engineering Management & Science College for updates.",
  socialGithub: "",
  socialInstagram: "",
  socialFacebook: "",
  socialWebsite: "",
  contactEmail: "",
};

export function getDefaultSiteContent(): SiteContent {
  return {
    sponsors: partners.map((p, i) => ({
      id: i + 1,
      name: p.name,
      logoUrl: null,
      logoText: p.logo.trim() || p.name,
      websiteUrl: null,
      tier: "supporting_partner" as const,
      sortOrder: i,
    })),
    problemThemes: problemThemes.map((t, i) => ({
      id: t.id,
      title: t.title.trim(),
      description: t.description,
      imageUrl: t.image,
      sortOrder: i,
    })),
    faqs: faqs.map((f, i) => ({
      id: i + 1,
      question: f.question,
      answer: f.answer,
      sortOrder: i,
    })),
    lecaWeekSchedule: lecaWeekSchedule.map((s, i) => ({
      id: i + 1,
      scheduleType: "leca_week" as const,
      time: s.time,
      phase: s.phase,
      description: s.description,
      sortOrder: i,
    })),
    hackathonSchedule: hackathonSchedule.map((s, i) => ({
      id: i + 100,
      scheduleType: "hackathon" as const,
      time: s.time,
      phase: s.phase,
      description: s.description,
      sortOrder: i,
    })),
    settings: defaultSettings,
    registrationThemes: problemThemes.map((t) => t.title.trim()),
    registration: {
      open: true,
      teamCount: 0,
    },
    resultsTeams: [],
  };
}
