import { defaultSettings } from "@/lib/defaults";

export type RevealTimeLeft = {
  days: number;
  hours: number;
  mins: number;
  secs: number;
};

const zeroTimeLeft: RevealTimeLeft = { days: 0, hours: 0, mins: 0, secs: 0 };

export { zeroTimeLeft };

export function getResultsAnnouncementDate(
  value?: string | null
): string {
  const candidate = value?.trim() || defaultSettings.resultsAnnouncementDate;
  const date = new Date(candidate);
  if (Number.isNaN(date.getTime())) {
    return defaultSettings.resultsAnnouncementDate;
  }
  return candidate;
}

export function getRevealTargetMs(value?: string | null): number {
  return new Date(getResultsAnnouncementDate(value)).getTime();
}

export function isResultsRevealed(
  value?: string | null,
  now = Date.now()
): boolean {
  const target = getRevealTargetMs(value);
  return !Number.isNaN(target) && now >= target;
}

export function getRevealTimeLeft(
  value?: string | null,
  now = Date.now()
): RevealTimeLeft {
  const target = getRevealTargetMs(value);
  const diff = target - now;
  if (Number.isNaN(target) || diff <= 0) {
    return zeroTimeLeft;
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    mins: Math.floor((diff / (1000 * 60)) % 60),
    secs: Math.floor((diff / 1000) % 60),
  };
}
