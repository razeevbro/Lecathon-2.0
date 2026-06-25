"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Clock } from "lucide-react";
import { ORGANIZER_NAME } from "@/app/constants";

function useCountdown(isoDate: string) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    const target = new Date(isoDate);
    const tick = () => {
      const now = new Date().getTime();
      const diff = target.getTime() - now;
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, mins: 0, secs: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        mins: Math.floor((diff / (1000 * 60)) % 60),
        secs: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [isoDate]);

  return timeLeft;
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-[#1E1E1E] border border-white/10 rounded-xl flex items-center justify-center shadow-lg">
        <span className="text-2xl sm:text-3xl font-black text-yellow-400">
          {String(value).padStart(2, "0")}
        </span>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/5" />
      </div>
      <span className="text-[10px] uppercase tracking-widest text-[#A3A3A3] font-medium">{label}</span>
    </div>
  );
}

export default function About({
  hackathonDate,
  venueName,
  venueAddress,
}: {
  hackathonDate: string;
  venueName: string;
  venueAddress: string;
}) {
  const timeLeft = useCountdown(hackathonDate);

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

            {/* Countdown */}
            <div className="mt-2">
              <div className="flex items-center gap-2 mb-4">
                <Clock size={14} className="text-yellow-400" />
                <p className="text-xs text-[#A3A3A3] uppercase tracking-wider font-semibold">Event Starts In</p>
              </div>
              <div className="flex items-center gap-3">
                <CountdownUnit value={timeLeft.days} label="Days" />
                <span className="text-yellow-400 text-2xl font-black -mt-6">:</span>
                <CountdownUnit value={timeLeft.hours} label="Hours" />
                <span className="text-yellow-400 text-2xl font-black -mt-6">:</span>
                <CountdownUnit value={timeLeft.mins} label="Mins" />
                <span className="text-yellow-400 text-2xl font-black -mt-6">:</span>
                <CountdownUnit value={timeLeft.secs} label="Secs" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
