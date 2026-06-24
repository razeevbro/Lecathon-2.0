export const SPONSOR_TIERS = [
  "title",
  "platinum",
  "gold",
  "silver",
  "supporting_partner",
] as const;

export type SponsorTier = (typeof SPONSOR_TIERS)[number];

export const SPONSOR_TIER_LABELS: Record<SponsorTier, string> = {
  title: "Title",
  platinum: "Platinum",
  gold: "Gold",
  silver: "Silver",
  supporting_partner: "Supporting Partner",
};

export function isValidSponsorTier(value: string): value is SponsorTier {
  return SPONSOR_TIERS.includes(value as SponsorTier);
}

export function normalizeSponsorTier(
  value: string | null | undefined
): SponsorTier {
  if (value && isValidSponsorTier(value)) {
    return value;
  }
  return "supporting_partner";
}

export function sponsorTierSortIndex(tier: SponsorTier): number {
  return SPONSOR_TIERS.indexOf(tier);
}
