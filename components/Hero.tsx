"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, FileText, Monitor, Cpu, Globe, Zap } from "lucide-react";
import { RESULTS_ANNOUNCEMENT_DATE } from "@/app/constants";
import type { RegistrationAvailability, ResultsTeam } from "@/lib/types/site";
import RegistrationModal from "./RegistrationModal";
import RegisterButton from "./RegisterButton";
import CountdownTimer from "./Countdown";
import ResultsAnnouncement from "./ResultsAnnouncement";

export default function Hero({
  registrationThemes,
  participantsLabel,
  durationLabel,
  prizePool,
  registrationDeadline,
  registration,
  resultsTeams = [],
}: {
  registrationThemes: string[];
  participantsLabel: string;
  durationLabel: string;
  prizePool: string;
  registrationDeadline: string;
  registration: RegistrationAvailability;
  resultsTeams?: ResultsTeam[];
}) {
  const [regOpen, setRegOpen] = useState(false);
  const showRegistrationCountdown =
    registration.open &&
    registrationDeadline &&
    !Number.isNaN(new Date(registrationDeadline).getTime());
  const showResultsSection = !registration.open;

  return (
    <>
      <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
        {/* Background gradient glow */}
        <div className="absolute top-1/4 left-[-100px] w-[500px] h-[500px] bg-yellow-500/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-[-100px] w-[400px] h-[400px] bg-yellow-500/5 rounded-full blur-[100px] pointer-events-none" />

        {/* Floating geometric shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="float-shape-1 absolute top-1/4 left-[8%] w-8 h-8 border-2 border-yellow-400/30 rounded-sm" />
          <div className="float-shape-2 absolute top-1/3 left-[15%] w-5 h-5 bg-yellow-400/20 rounded-sm" />
          <div className="float-shape-3 absolute bottom-1/3 left-[12%] w-6 h-6 border border-white/10 rotate-45" />
          <div className="float-shape-1 absolute top-1/5 right-[10%] w-10 h-10 border border-yellow-400/20 rounded-full" />
          <div className="float-shape-2 absolute top-2/3 right-[18%] w-4 h-4 bg-yellow-400/10 rotate-45" />
          <div className="float-shape-3 absolute top-[15%] right-[25%] w-3 h-3 bg-white/10 rounded-full" />
          {/* Triangle shapes */}
          <div className="float-shape-1 absolute top-[60%] left-[5%]" style={{
            width: 0, height: 0,
            borderLeft: '10px solid transparent',
            borderRight: '10px solid transparent',
            borderBottom: '18px solid rgba(250,204,21,0.2)',
          }} />
          <div className="float-shape-2 absolute top-[20%] right-[8%]" style={{
            width: 0, height: 0,
            borderLeft: '8px solid transparent',
            borderRight: '8px solid transparent',
            borderBottom: '14px solid rgba(250,204,21,0.15)',
          }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-20">
            {/* Left Column */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="flex flex-col gap-6"
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/20 rounded-full px-4 py-1.5 w-fit">
                <Zap size={14} className="text-yellow-400" />
                <span className="text-yellow-400 text-xs font-semibold tracking-wide uppercase">LECATHON 2026</span>
              </div>

              {/* Main heading */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight text-white">
                Learn,{" "}
                <span className="text-yellow-400">Build</span>, Innovate
              </h1>

              {/* Event title */}
              <div className="flex flex-col gap-1">
                <p className="text-[#A3A3A3] text-sm font-medium tracking-widest uppercase">Presenting</p>
                <h2 className="text-4xl sm:text-5xl font-black text-stroke-yellow leading-none tracking-tight">
                 Lecathon 2.0
                </h2>
              </div>

              {/* Description */}
              <p className="text-[#A3A3A3] text-base leading-relaxed max-w-md">
                Join the most exciting hackathon of the year. Build real solutions,
                compete with the best minds, and win exciting prizes and opportunities.
              </p>

              {showRegistrationCountdown ? (
                <CountdownTimer
                  title="Registration Closes In"
                  isoDate={registrationDeadline}
                />
              ) : null}

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 pt-2">
                <RegisterButton
                  variant="hero"
                  registration={registration}
                  onOpen={() => setRegOpen(true)}
                >
                  {registration.open ? (
                    <>
                      Register Now <ArrowRight size={16} />
                    </>
                  ) : (
                    "Registration Closed"
                  )}
                </RegisterButton>
                <motion.a
                  href="#themes"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-7 py-3 bg-[#1E1E1E] text-white font-semibold rounded-full text-sm border border-white/10 hover:border-white/30 transition-all"
                >
                  <FileText size={16} className="text-[#A3A3A3]" />
                  View Open Theme
                </motion.a>
              </div>

              {showResultsSection ? (
                <ResultsAnnouncement
                  announcementDate={RESULTS_ANNOUNCEMENT_DATE}
                  teams={resultsTeams}
                />
              ) : null}

              {/* Stats */}
              <div className="flex gap-8 pt-4 border-t border-white/5">
                {[
                  {
                    value:
                      registration.teamCount > 0
                        ? String(registration.teamCount)
                        : participantsLabel,
                    label:
                      registration.teamCount > 0
                        ? "Teams Registered"
                        : "Participants",
                  },
                  { value: durationLabel, label: "of innovation" },
                  { value: prizePool, label: "Prize Pool" },
                ].map((stat) => (
                  <div key={stat.label} className="flex flex-col">
                    <span className="text-xl font-black text-yellow-400">{stat.value}</span>
                    <span className="text-xs text-[#A3A3A3]">{stat.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right Column — 3D Isometric Illustration Placeholder */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
              className="flex justify-center items-center"
            >
              <div className="relative w-full max-w-md aspect-square">
                {/* Outer glow ring */}
                <div className="absolute inset-0 rounded-full bg-yellow-400/5 blur-3xl" />

                {/* Main isometric card */}
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* Isometric grid-like illustration */}
                  <div className="relative">
                    {/* Monitor body */}
                    <div className="w-72 h-48 bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] rounded-2xl border border-white/10 shadow-2xl flex flex-col p-4 gap-2">
                      {/* Screen */}
                      <div className="flex-1 bg-[#111] rounded-xl border border-yellow-400/20 overflow-hidden relative">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-orange-400" />
                        <div className="p-3 flex flex-col gap-1.5 mt-2">
                          <div className="h-2 w-3/4 bg-yellow-400/20 rounded-full" />
                          <div className="h-2 w-1/2 bg-white/10 rounded-full" />
                          <div className="h-2 w-2/3 bg-white/10 rounded-full" />
                          <div className="h-2 w-1/3 bg-yellow-400/10 rounded-full" />
                        </div>
                        {/* Monitor glow */}
                        <Monitor size={40} className="absolute bottom-2 right-2 text-yellow-400/20" />
                      </div>
                      {/* Bottom icons */}
                      <div className="flex gap-2 justify-end">
                        <div className="w-6 h-1.5 bg-yellow-400/40 rounded-full" />
                        <div className="w-6 h-1.5 bg-white/10 rounded-full" />
                      </div>
                    </div>

                    {/* Floating cards */}
                    <motion.div
                      animate={{ y: [-6, 6, -6] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute -top-8 -right-10 bg-[#1E1E1E] border border-yellow-400/30 rounded-xl p-3 shadow-xl"
                    >
                      <Cpu size={20} className="text-yellow-400 mb-1" />
                      <div className="h-1.5 w-14 bg-yellow-400/30 rounded-full" />
                      <div className="h-1.5 w-10 bg-white/10 rounded-full mt-1" />
                    </motion.div>

                    <motion.div
                      animate={{ y: [6, -6, 6] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute -bottom-6 -left-10 bg-[#1E1E1E] border border-white/10 rounded-xl p-3 shadow-xl"
                    >
                      <Globe size={20} className="text-blue-400 mb-1" />
                      <div className="h-1.5 w-12 bg-white/20 rounded-full" />
                      <div className="h-1.5 w-8 bg-white/10 rounded-full mt-1" />
                    </motion.div>

                    {/* Yellow accent orb */}
                    <motion.div
                      animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.7, 0.4] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                      className="absolute -top-4 -left-4 w-12 h-12 bg-yellow-400/30 rounded-full blur-md"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}
                      className="absolute -bottom-4 -right-4 w-10 h-10 bg-orange-400/20 rounded-full blur-md"
                    />
                  </div>
                </div>

                {/* Corner decorations */}
                <div className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-yellow-400/20 rounded-tl-xl" />
                <div className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-yellow-400/20 rounded-br-xl" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <RegistrationModal
        open={regOpen}
        onClose={() => setRegOpen(false)}
        registrationThemes={registrationThemes}
        registration={registration}
      />
    </>
  );
}
