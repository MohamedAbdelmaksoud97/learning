import Link from "next/link";
import { Radio, Video } from "lucide-react";
import { Card } from "@/components/ui/card";
import { buttonClassName } from "@/components/ui/button";
import { CountdownTimer } from "@/components/CountdownTimer";
import { LevelBadge } from "@/components/LevelBadge";
import { formatArabicDate } from "@/lib/utils";
import type { LiveSession } from "@/lib/types";

export function LiveSessionCard({ session, now }: { session: LiveSession; now: number }) {
  const start = new Date(session.start_time).getTime();
  const end = new Date(session.end_time).getTime();
  const liveNow = now >= start && now <= end;
  const within24 = start > now && start - now <= 86_400_000;
  const ended = now > end;

  return (
    <Card className="p-5 transition hover:border-sky-400/40">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <LevelBadge level={session.level} />
        <div className="flex flex-wrap items-center gap-2">
          {liveNow ? <span className="inline-flex items-center gap-2 rounded-full bg-red-500/15 px-3 py-1 text-xs font-bold text-red-200"><Radio className="h-3 w-3" /> مباشر الآن</span> : null}
          {within24 ? <CountdownTimer startTime={session.start_time} /> : null}
        </div>
      </div>
      <h3 className="mt-5 text-xl font-black text-white">{session.title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-400">{session.description}</p>
      <p className="mt-4 text-sm text-slate-300">{formatArabicDate(session.start_time)} - {formatArabicDate(session.end_time)}</p>
      <p className="mt-1 text-sm text-slate-400">المدرب: {session.instructor_name || "سيتم التحديد"}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        {session.live_url && !ended ? (
          <Link href={session.live_url} target="_blank" className={buttonClassName("default")}>
            <Video className="h-4 w-4" /> انضمام
          </Link>
        ) : null}
        {ended && session.replay_url ? (
          <Link href={session.replay_url} target="_blank" className={buttonClassName("secondary")}>
            مشاهدة الإعادة
          </Link>
        ) : null}
      </div>
    </Card>
  );
}
