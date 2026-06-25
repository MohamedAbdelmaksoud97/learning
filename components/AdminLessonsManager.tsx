"use client";

import { useState } from "react";
import { BookOpen, HelpCircle, Trash2 } from "lucide-react";
import { AdminForm } from "@/components/AdminForm";
import { AdminLessonQuestionForm } from "@/components/AdminLessonQuestionForm";
import { AdminLessonTabs } from "@/components/AdminLessonTabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { deleteLessonQuestion } from "@/lib/actions";
import { cn, getLevelLabel } from "@/lib/utils";
import type { Lesson, LessonQuestion } from "@/lib/types";

type AdminLessonsManagerProps = {
  lessons: Lesson[];
  lessonQuestions: LessonQuestion[];
};

export function AdminLessonsManager({ lessons, lessonQuestions }: AdminLessonsManagerProps) {
  const [activeTab, setActiveTab] = useState<"lessons" | "questions">("lessons");

  return (
    <div className="mt-6 space-y-6">
      <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-800 bg-slate-900/70 p-2">
        <button
          type="button"
          onClick={() => setActiveTab("lessons")}
          className={cn(
            "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition",
            activeTab === "lessons"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-950/30"
              : "text-slate-400 hover:bg-slate-800 hover:text-white",
          )}
        >
          <BookOpen className="h-4 w-4" />
          الدروس
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("questions")}
          className={cn(
            "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition",
            activeTab === "questions"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-950/30"
              : "text-slate-400 hover:bg-slate-800 hover:text-white",
          )}
        >
          <HelpCircle className="h-4 w-4" />
          أسئلة الدروس
        </button>
      </div>

      {activeTab === "lessons" ? (
        <div className="space-y-6">
          <AdminForm type="lesson" />
          <AdminLessonTabs lessons={lessons} />
        </div>
      ) : null}

      {activeTab === "questions" ? (
        <div className="space-y-6">
          <AdminLessonQuestionForm lessons={lessons} />
          <div className="grid gap-4">
            {lessonQuestions.map((question) => (
              <Card key={question.id} className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-sky-300">
                      {question.lesson?.title ?? "درس غير معروف"} - {getLevelLabel(question.lesson?.level)}
                    </p>
                    <h2 className="mt-2 text-lg font-black text-white">{question.question_text}</h2>
                    {question.explanation ? (
                      <p className="mt-2 text-sm leading-6 text-slate-400">{question.explanation}</p>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded-full bg-slate-800 px-3 py-1 text-slate-300">
                      ترتيب {question.question_order}
                    </span>
                    <span
                      className={
                        question.is_active
                          ? "rounded-full bg-emerald-400/10 px-3 py-1 text-emerald-200"
                          : "rounded-full bg-red-400/10 px-3 py-1 text-red-200"
                      }
                    >
                      {question.is_active ? "نشط" : "غير نشط"}
                    </span>
                    <form action={deleteLessonQuestion.bind(null, question.id, question.lesson_id)}>
                      <Button variant="danger" size="sm">
                        <Trash2 className="h-4 w-4" />
                        حذف السؤال
                      </Button>
                    </form>
                  </div>
                </div>
                <div className="mt-4 grid gap-2 md:grid-cols-2">
                  {question.options.map((option) => (
                    <div
                      key={option.id}
                      className={cn(
                        "rounded-xl border px-3 py-2 text-sm",
                        option.is_correct
                          ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-100"
                          : "border-slate-800 bg-slate-950/50 text-slate-300",
                      )}
                    >
                      {option.option_text}
                    </div>
                  ))}
                </div>
                <details className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/40 p-3">
                  <summary className="cursor-pointer text-sm font-bold text-sky-300">تعديل السؤال</summary>
                  <div className="mt-4">
                    <AdminLessonQuestionForm lessons={lessons} question={question} />
                  </div>
                </details>
              </Card>
            ))}
            {!lessonQuestions.length ? (
              <Card className="p-6 text-slate-400">لا توجد أسئلة مرتبطة بالدروس بعد.</Card>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
