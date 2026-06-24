"use client";

import { motion } from "framer-motion";
import {
  SPONSOR_TIERS,
  SPONSOR_TIER_LABELS,
  type SponsorTier,
} from "@/lib/sponsor-tiers";
import type { Sponsor } from "@/lib/types/site";

const TIER_LAYOUT: Record<
  SponsorTier,
  { grid: string; card: string; logo: string; text: string }
> = {
  title: {
    grid: "flex flex-wrap justify-center items-center gap-5 sm:gap-6",
    card: "p-2 sm:p-3 border-yellow-400/30",
    logo: "h-auto w-auto max-h-44 sm:max-h-56 md:max-h-64 max-w-[min(100vw-2rem,520px)]",
    text: "text-lg sm:text-xl",
  },
  platinum: {
    grid: "flex flex-wrap justify-center items-center gap-4 sm:gap-5 max-w-5xl mx-auto",
    card: "p-2 sm:p-3 border-white/15",
    logo: "h-auto w-auto max-h-32 sm:max-h-40 md:max-h-44 max-w-[min(100vw-2rem,400px)]",
    text: "text-base",
  },
  gold: {
    grid: "flex flex-wrap justify-center items-center gap-4 sm:gap-5 max-w-5xl mx-auto",
    card: "p-2 sm:p-3",
    logo: "h-auto w-auto max-h-28 sm:max-h-32 md:max-h-36 max-w-[min(100vw-2rem,320px)]",
    text: "text-sm",
  },
  silver: {
    grid: "flex flex-wrap justify-center items-center gap-4 sm:gap-5 max-w-6xl mx-auto",
    card: "p-2 sm:p-2.5",
    logo: "h-auto w-auto max-h-24 sm:max-h-28 md:max-h-32 max-w-[min(100vw-2rem,280px)]",
    text: "text-sm",
  },
  supporting_partner: {
    grid: "flex flex-wrap justify-center items-center gap-4 sm:gap-5 max-w-6xl mx-auto",
    card: "p-2",
    logo: "h-auto w-auto max-h-20 sm:max-h-24 md:max-h-28 max-w-[min(100vw-2rem,240px)]",
    text: "text-xs sm:text-sm",
  },
};

function SponsorCard({
  partner,
  index,
  tier,
}: {
  partner: Sponsor;
  index: number;
  tier: SponsorTier;
}) {
  const layout = TIER_LAYOUT[tier];
  const content = partner.logoUrl ? (
    <img
      src={partner.logoUrl}
      alt={partner.name}
      className={`${layout.logo} object-contain opacity-90 group-hover:opacity-100 transition-opacity`}
    />
  ) : (
    <span
      className={`text-white/50 font-bold tracking-wide group-hover:text-white/80 transition-colors text-center px-2 ${layout.text}`}
    >
      {partner.logoText || partner.name}
    </span>
  );

  const className = `inline-flex items-center justify-center w-fit h-fit bg-[#1a1a1a] border border-white/8 rounded-xl hover:border-white/20 transition-all duration-300 group ${layout.card}`;

  if (partner.websiteUrl) {
    return (
      <motion.a
        href={partner.websiteUrl}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.05 }}
        className={className}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className={className}
    >
      {content}
    </motion.div>
  );
}

export default function Partners({ sponsors }: { sponsors: Sponsor[] }) {
  const tierSections = SPONSOR_TIERS.map((tier) => ({
    tier,
    label: SPONSOR_TIER_LABELS[tier],
    items: sponsors.filter((s) => s.tier === tier),
  })).filter((section) => section.items.length > 0);

  return (
    <section className="py-20 border-t border-b border-white/5 relative overflow-hidden">
      <div className="absolute inset-0 bg-[#0d0d0d]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-yellow-400 text-xs font-semibold uppercase tracking-widest mb-3">
            Our Ecosystem
          </p>
          <h2 className="text-3xl font-black text-white">
            Partners & <span className="text-yellow-400">Sponsors</span>
          </h2>
        </motion.div>

        <div className="flex flex-col gap-12">
          {tierSections.map((section) => (
            <div key={section.tier}>
              <p className="text-center text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#888] mb-5">
                {section.label}
              </p>
              <div className={TIER_LAYOUT[section.tier].grid}>
                {section.items.map((partner, i) => (
                  <SponsorCard
                    key={partner.id}
                    partner={partner}
                    index={i}
                    tier={section.tier}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-[#A3A3A3] text-xs mt-10"
        >
          Interested in sponsoring Lecathon 2.0?{" "}
          <span className="text-yellow-400 underline cursor-pointer hover:text-yellow-300 transition-colors">
            Get in touch
          </span>
        </motion.p>
      </div>
    </section>
  );
}
