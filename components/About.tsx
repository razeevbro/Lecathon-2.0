"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { ORGANIZER_NAME } from "@/app/constants";
import CountdownTimer from "@/components/Countdown";

export default function About({
  hackathonDate,
  venueName,
  venueAddress,
}: {
  hackathonDate: string;
  venueName: string;
  venueAddress: string;
}) {

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      {/* BG glow */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-yellow-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left — Image Collage */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative h-[380px] sm:h-[420px]"
          >
            {/* Main large image */}
            <div className="absolute top-0 left-0 w-3/4 h-3/4 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=500&q=80"
                alt="Students coding at Lecathon 2.0 hackathon in Nepal"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-transparent" />
            </div>
            {/* Overlapping secondary image */}
            <div className="absolute bottom-0 right-0 w-2/3 h-2/3 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&q=80"
                alt="Hackathon team collaborating on a project at LEMSC"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tl from-black/40 to-transparent" />
            </div>
            {/* Accent card overlay */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-yellow-400/90 rounded-xl px-4 py-2 shadow-xl z-10">
              <p className="text-black text-xs font-black uppercase tracking-wider">LECATHON 2.0</p>
            </div>
            {/* Decorative dots */}
            <div className="absolute -bottom-4 -left-4 w-24 h-24 opacity-20"
              style={{
                backgroundImage: 'radial-gradient(circle, #FACC15 1px, transparent 1px)',
                backgroundSize: '10px 10px',
              }}
            />
          </motion.div>

          {/* Right — About Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col gap-6"
          >
            <div>
              <p className="text-yellow-400 text-xs font-semibold uppercase tracking-widest mb-3">About the Event</p>
              <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                About <span className="text-yellow-400">LECATHON 2.0</span>
              </h2>
            </div>

            <p className="text-[#A3A3A3] text-sm leading-relaxed">
            Lecathon 2.0 is the flagship hackathon by {ORGANIZER_NAME}, designed to bring together the
              brightest young minds to solve real-world problems through technology. Whether you&apos;re a
              coder, designer, or visionary — this is your stage to shine.
            </p>
            <p className="text-[#A3A3A3] text-sm leading-relaxed">
              Over the course of one intense, idea-fuelled week and a 36-hour offline sprint, participants
              will collaborate, innovate, and build products that matter.
            </p>

            {/* Venue */}
            <div className="flex items-start gap-3 bg-[#1E1E1E] rounded-xl p-4 border border-white/5">
              <MapPin size={18} className="text-yellow-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-[#A3A3A3] uppercase tracking-wider mb-1">Venue</p>
                <p className="text-white font-semibold text-sm">{venueName}</p>
                <p className="text-[#A3A3A3] text-xs mt-0.5">{venueAddress}</p>
                {venueAddress ? (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${venueName}, ${venueAddress}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-yellow-400 text-xs mt-2 inline-block hover:text-yellow-300"
                  >
                    View on Google Maps →
                  </a>
                ) : null}
              </div>
            </div>

            <CountdownTimer title="Event Starts In" isoDate={hackathonDate} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
