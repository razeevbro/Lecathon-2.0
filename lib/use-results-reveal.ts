"use client";

import { useEffect, useState } from "react";
import {
  getResultsAnnouncementDate,
  getRevealTargetMs,
  getRevealTimeLeft,
  isResultsRevealed,
  zeroTimeLeft,
} from "@/lib/results-announcement";

export function useResultsReveal(value?: string | null) {
  const announcementDate = getResultsAnnouncementDate(value);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const target = getRevealTargetMs(announcementDate);
    if (Number.isNaN(target)) {
      return;
    }

    const tick = () => setNow(Date.now());
    tick();

    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, [announcementDate]);

  const revealed = isResultsRevealed(announcementDate, now);
  const timeLeft = revealed
    ? zeroTimeLeft
    : getRevealTimeLeft(announcementDate, now);

  return { announcementDate, revealed, timeLeft };
}
