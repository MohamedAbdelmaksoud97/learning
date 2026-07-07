"use client";

import { Pencil, Trash2 } from "lucide-react";
import { AdminForm } from "@/components/AdminForm";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { deleteSuccessStory } from "@/lib/actions";
import type { SuccessStory } from "@/lib/types";

export function AdminSuccessStoriesManager({
  stories,
}: {
  stories: SuccessStory[];
}) {
  return (
    <div className="mt-8 grid gap-4">
      {stories.map((story) => (
        <div key={story.id} className="space-y-3">
          <Card className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={
                      story.is_published
                        ? "rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-200"
                        : "rounded-full bg-red-400/10 px-3 py-1 text-xs font-bold text-red-200"
                    }
                  >
                    {story.is_published ? "منشورة" : "غير منشورة"}
                  </span>
                  {story.score !== null ? (
                    <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-bold text-slate-300">
                      النتيجة {story.score}
                    </span>
                  ) : null}
                </div>
                <h2 className="mt-3 text-lg font-black text-white">{story.title}</h2>
                <p className="mt-1 text-sm font-bold text-sky-300">{story.student_name}</p>
                <p className="mt-2 line-clamp-2 max-w-3xl text-sm leading-6 text-slate-400">
                  {story.description}
                </p>
              </div>

              <form action={deleteSuccessStory.bind(null, story.id)}>
                <Button variant="danger" size="sm">
                  <Trash2 className="h-4 w-4" />
                  حذف القصة
                </Button>
              </form>
            </div>
          </Card>

          <details className="rounded-2xl border border-slate-800 bg-slate-950/40 p-3">
            <summary className="inline-flex cursor-pointer items-center gap-2 text-sm font-bold text-sky-300">
              <Pencil className="h-4 w-4" />
              تعديل القصة
            </summary>
            <div className="mt-4">
              <AdminForm type="story" story={story} />
            </div>
          </details>
        </div>
      ))}

      {!stories.length ? (
        <Card className="p-6 text-slate-400">لا توجد قصص نجاح حتى الآن.</Card>
      ) : null}
    </div>
  );
}
