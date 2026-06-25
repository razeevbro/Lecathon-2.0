"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

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

export default function CountdownTimer({
  title,
  isoDate,
}: {
  title: string;
  isoDate: string;
}) {
  const timeLeft = useCountdown(isoDate);

  return (
    <div className="mt-2">
      <div className="flex items-center gap-2 mb-4">
        <Clock size={14} className="text-yellow-400" />
        <p className="text-xs text-[#A3A3A3] uppercase tracking-wider font-semibold">{title}</p>
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
  );
}
