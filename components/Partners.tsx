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
  { grid: string; card: string; logo: string }
> = {
  title: {
    grid: "grid-cols-1 max-w-sm mx-auto",
    card: "min-h-[120px] p-6 border-yellow-400/30 bg-[#1a1a1a]",
    logo: "max-h-14",
  },
  platinum: {
    grid: "grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto",
    card: "min-h-[104px] p-5 border-white/15",
    logo: "max-h-12",
  },
  gold: {
    grid: "grid-cols-2 sm:grid-cols-3 max-w-3xl mx-auto",
    card: "min-h-[96px] p-5",
    logo: "max-h-10",
  },
  silver: {
    grid: "grid-cols-2 sm:grid-cols-4 max-w-4xl mx-auto",
    card: "min-h-[88px] p-5",
    logo: "max-h-10",
  },
  supporting_partner: {
    grid: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 max-w-5xl mx-auto",
    card: "min-h-[80px] p-4",
    logo: "max-h-8",
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
      className={`${layout.logo} max-w-full object-contain opacity-70 group-hover:opacity-100 transition-opacity`}
    />
  ) : (
    <span className="text-white/50 font-bold text-sm tracking-wide group-hover:text-white/80 transition-colors text-center">
      {partner.logoText || partner.name}
    </span>
  );

  const className = `flex items-center justify-center bg-[#1a1a1a] border border-white/8 rounded-xl hover:border-white/20 transition-all duration-300 group ${layout.card}`;

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
              <div
                className={`grid gap-3 sm:gap-4 ${TIER_LAYOUT[section.tier].grid}`}
              >
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
