"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";
import type { ProblemTheme, RegistrationAvailability } from "@/lib/types/site";
import RegistrationModal from "./RegistrationModal";
import RegisterButton from "./RegisterButton";

export default function ProblemThemes({
  problemThemes,
  registrationThemes,
  registration,
}: {
  problemThemes: ProblemTheme[];
  registrationThemes: string[];
  registration: RegistrationAvailability;
}) {
  const [regOpen, setRegOpen] = useState(false);
  const theme = problemThemes[0];

  return (
    <>
      <section id="themes" className="py-24 relative overflow-hidden">
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-yellow-400/8 rounded-full blur-[80px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 relative z-10"
          >
            <p className="text-yellow-400 text-xs font-semibold uppercase tracking-widest mb-3">
              Hack For Impact
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              <span className="text-yellow-400">Open</span> Theme
            </h2>
            <p className="text-[#A3A3A3] text-sm mt-3 max-w-lg mx-auto">
              No fixed sectors — teams choose their own problem space and build
              freely across any domain.
            </p>
          </motion.div>

          {theme && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative max-w-2xl mx-auto h-80 sm:h-96 rounded-2xl overflow-hidden group"
            >
              <img
                src={theme.imageUrl}
                alt={theme.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-black/25" />
              <div className="absolute inset-0 border border-white/10 rounded-2xl group-hover:border-yellow-400/30 transition-colors duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-center">
                <h3 className="text-white font-bold text-2xl sm:text-3xl leading-tight">
                  {theme.title}
                </h3>
                <p className="text-[#A3A3A3] text-sm mt-3 leading-relaxed max-w-md mx-auto">
                  {theme.description}
                </p>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10 bg-[#1A1A1A] border border-white/8 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-yellow-400/10 flex items-center justify-center shrink-0">
                <Lightbulb size={20} className="text-yellow-400" />
              </div>
              <div>
                <p className="text-white font-bold text-base">
                  Convert Your Idea Into Action / Product
                </p>
                <p className="text-[#A3A3A3] text-xs mt-0.5">
                  Bring your idea and start building something that matters.
                </p>
              </div>
            </div>
            <RegisterButton
              variant="themes"
              registration={registration}
              onOpen={() => setRegOpen(true)}
              className="shrink-0 whitespace-nowrap"
            >
              {registration.open ? "Register Now" : "Registration Closed"}
            </RegisterButton>
          </motion.div>
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
