"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, RotateCcw, XCircle } from "lucide-react";
import { AnimatedProgressBar } from "@/components/AnimatedProgressBar";
import { Button, buttonClassName } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { submitLessonQuiz } from "@/lib/actions";
import { getLevelLabel } from "@/lib/utils";
import type { LessonQuestion } from "@/lib/types";

type QuizResult = {
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
  promotedLevel?: string | null;
  error?: string;
};

export function LessonQuizClient({
  lessonId,
  questions,
}: {
  lessonId: string;
  questions: LessonQuestion[];
}) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [finished, setFinished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);

  const question = questions[index];
  const correctOption = question.options.find((option) => option.is_correct);
  const isAnswered = Boolean(selected);
  const isCorrect = selected === correctOption?.id;
  const score = Object.values(answers).filter(Boolean).length;
  const progress = useMemo(
    () => ((index + (isAnswered ? 1 : 0)) / questions.length) * 100,
    [index, isAnswered, questions.length],
  );

  function choose(optionId: string) {
    if (selected) return;
    const correct = question.options.some((option) => option.id === optionId && option.is_correct);
    setSelected(optionId);
    setAnswers((current) => ({ ...current, [question.id]: correct }));
    setSelectedAnswers((current) => ({ ...current, [question.id]: optionId }));
  }

  async function next() {
    if (index < questions.length - 1) {
      setIndex((value) => value + 1);
      setSelected(null);
      return;
    }

    setSaving(true);
    const saved = await submitLessonQuiz(lessonId, selectedAnswers);
    setSaving(false);

    if ("error" in saved) {
      setResult({
        score,
        total: questions.length,
        percentage: Math.round((score / questions.length) * 100),
        passed: false,
        error: saved.error,
      });
    } else {
      setResult(saved);
    }
    setFinished(true);
  }

  function restart() {
    setIndex(0);
    setSelected(null);
    setAnswers({});
    setSelectedAnswers({});
    setFinished(false);
    setResult(null);
  }

  if (finished) {
    const percentage = result?.percentage ?? Math.round((score / questions.length) * 100);
    const finalScore = result?.score ?? score;
    const finalTotal = result?.total ?? questions.length;
    const passed = Boolean(result?.passed);

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mx-auto max-w-2xl"
      >
        <Card className="p-10 text-center">
          <p className="text-sm font-bold text-sky-300">نتيجة اختبار الدرس</p>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mt-4 text-6xl font-black text-white"
          >
            {percentage}%
          </motion.p>
          <p className="mt-4 text-xl text-slate-300">
            أجبت بشكل صحيح على {finalScore} من {finalTotal}
          </p>
          <p className={passed ? "mt-4 font-bold text-emerald-300" : "mt-4 font-bold text-amber-300"}>
            {passed
              ? result?.promotedLevel
                ? `ممتاز. تم انتقالك إلى مستوى ${getLevelLabel(result.promotedLevel)}.`
                : "ممتاز. تم فتح الدرس التالي."
              : "يجب الحصول على 100% لفتح الدرس التالي. أعد الاختبار وحاول مرة أخرى."}
          </p>
          {result?.error ? <p className="mt-3 text-sm text-red-300">{result.error}</p> : null}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button onClick={restart} variant="secondary">
              <RotateCcw className="h-4 w-4" />
              إعادة الاختبار
            </Button>
            <Link href={`/lessons/${lessonId}`} className={buttonClassName("default")}>
              العودة للدرس
            </Link>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <p className="font-bold text-slate-300">
          السؤال {index + 1} من {questions.length}
        </p>
        <motion.p key={score} initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-sm text-sky-300">
          النتيجة: {score}
        </motion.p>
      </div>
      <AnimatedProgressBar value={progress} />
      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: -35 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 35 }}
          transition={{ duration: 0.28 }}
          className="mt-6"
        >
          <Card className="p-6">
            <h1 className="text-2xl font-black leading-10 text-white">{question.question_text}</h1>
            <div className="mt-6 grid gap-3">
              {question.options.map((option) => {
                const isChosen = selected === option.id;
                const showCorrect = isAnswered && option.is_correct;
                const showWrong = isChosen && !option.is_correct;
                return (
                  <motion.button
                    key={option.id}
                    whileHover={{ scale: selected ? 1 : 1.015 }}
                    whileTap={{ scale: 0.98 }}
                    animate={showWrong ? { x: [0, -8, 8, -4, 0] } : { x: 0 }}
                    onClick={() => choose(option.id)}
                    className={`flex items-center justify-between rounded-2xl border p-4 text-right transition ${
                      showCorrect
                        ? "border-emerald-400/70 bg-emerald-400/10 text-emerald-100 shadow-lg shadow-emerald-950/30"
                        : showWrong
                          ? "border-red-400/70 bg-red-400/10 text-red-100"
                          : isChosen
                            ? "border-sky-400 bg-sky-400/10 text-white"
                            : "border-slate-800 bg-slate-950/50 text-slate-200 hover:border-sky-400/60"
                    }`}
                  >
                    <span>{option.option_text}</span>
                    {showCorrect ? <CheckCircle2 className="h-5 w-5" /> : null}
                    {showWrong ? <XCircle className="h-5 w-5" /> : null}
                  </motion.button>
                );
              })}
            </div>
            {isAnswered ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/60 p-4"
              >
                <p className={isCorrect ? "font-bold text-emerald-300" : "font-bold text-red-300"}>
                  {isCorrect ? "إجابة صحيحة" : `إجابة غير صحيحة. الصحيح: ${correctOption?.option_text}`}
                </p>
                {question.explanation ? <p className="mt-2 text-sm leading-7 text-slate-400">{question.explanation}</p> : null}
              </motion.div>
            ) : null}
            <div className="mt-6 flex justify-end">
              <Button onClick={next} disabled={!isAnswered || saving}>
                {saving
                  ? "جاري الحفظ..."
                  : index === questions.length - 1
                    ? "عرض النتيجة"
                    : "السؤال التالي"}
              </Button>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
