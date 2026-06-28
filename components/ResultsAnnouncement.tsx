"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy } from "lucide-react";
import CountdownTimer from "@/components/Countdown";
import type { ResultsTeam } from "@/lib/types/site";
import { useResultsReveal } from "@/lib/use-results-reveal";

function formatAnnouncementLabel(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return "the scheduled time";
  }

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kathmandu",
    timeZoneName: "short",
  });
}

type ResultsResponse = {
  revealed: boolean;
  teams: ResultsTeam[];
};

export default function ResultsAnnouncement({
  announcementDate,
  teams: initialTeams = [],
}: {
  announcementDate: string;
  teams?: ResultsTeam[];
}) {
  const router = useRouter();
  const { announcementDate: resolvedDate, revealed, timeLeft } =
    useResultsReveal(announcementDate);
  const [teams, setTeams] = useState(initialTeams);
  const [loadingTeams, setLoadingTeams] = useState(false);

  useEffect(() => {
    setTeams(initialTeams);
  }, [initialTeams]);

  useEffect(() => {
    if (!revealed) {
      return;
    }

    let cancelled = false;
    let pollId: number | undefined;

    async function loadTeams() {
      setLoadingTeams(true);
      try {
        const res = await fetch("/api/results", { cache: "no-store" });
        if (!res.ok) {
          return;
        }

        const data = (await res.json()) as ResultsResponse;
        if (!cancelled && data.revealed && Array.isArray(data.teams)) {
          setTeams(data.teams);
          if (data.teams.length > 0 && pollId !== undefined) {
            window.clearInterval(pollId);
          }
        }
      } catch {
        // Keep showing any teams already loaded from the server.
      } finally {
        if (!cancelled) {
          setLoadingTeams(false);
        }
      }
    }

    router.refresh();
    void loadTeams();

    pollId = window.setInterval(() => {
      void loadTeams();
    }, 15_000);

    return () => {
      cancelled = true;
      if (pollId !== undefined) {
        window.clearInterval(pollId);
      }
    };
  }, [revealed, router]);

  const sortedTeams = [...teams].sort((a, b) => a.rank - b.rank);

  return (
    <div className="pt-2">
      <AnimatePresence mode="wait" initial={false}>
        {!revealed ? (
          <motion.div
            key="countdown"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
          >
            <p className="text-[#A3A3A3] text-sm mb-3">
              Results will be announced on{" "}
              {formatAnnouncementLabel(resolvedDate)}.
            </p>
            <CountdownTimer
              title="Results Announced In"
              isoDate={resolvedDate}
              timeLeft={timeLeft}
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

            {loadingTeams && sortedTeams.length === 0 ? (
              <p className="text-sm text-[#A3A3A3]">Loading results…</p>
            ) : sortedTeams.length > 0 ? (
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
