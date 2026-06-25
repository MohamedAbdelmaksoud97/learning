"use client";

import Link from "next/link";
import { BookOpenCheck, CheckCircle2, RotateCcw, XCircle } from "lucide-react";
import { useState } from "react";
import { buttonClassName } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type ChallengeCard = {
  term: string;
  definition: string;
  lessonTitle: string;
};

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/[ً-ْ]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function scoreAnswer(answer: string, definition: string) {
  const normalizedAnswer = normalize(answer);
  const normalizedDefinition = normalize(definition);
  if (!normalizedAnswer || !normalizedDefinition) return false;
  if (
    normalizedAnswer === normalizedDefinition ||
    normalizedAnswer.includes(normalizedDefinition) ||
    normalizedDefinition.includes(normalizedAnswer)
  ) {
    return true;
  }

  const keywords = normalizedDefinition
    .split(" ")
    .filter((word) => word.length > 2);
  if (!keywords.length) return false;

  const matched = keywords.filter((word) => normalizedAnswer.includes(word)).length;
  return matched / keywords.length >= 0.6;
}

export function VocabularyChallengeClient({ cards }: { cards: ChallengeCard[] }) {
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);
  const [lastCorrect, setLastCorrect] = useState(false);

  const current = cards[index];
  const finished = index >= cards.length;
  const correctCount = results.filter(Boolean).length;
  const percentage = cards.length
    ? Math.round((correctCount / cards.length) * 100)
    : 0;

  function submitAnswer() {
    if (!current || revealed) return;
    const correct = scoreAnswer(answer, current.definition);
    setLastCorrect(correct);
    setResults((currentResults) => [...currentResults, correct]);
    setRevealed(true);
  }

  function nextCard() {
    setIndex((currentIndex) => currentIndex + 1);
    setAnswer("");
    setRevealed(false);
    setLastCorrect(false);
  }

  function restart() {
    setIndex(0);
    setAnswer("");
    setRevealed(false);
    setResults([]);
    setLastCorrect(false);
  }

  if (!cards.length) {
    return (
      <Card className="p-8 text-center">
        <BookOpenCheck className="mx-auto h-12 w-12 text-sky-300" />
        <h2 className="mt-4 text-2xl font-black text-white">
          لا توجد مفردات للاختبار بعد
        </h2>
        <p className="mt-3 text-slate-400">
          عندما يضيف الأدمن مفردات داخل الدروس ستظهر هنا كتحدي للمستخدم.
        </p>
        <Link href="/lessons" className={`${buttonClassName("default")} mt-6`}>
          الذهاب للدروس
        </Link>
      </Card>
    );
  }

  if (finished) {
    return (
      <Card className="overflow-hidden p-8 text-center">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-blue-600/20 text-sky-300">
          <BookOpenCheck className="h-10 w-10" />
        </div>
        <h2 className="mt-6 text-4xl font-black text-white">نتيجة التحدي</h2>
        <p className="mt-3 text-lg text-slate-400">
          أجبت بشكل صحيح على {correctCount} من {cards.length} مفردة.
        </p>
        <p className="mt-6 text-6xl font-black text-sky-300">{percentage}%</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={restart}
            className={buttonClassName("default")}
          >
            <RotateCcw className="h-4 w-4" />
            إعادة التحدي
          </button>
          <Link href="/dashboard" className={buttonClassName("secondary")}>
            الرجوع للرئيسية
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden p-0">
      <div className="border-b border-slate-800 bg-slate-950/70 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-sky-300">
              مفردة {index + 1} من {cards.length}
            </p>
            <h2 className="mt-2 text-4xl font-black text-white">
              {current.term}
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              من درس: {current.lessonTitle}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900 px-5 py-3 text-center">
            <p className="text-xs text-slate-400">نتيجتك الآن</p>
            <p className="mt-1 text-2xl font-black text-sky-300">
              {correctCount}/{results.length}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <label className="text-sm font-bold text-slate-300">
          اكتب التعريف
        </label>
        <textarea
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
          disabled={revealed}
          className="mt-3 min-h-36 w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-lg leading-8 text-slate-50 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 disabled:opacity-70"
          placeholder="اكتب تعريف المفردة هنا..."
        />

        {revealed ? (
          <div
            className={[
              "mt-5 rounded-2xl border p-5",
              lastCorrect
                ? "border-emerald-500/40 bg-emerald-500/10"
                : "border-red-500/40 bg-red-500/10",
            ].join(" ")}
          >
            <div className="flex items-center gap-2">
              {lastCorrect ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-300" />
              ) : (
                <XCircle className="h-5 w-5 text-red-300" />
              )}
              <p className="font-black text-white">
                {lastCorrect ? "إجابة جيدة" : "راجع التعريف الصحيح"}
              </p>
            </div>
            <p className="mt-3 leading-8 text-slate-300">
              {current.definition}
            </p>
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-3">
          {!revealed ? (
            <button
              type="button"
              onClick={submitAnswer}
              className={buttonClassName("default")}
            >
              تحقق من الإجابة
            </button>
          ) : (
            <button
              type="button"
              onClick={nextCard}
              className={buttonClassName("default")}
            >
              المفردة التالية
            </button>
          )}
          <Link href="/lessons" className={buttonClassName("secondary")}>
            مراجعة الدروس
          </Link>
        </div>
      </div>
    </Card>
  );
}
