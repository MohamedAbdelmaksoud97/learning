"use client";

import { useState } from "react";
import { EmptyState } from "@/components/EmptyState";
import { LessonCard } from "@/components/LessonCard";
import { cn, getLevelLabel } from "@/lib/utils";
import type { Lesson, Level } from "@/lib/types";

export function LessonLevelTabs({
  levels,
  lessons,
  emptyTitle = "لا توجد دروس متاحة",
  emptyDescription,
}: {
  levels: Level[];
  lessons: Lesson[];
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  const [activeLevel, setActiveLevel] = useState<Level>(levels[0] ?? "beginner");
  const visibleLessons = lessons.filter((lesson) => lesson.level === activeLevel);

  if (!levels.length) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="mt-8">
      <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-800 bg-slate-900/70 p-2">
        {levels.map((level) => {
          const count = lessons.filter((lesson) => lesson.level === level).length;
          return (
            <button
              key={level}
              type="button"
              onClick={() => setActiveLevel(level)}
              className={cn(
                "rounded-xl px-4 py-2 text-sm font-bold transition",
                activeLevel === level
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-950/30"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white",
              )}
            >
              {getLevelLabel(level)}
              <span className="ms-2 rounded-full bg-slate-950/40 px-2 py-0.5 text-[11px]">{count}</span>
            </button>
          );
        })}
      </div>

      {visibleLessons.length ? (
        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visibleLessons.map((lesson) => (
            <LessonCard key={lesson.id} lesson={lesson} />
          ))}
        </div>
      ) : (
        <div className="mt-5">
          <EmptyState title={`لا توجد دروس في مستوى ${getLevelLabel(activeLevel)}`} />
        </div>
      )}
    </div>
  );
}
