"use client";

import { useEffect, useMemo, useState } from "react";

export function CountdownTimer({ startTime }: { startTime: string }) {
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
  return (
    <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-200">
      يبدأ خلال {hours}س {minutes}د {seconds}ث
    </span>
  );
}
