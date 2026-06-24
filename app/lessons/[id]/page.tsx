import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { LessonPlayer } from "@/components/LessonPlayer";
import { LevelBadge } from "@/components/LevelBadge";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/data";
import { getAllowedLevels } from "@/lib/utils";
import { toggleLessonCompleted } from "@/lib/actions";

export default async function LessonDetailPage(props: PageProps<"/lessons/[id]">) {
  const { id } = await props.params;
  const profile = await getProfile();
  const supabase = await createClient();
  const { data: lesson } = await supabase
    .from("lessons")
    .select("*, lesson_progress(completed, completed_at)")
    .eq("id", id)
    .eq("is_active", true)
    .single();

  if (!lesson || !getAllowedLevels(profile.level).includes(lesson.level)) notFound();
  const completed = Boolean(lesson.lesson_progress?.[0]?.completed);

  return (
    <AppShell profile={profile}>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <LevelBadge level={lesson.level} />
          <h1 className="mt-4 text-3xl font-black">{lesson.title}</h1>
          <p className="mt-3 max-w-3xl text-slate-400">{lesson.description}</p>
        </div>
        <form
          action={toggleLessonCompleted.bind(null, lesson.id, !completed)}
          className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-xl shadow-slate-950/20"
        >
          <p className="mb-3 text-sm font-bold text-slate-200">هل شاهدت الدرس؟</p>
          <button
            type="submit"
            className={`flex w-44 items-center justify-between rounded-full border p-1 text-sm font-bold transition ${
              completed
                ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-100"
                : "border-slate-700 bg-slate-950/80 text-slate-300 hover:border-sky-400/50"
            }`}
            aria-pressed={completed}
          >
            <span className="px-3">{completed ? "نعم، شاهدته" : "لم أشاهده بعد"}</span>
            <span
              className={`grid h-8 w-8 place-items-center rounded-full transition ${
                completed ? "bg-emerald-400 text-emerald-950" : "bg-slate-800 text-slate-400"
              }`}
            >
              <CheckCircle2 className="h-4 w-4" />
            </span>
          </button>
        </form>
      </div>
      <LessonPlayer driveFileId={lesson.drive_file_id} title={lesson.title} />
    </AppShell>
  );
}
