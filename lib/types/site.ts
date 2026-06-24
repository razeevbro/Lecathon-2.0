import type { SponsorTier } from "@/lib/sponsor-tiers";

export type Sponsor = {
  id: number;
  name: string;
  logoUrl: string | null;
  logoText: string | null;
  websiteUrl: string | null;
  tier: SponsorTier;
  sortOrder: number;
};

export type ProblemTheme = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  sortOrder: number;
};

export type ScheduleItem = {
  id: number;
  scheduleType: "leca_week" | "hackathon";
  time: string;
  phase: string;
  description: string;
  sortOrder: number;
};

export type Faq = {
  id: number;
  question: string;
  answer: string;
  sortOrder: number;
};

export type SiteSettings = {
  hackathonDate: string;
  scheduleDateLabel: string;
  scheduleDay1Label: string;
  scheduleDay2Label: string;
  prizePool: string;
  participantsLabel: string;
  durationLabel: string;
  venueName: string;
  venueAddress: string;
  registrationOpen: boolean;
  registrationDeadline: string;
  maxTeams: number;
  registrationClosedMessage: string;
  socialGithub: string;
  socialInstagram: string;
  socialFacebook: string;
  socialWebsite: string;
  contactEmail: string;
};

export type RegistrationAvailability = {
  open: boolean;
  reason?: string;
  spotsLeft?: number;
  teamCount: number;
};

export type SiteContent = {
  sponsors: Sponsor[];
  problemThemes: ProblemTheme[];
  faqs: Faq[];
  lecaWeekSchedule: ScheduleItem[];
  hackathonSchedule: ScheduleItem[];
  settings: SiteSettings;
  registrationThemes: string[];
  registration: RegistrationAvailability;
};

export type RegistrationRow = {
  id: number;
  teamLeaderName: string;
  teamLeaderEmail: string;
  phone: string;
  teamName: string;
  college: string;
  theme: string | null;
  videoUrl: string | null;
  projectDescription: string | null;
  teamSize: number;
  members: { name: string; email: string }[];
  registeredAt: string;
};
