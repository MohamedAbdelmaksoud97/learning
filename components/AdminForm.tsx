"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DateTimePicker } from "@/components/DateTimePicker";
import { Input, Textarea } from "@/components/ui/input";
import { saveLesson, saveLiveSession, saveNotification, saveSuccessStory } from "@/lib/actions";

const actions = {
  lesson: saveLesson,
  live: saveLiveSession,
  notification: saveNotification,
  story: saveSuccessStory,
};

type FormState = { error?: string; success?: string };
type AdminAction = (state: FormState, payload: FormData) => Promise<FormState>;

function LevelSelect({ name = "level", required = true }: { name?: string; required?: boolean }) {
  return (
    <select
      name={name}
      required={required}
      className="h-11 w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 text-sm text-slate-50 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
      defaultValue="beginner"
    >
      <option value="beginner">مبتدئ</option>
      <option value="advanced">متقدم</option>
      <option value="expert">خبير</option>
    </select>
  );
}

export function AdminForm({ type }: { type: keyof typeof actions }) {
  const [state, action, pending] = useActionState<FormState, FormData>(
    actions[type] as AdminAction,
    {},
  );

  return (
    <Card className="p-5">
      <form action={action} className="grid gap-4 md:grid-cols-2">
        {type === "lesson" ? (
          <>
            <Input name="title" placeholder="عنوان الدرس" required />
            <Input name="drive_file_id" placeholder="Google Drive file ID" required />
            <LevelSelect />
            <Input name="lesson_order" type="number" placeholder="ترتيب الدرس" required />
            <Input name="duration_minutes" type="number" placeholder="المدة بالدقائق" />
            <Textarea name="description" placeholder="وصف الدرس" className="md:col-span-2" />
            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input name="is_active" type="checkbox" defaultChecked /> نشط
            </label>
          </>
        ) : null}

        {type === "live" ? (
          <>
            <Input name="title" placeholder="عنوان الحصة" required />
            <Input name="instructor_name" placeholder="اسم المدرب" />
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-300">المستوى المستهدف</label>
              <LevelSelect />
            </div>
            <label className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm font-bold text-slate-300">
              <input name="applies_to_all" type="checkbox" /> متاحة لكل المستويات
            </label>
            <DateTimePicker name="start_time" label="وقت بداية الحصة" required />
            <DateTimePicker name="end_time" label="وقت نهاية الحصة" required />
            <Input name="live_url" placeholder="رابط البث المباشر" />
            <Input name="replay_url" placeholder="رابط الإعادة" />
            <Textarea name="description" placeholder="وصف الحصة" className="md:col-span-2" />
            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input name="is_active" type="checkbox" defaultChecked /> نشط
            </label>
          </>
        ) : null}

        {type === "notification" ? (
          <>
            <Input name="user_id" placeholder="معرف المستخدم" required />
            <Input name="title" placeholder="عنوان الإشعار" required />
            <Input name="type" placeholder="النوع" />
            <Input name="link_url" placeholder="رابط اختياري" />
            <Textarea name="body" placeholder="نص الإشعار" className="md:col-span-2" />
          </>
        ) : null}

        {type === "story" ? (
          <>
            <Input name="student_name" placeholder="اسم الطالب" required />
            <Input name="title" placeholder="عنوان القصة" required />
            <Input name="score" type="number" placeholder="النتيجة" />
            <Input name="image_url" placeholder="رابط الصورة" />
            <Textarea name="description" placeholder="القصة" className="md:col-span-2" required />
            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input name="is_published" type="checkbox" /> منشورة
            </label>
          </>
        ) : null}

        {state?.error ? <p className="text-sm text-red-300 md:col-span-2">{state.error}</p> : null}
        {state?.success ? <p className="text-sm text-emerald-300 md:col-span-2">{state.success}</p> : null}
        <div className="md:col-span-2">
          <Button disabled={pending}>{pending ? "جاري الحفظ..." : "حفظ"}</Button>
        </div>
      </form>
    </Card>
  );
}
