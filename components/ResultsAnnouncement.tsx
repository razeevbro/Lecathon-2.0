"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy } from "lucide-react";
import CountdownTimer from "@/components/Countdown";
import type { ResultsTeam } from "@/lib/types/site";

export default function ResultsAnnouncement({
  announcementDate,
  teams = [],
}: {
  announcementDate: string;
  teams?: ResultsTeam[];
}) {
  const [resultsOut, setResultsOut] = useState(
    () => Date.now() >= new Date(announcementDate).getTime()
  );

  useEffect(() => {
    const target = new Date(announcementDate).getTime();
    const tick = () => setResultsOut(Date.now() >= target);
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [announcementDate]);

  const sortedTeams = [...teams].sort((a, b) => a.rank - b.rank);

  return (
    <div className="pt-2">
      <AnimatePresence mode="wait">
        {!resultsOut ? (
          <motion.div
            key="countdown"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
          >
            <p className="text-[#A3A3A3] text-sm mb-3">
              Results will be announced at 10:00 PM Nepal time.
            </p>
            <CountdownTimer
              title="Results Announced In"
              isoDate={announcementDate}
            />
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="rounded-2xl border border-yellow-400/25 bg-gradient-to-br from-[#1a1500] to-[#111] p-5 sm:p-6 shadow-[0_0_40px_rgba(250,204,21,0.08)]"
          >
            <div className="flex items-center gap-2 mb-4">
              <Trophy size={18} className="text-yellow-400" />
              <p className="text-yellow-400 text-sm font-bold uppercase tracking-wider">
                Results are out!
              </p>
            </div>
            <p className="text-white font-semibold text-lg mb-4">
              Top 10 teams selected for further processing
            </p>

            {sortedTeams.length > 0 ? (
              <ol className="flex flex-col gap-2">
                {sortedTeams.map((team, index) => (
                  <motion.li
                    key={team.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.06, duration: 0.35 }}
                    className="flex items-center gap-3 rounded-xl bg-[#1E1E1E] border border-white/8 px-4 py-3"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-yellow-400/15 text-yellow-400 text-sm font-black">
                      {team.rank}
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold text-white truncate">
                        {team.teamName}
                      </p>
                      {team.college ? (
                        <p className="text-xs text-[#888] truncate">
                          {team.college}
                        </p>
                      ) : null}
                    </div>
                  </motion.li>
                ))}
              </ol>
            ) : (
              <p className="text-sm text-[#A3A3A3]">
                The top 10 list will be published here shortly. Please check back
                soon.
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
