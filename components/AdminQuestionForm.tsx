"use client";

import { useActionState } from "react";
import { saveQuestion } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Textarea } from "@/components/ui/input";
import type { Question } from "@/lib/types";

type FormState = { error?: string; success?: string };

export function AdminQuestionForm({ question }: { question?: Question }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveQuestion, {});
  const options = question?.options ?? [];
  const correctIndex = Math.max(0, options.findIndex((option) => option.is_correct));

  return (
    <Card className="p-5">
      <form action={action} className="grid gap-4 md:grid-cols-2">
        {question ? <input type="hidden" name="id" value={question.id} /> : null}
        <Input
          name="question_text"
          placeholder="نص السؤال"
          defaultValue={question?.question_text ?? ""}
          className="md:col-span-2"
          required
        />
        <select
          name="level"
          defaultValue={question?.level ?? "beginner"}
          className="h-11 w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 text-sm text-slate-50 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
          required
        >
          <option value="beginner">مبتدئ</option>
          <option value="advanced">متقدم</option>
          <option value="expert">خبير</option>
        </select>
        <Input
          name="question_order"
          type="number"
          placeholder="ترتيب السؤال"
          defaultValue={question?.question_order ?? 1}
          required
        />
        {[0, 1, 2, 3].map((index) => (
          <label key={index} className="space-y-2 rounded-xl border border-slate-800 bg-slate-950/50 p-3">
            <span className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <input
                name="correct_option"
                type="radio"
                value={index}
                defaultChecked={index === correctIndex}
              />
              الإجابة {index + 1} {index === correctIndex ? "(الصحيحة)" : ""}
            </span>
            <Input
              name={`option_${index}`}
              placeholder={`نص الإجابة ${index + 1}`}
              defaultValue={options[index]?.option_text ?? ""}
              required
            />
          </label>
        ))}
        <Textarea
          name="explanation"
          placeholder="شرح الإجابة بعد الاختيار"
          defaultValue={question?.explanation ?? ""}
          className="md:col-span-2"
        />
        <label className="flex items-center gap-2 text-sm text-slate-300">
          <input name="is_active" type="checkbox" defaultChecked={question?.is_active ?? true} /> نشط
        </label>
        {state?.error ? <p className="text-sm text-red-300 md:col-span-2">{state.error}</p> : null}
        {state?.success ? <p className="text-sm text-emerald-300 md:col-span-2">{state.success}</p> : null}
        <div className="md:col-span-2">
          <Button disabled={pending}>{pending ? "جاري الحفظ..." : question ? "تحديث السؤال" : "إضافة السؤال"}</Button>
        </div>
      </form>
    </Card>
  );
}
