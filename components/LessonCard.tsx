import Link from "next/link";
import { Clock, PlayCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { LevelBadge } from "@/components/LevelBadge";
import type { Lesson } from "@/lib/types";

export function LessonCard({ lesson }: { lesson: Lesson }) {
  const completed = Boolean(lesson.lesson_progress?.[0]?.completed);
  return (
    <Link href={`/lessons/${lesson.id}`}>
      <Card className="h-full p-5 transition hover:-translate-y-1 hover:border-sky-400/40">
        <div className="flex items-start justify-between gap-4">
          <LevelBadge level={lesson.level} />
          {completed ? <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200">مكتمل</span> : null}
        </div>
        <h3 className="mt-5 text-xl font-black text-white">{lesson.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-400">{lesson.description}</p>
        <div className="mt-6 flex items-center justify-between text-sm text-slate-400">
          <span className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {lesson.duration_minutes ?? 0} دقيقة
          </span>
          <PlayCircle className="h-6 w-6 text-sky-300" />
        </div>
      </Card>
    </Link>
  );
}
