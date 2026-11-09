"use client";

import { useEffect, useState } from "react";
import { site } from "@/config/site";
import { useStore } from "./store";

/** Минуты от полуночи и день недели по времени Астаны (UTC+5). */
function astanaNow() {
  const now = new Date(Date.now() + 5 * 60 * 60 * 1000);
  return { day: now.getUTCDay(), minutes: now.getUTCHours() * 60 + now.getUTCMinutes() };
}
const toMin = (s: string) => Number(s.slice(0, 2)) * 60 + Number(s.slice(3, 5));

export function OpenStatus({ className = "" }: { className?: string }) {
  const { t } = useStore();
  const [onBreak, setOnBreak] = useState<boolean | null>(null);

  useEffect(() => {
    const check = () => {
      const { day, minutes } = astanaNow();
      setOnBreak(
        site.hours.breaks.some((b) => b.day === day && minutes >= toMin(b.from) && minutes < toMin(b.to)),
      );
    };
    check();
    const id = setInterval(check, 60_000);
    return () => clearInterval(id);
  }, []);

  const label = onBreak === null ? t.status.allDay : onBreak ? t.status.break : t.status.open;
  return (
    <span className={`inline-flex items-center gap-2 text-sm font-medium ${className}`}>
      <span className="relative flex size-2.5">
        {onBreak === false && (
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60 motion-reduce:hidden" />
        )}
        <span className={`relative inline-flex size-2.5 rounded-full ${onBreak ? "bg-ember" : "bg-emerald-600"}`} />
      </span>
      {label}
    </span>
  );
}
