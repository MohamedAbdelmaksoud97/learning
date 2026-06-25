"use client";

import { useEffect, useMemo, useState } from "react";

type CountdownTimerProps = {
  startTime: string;
  variant?: "compact" | "hero";
};

export function CountdownTimer({ startTime, variant = "compact" }: CountdownTimerProps) {
  const target = useMemo(() => new Date(startTime).getTime(), [startTime]);
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  if (now === null) return null;

  const diff = Math.max(target - now, 0);
  const hours = Math.floor(diff / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);

  if (diff === 0) return null;

  const label = `يبدأ خلال ${hours}س ${minutes}د ${seconds}ث`;

  if (variant === "hero") {
    return (
      <div className="inline-flex max-w-full items-center justify-center rounded-3xl border border-cyan-400/20 bg-cyan-400/10 px-6 py-4 text-center text-3xl font-black leading-tight text-cyan-100 shadow-[0_0_40px_rgba(56,189,248,0.12)] sm:text-4xl">
        {label}
      </div>
    );
  }

  return (
    <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-lg font-bold text-cyan-200">
      {label}
    </span>
  );
}
