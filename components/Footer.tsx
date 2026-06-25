"use client";

import type { ReactNode } from "react";
import { Heart, GitBranch, Globe, Mail, Send } from "lucide-react";
import { ORGANIZER_NAME } from "@/app/constants";
import { FacebookIcon } from "@/components/icons/FacebookIcon";
import type { SiteSettings } from "@/lib/types/site";

type SocialLink = {
  href: string;
  label: string;
  render: () => ReactNode;
};

export default function Footer({ settings }: { settings: SiteSettings }) {
  const socials: SocialLink[] = [
    {
      href: settings.socialGithub,
      label: "GitHub",
      render: () => <GitBranch size={14} />,
    },
    {
      href: settings.socialInstagram,
      label: "Instagram",
      render: () => <Send size={14} />,
    },
    {
      href: settings.socialFacebook,
      label: "Facebook",
      render: () => <FacebookIcon size={14} />,
    },
    {
      href: settings.socialWebsite,
      label: "Website",
      render: () => <Globe size={14} />,
    },
  ].filter((s) => s.href?.trim());

  return (
    <footer className="border-t border-white/5 py-12 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10">
          <div className="flex flex-col gap-3">
            <div>
              <span className="text-white font-bold text-lg">
                Leca<span className="text-yellow-400">thon 2.0</span>
              </span>
              <p className="text-[10px] text-[#A3A3A3] tracking-wide leading-snug">
                by {ORGANIZER_NAME}
              </p>
            </div>
            <p className="text-[#A3A3A3] text-xs leading-relaxed max-w-xs">
              The flagship hackathon empowering the next generation of
              innovators and tech builders.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-white font-semibold text-sm">Quick Links</h4>
            {[
              { label: "About", href: "#about" },
              { label: "Open Theme", href: "#themes" },
              { label: "Schedule", href: "#schedule" },
              { label: "Prizes", href: "#prizes" },
              { label: "FAQs", href: "#faqs" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[#A3A3A3] text-xs hover:text-yellow-400 transition-colors w-fit"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-white font-semibold text-sm">Follow Us</h4>
            {socials.length > 0 ? (
              <div className="flex gap-3">
                {socials.map(({ href, label, render }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-8 h-8 rounded-full bg-[#1E1E1E] border border-white/10 flex items-center justify-center text-[#A3A3A3] hover:text-yellow-400 hover:border-yellow-400/30 transition-all"
                  >
                    {render()}
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-[#888] text-xs">
                Add social links in Admin → Site Settings
              </p>
            )}
            {settings.contactEmail ? (
              <a
                href={`mailto:${settings.contactEmail}`}
                className="text-[#A3A3A3] text-xs hover:text-yellow-400 flex items-center gap-1.5 w-fit"
              >
                <Mail size={12} />
                {settings.contactEmail}
              </a>
            ) : null}
            <p className="text-[#A3A3A3] text-xs mt-1">
              {ORGANIZER_NAME} · LEMSC, Rupandehi
            </p>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[#A3A3A3] text-xs">
            © 2026 Lecathon 2.0. All rights reserved.
          </p>
          <p className="text-[#A3A3A3] text-xs flex items-center gap-1">
            Built with <Heart size={10} className="text-yellow-400" /> by{" "}
            {ORGANIZER_NAME}
          </p>
        </div>
      </div>
    </footer>
  );
}
