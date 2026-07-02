"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { calculateLevel, formatArabicDate } from "@/lib/utils";
import { getProfile, requireAdmin, requireUser } from "@/lib/data";
import type { LessonQuestion, Question } from "@/lib/types";

type ActionState = { error?: string; success?: string };

export async function signUp(_state: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();
  const fullName = String(formData.get("full_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/auth/callback`,
    },
  });

  if (error) return { error: error.message };
  return { success: "تم إنشاء الحساب. تحقق من بريدك الإلكتروني لتأكيد الحساب." };
}

export async function signIn(_state: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };
  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function setAccountActive(userId: string, isActive: boolean) {
  const admin = await requireAdmin();
  if (admin.id === userId) {
    return;
  }
  const supabase = await createClient();
  await supabase.from("profiles").update({ is_active: isActive }).eq("id", userId);
  revalidatePath("/admin/users");
}

export async function startBeginner() {
  const user = await requireUser();
  const supabase = await createClient();
  await supabase
    .from("profiles")
    .update({ level: "beginner", has_completed_placement_test: false })
    .eq("id", user.id);
  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function savePlacementAttempt(answers: Record<string, string>) {
  const user = await requireUser();
  const supabase = await createClient();
  const { data: questions, error: questionsError } = await supabase
    .from("questions")
    .select("*, options:question_options(*)")
    .eq("is_active", true)
    .order("question_order", { ascending: true });

  const activeQuestions = (questions ?? []) as Question[];

  if (questionsError || !activeQuestions.length) {
    return { error: "لا توجد أسئلة متاحة حاليا" };
  }

  const total = activeQuestions.length;
  if (Object.keys(answers).length < total) {
    return { error: "أجب عن كل الأسئلة قبل عرض النتيجة" };
  }

  const correct = activeQuestions.filter((question) => {
    const selected = answers[question.id];
    return question.options.some((option) => option.id === selected && option.is_correct);
  }).length;
  const percentage = Math.round((correct / total) * 100);
  const finalLevel = calculateLevel(percentage);

  const { data: attempt, error } = await supabase
    .from("test_attempts")
    .insert({
      user_id: user.id,
      score: correct,
      total_questions: total,
      percentage,
      final_level: finalLevel,
      completed_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (error || !attempt) return { error: error?.message ?? "تعذر حفظ النتيجة" };

  const rows = activeQuestions.map((question) => {
    const selected = answers[question.id];
    const option = question.options.find((item) => item.id === selected);
    return {
      attempt_id: attempt.id,
      user_id: user.id,
      question_id: question.id,
      selected_option_id: selected,
      is_correct: Boolean(option?.is_correct),
    };
  });

  await supabase.from("user_answers").insert(rows);
  await supabase
    .from("profiles")
    .update({ level: finalLevel, has_completed_placement_test: true })
    .eq("id", user.id);

  revalidatePath("/dashboard");
  return { score: correct, percentage, finalLevel };
}

export async function toggleLessonWatched(lessonId: string, watched: boolean) {
  const user = await requireUser();
  const supabase = await createClient();
  await supabase.from("lesson_progress").upsert(
    {
      user_id: user.id,
      lesson_id: lessonId,
      watched,
      watched_at: watched ? new Date().toISOString() : null,
    },
    { onConflict: "user_id,lesson_id" },
  );
  revalidatePath("/lessons");
  revalidatePath(`/lessons/${lessonId}`);
  revalidatePath("/dashboard");
}

export async function submitLessonQuiz(lessonId: string, answers: Record<string, string>) {
  const user = await requireUser();
  const supabase = await createClient();

  const { data: questions, error } = await supabase
    .from("lesson_questions")
    .select("*, options:lesson_question_options(*)")
    .eq("lesson_id", lessonId)
    .eq("is_active", true)
    .order("question_order");

  const activeQuestions = (questions ?? []) as LessonQuestion[];
  if (error || !activeQuestions.length) {
    return { error: "لا توجد أسئلة متاحة لهذا الدرس حالياً" };
  }

  const total = activeQuestions.length;
  if (Object.keys(answers).length < total) {
    return { error: "أجب عن كل أسئلة الدرس قبل عرض النتيجة" };
  }

  const score = activeQuestions.filter((question) => {
    const selected = answers[question.id];
    return question.options.some((option) => option.id === selected && option.is_correct);
  }).length;
  const percentage = Math.round((score / total) * 100);
  const passed = percentage === 100;

  const { data: existing } = await supabase
    .from("lesson_progress")
    .select("completed, quiz_passed")
    .eq("user_id", user.id)
    .eq("lesson_id", lessonId)
    .maybeSingle<{ completed: boolean; quiz_passed: boolean | null }>();

  const alreadyPassed = Boolean(existing?.completed || existing?.quiz_passed);
  const shouldComplete = passed || alreadyPassed;

  await supabase.from("lesson_progress").upsert(
    {
      user_id: user.id,
      lesson_id: lessonId,
      completed: shouldComplete,
      completed_at: shouldComplete ? new Date().toISOString() : null,
      quiz_score: score,
      quiz_total: total,
      quiz_percentage: percentage,
      quiz_passed: shouldComplete,
    },
    { onConflict: "user_id,lesson_id" },
  );

  revalidatePath("/lessons");
  revalidatePath(`/lessons/${lessonId}`);
  revalidatePath(`/lessons/${lessonId}/quiz`);
  revalidatePath("/dashboard");
  revalidatePath("/roadmap");

  return { score, total, percentage, passed: shouldComplete };
}

export async function markNotificationRead(id: string) {
  const user = await requireUser();
  const supabase = await createClient();
  await supabase.from("notifications").update({ is_read: true }).eq("id", id).eq("user_id", user.id);
  revalidatePath("/notifications");
}

export async function markAllNotificationsRead() {
  const user = await requireUser();
  const supabase = await createClient();
  await supabase.from("notifications").update({ is_read: true }).eq("user_id", user.id);
  revalidatePath("/notifications");
}

async function upsertAdminRow(table: string, formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  const id = String(formData.get("id") ?? "");
  const payload: Record<string, unknown> = Object.fromEntries(formData.entries());
  delete payload.id;
  Object.keys(payload).forEach((key) => {
    if (payload[key] === "") payload[key] = null;
    if (payload[key] === "on") payload[key] = true;
    if ((key === "start_time" || key === "end_time") && typeof payload[key] === "string") {
      payload[key] = new Date(payload[key]).toISOString();
    }
  });

  const query = id
    ? supabase.from(table).update(payload).eq("id", id)
    : supabase.from(table).insert(payload);
  const { error } = await query;
  if (error) return { error: error.message };
  revalidatePath("/admin");
  return { success: "تم الحفظ" };
}

export async function saveQuestion(_state: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const supabase = await createClient();
  const id = String(formData.get("id") ?? "") || randomUUID();
  const correctIndex = Number(formData.get("correct_option") ?? 0);
  const optionTexts = [0, 1, 2, 3].map((index) => String(formData.get(`option_${index}`) ?? "").trim());

  if (!String(formData.get("question_text") ?? "").trim()) return { error: "اكتب نص السؤال" };
  if (optionTexts.some((option) => !option)) return { error: "أدخل أربع إجابات" };
  if (Number.isNaN(correctIndex) || correctIndex < 0 || correctIndex > 3) return { error: "حدد الإجابة الصحيحة" };

  const { error } = await supabase.from("questions").upsert({
    id,
    level: String(formData.get("level") ?? "beginner"),
    question_text: String(formData.get("question_text") ?? "").trim(),
    explanation: String(formData.get("explanation") ?? "").trim() || null,
    question_order: Number(formData.get("question_order") ?? 1),
    is_active: formData.get("is_active") === "on",
  });

  if (error) return { error: error.message };

  await supabase.from("question_options").delete().eq("question_id", id);
  const { error: optionsError } = await supabase.from("question_options").insert(
    optionTexts.map((option_text, index) => ({
      id: randomUUID(),
      question_id: id,
      option_text,
      is_correct: index === correctIndex,
    })),
  );

  if (optionsError) return { error: optionsError.message };
  revalidatePath("/admin/questions");
  revalidatePath("/placement-test");
  return { success: "تم حفظ السؤال" };
}

export async function deleteQuestion(questionId: string) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("questions").delete().eq("id", questionId);
  revalidatePath("/admin/questions");
  revalidatePath("/placement-test");
}

export async function saveLesson(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const supabase = await createClient();
  const id = String(formData.get("id") ?? "");
  const terms = formData
    .getAll("vocabulary_term")
    .map((value) => String(value).trim());
  const definitions = formData
    .getAll("vocabulary_definition")
    .map((value) => String(value).trim());
  const vocabulary = terms
    .map((term, index) => ({
      term,
      definition: definitions[index] ?? "",
    }))
    .filter((item) => item.term || item.definition);
  const linkLabels = formData
    .getAll("summary_link_label")
    .map((value) => String(value).trim());
  const linkUrls = formData
    .getAll("summary_link_url")
    .map((value) => String(value).trim());
  const summaryLinks = linkLabels
    .map((label, index) => {
      const rawUrl = linkUrls[index] ?? "";
      const url = rawUrl && !/^https?:\/\//i.test(rawUrl) ? `https://${rawUrl}` : rawUrl;
      return { label, url };
    })
    .filter((item) => item.label || item.url);

  const invalidLink = summaryLinks.find((item) => {
    if (!item.label || !item.url) return true;
    try {
      const parsed = new URL(item.url);
      return !["http:", "https:"].includes(parsed.protocol);
    } catch {
      return true;
    }
  });

  if (invalidLink) {
    return { error: "أدخل عنوان ورابط صحيح لكل رابط في الملخص" };
  }

  const payload = {
    title: String(formData.get("title") ?? "").trim(),
    drive_file_id: String(formData.get("drive_file_id") ?? "").trim(),
    level: String(formData.get("level") ?? "beginner"),
    lesson_order: Number(formData.get("lesson_order") ?? 1),
    duration_minutes: formData.get("duration_minutes")
      ? Number(formData.get("duration_minutes"))
      : null,
    description: String(formData.get("description") ?? "").trim() || null,
    summary: String(formData.get("summary") ?? "").trim() || null,
    summary_links: summaryLinks,
    vocabulary,
    is_active: formData.get("is_active") === "on",
  };

  if (!payload.title) return { error: "اكتب عنوان الدرس" };
  if (!payload.drive_file_id) return { error: "أدخل معرف فيديو Google Drive" };

  const query = id
    ? supabase.from("lessons").update(payload).eq("id", id)
    : supabase.from("lessons").insert(payload);
  const { error } = await query;

  if (error) return { error: error.message };
  revalidatePath("/admin/lessons");
  revalidatePath("/lessons");
  revalidatePath("/dashboard");
  revalidatePath("/roadmap");
  return { success: "تم حفظ الدرس" };
}

export async function deleteLesson(lessonId: string) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("lessons").delete().eq("id", lessonId);
  revalidatePath("/admin/lessons");
  revalidatePath("/lessons");
  revalidatePath("/dashboard");
}

export async function saveLessonQuestion(_state: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const supabase = await createClient();
  const id = String(formData.get("id") ?? "") || randomUUID();
  const lessonId = String(formData.get("lesson_id") ?? "");
  const correctIndex = Number(formData.get("correct_option") ?? 0);
  const optionTexts = [0, 1, 2, 3].map((index) => String(formData.get(`option_${index}`) ?? "").trim());
  const questionText = String(formData.get("question_text") ?? "").trim();

  if (!lessonId) return { error: "اختر الدرس المرتبط بالسؤال" };
  if (!questionText) return { error: "اكتب نص السؤال" };
  if (optionTexts.some((option) => !option)) return { error: "أدخل أربع إجابات" };
  if (Number.isNaN(correctIndex) || correctIndex < 0 || correctIndex > 3) {
    return { error: "حدد الإجابة الصحيحة" };
  }

  const { error } = await supabase.from("lesson_questions").upsert({
    id,
    lesson_id: lessonId,
    question_text: questionText,
    explanation: String(formData.get("explanation") ?? "").trim() || null,
    question_order: Number(formData.get("question_order") ?? 1),
    is_active: formData.get("is_active") === "on",
  } satisfies Partial<LessonQuestion>);

  if (error) return { error: error.message };

  await supabase.from("lesson_question_options").delete().eq("lesson_question_id", id);
  const { error: optionsError } = await supabase.from("lesson_question_options").insert(
    optionTexts.map((option_text, index) => ({
      id: randomUUID(),
      lesson_question_id: id,
      option_text,
      is_correct: index === correctIndex,
    })),
  );

  if (optionsError) return { error: optionsError.message };
  revalidatePath("/admin/lessons");
  revalidatePath(`/lessons/${lessonId}`);
  revalidatePath(`/lessons/${lessonId}/quiz`);
  return { success: "تم حفظ سؤال الدرس" };
}

export async function deleteLessonQuestion(questionId: string, lessonId: string) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("lesson_questions").delete().eq("id", questionId);
  revalidatePath("/admin/lessons");
  revalidatePath(`/lessons/${lessonId}`);
  revalidatePath(`/lessons/${lessonId}/quiz`);
}

export async function saveLiveSession(_state: ActionState, formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  const id = String(formData.get("id") ?? "");
  const payload: Record<string, unknown> = Object.fromEntries(formData.entries());
  delete payload.id;
  Object.keys(payload).forEach((key) => {
    if (payload[key] === "") payload[key] = null;
    if (payload[key] === "on") payload[key] = true;
    if ((key === "start_time" || key === "end_time") && typeof payload[key] === "string") {
      payload[key] = new Date(payload[key]).toISOString();
    }
  });
  payload.applies_to_all = formData.get("applies_to_all") === "on";
  if (payload.applies_to_all && !payload.level) payload.level = "beginner";

  if (id) {
    const { error } = await supabase.from("live_sessions").update(payload).eq("id", id);
    if (error) return { error: error.message };
    revalidatePath("/admin/live-sessions");
    revalidatePath("/live-sessions");
    return { success: "تم تحديث الحصة" };
  }

  const { data: session, error } = await supabase
    .from("live_sessions")
    .insert(payload)
    .select("id,title,level,start_time,applies_to_all")
    .single();

  if (error || !session) return { error: error?.message ?? "تعذر حفظ الحصة" };

  const allowedLevels =
    session.applies_to_all
      ? ["beginner", "advanced", "expert"]
      : session.level === "expert"
      ? ["expert"]
      : session.level === "advanced"
        ? ["advanced", "expert"]
        : ["beginner", "advanced", "expert"];

  const profilesQuery = supabase.from("profiles").select("id");
  const { data: profiles } = session.applies_to_all
    ? await profilesQuery
    : await profilesQuery.in("level", allowedLevels);

  if (profiles?.length) {
    await supabase.from("notifications").insert(
      profiles.map((profile) => ({
        user_id: profile.id,
        title: `حصة مباشرة جديدة: ${session.title}`,
        body: `تمت إضافة حصة مباشرة جديدة تبدأ في ${formatArabicDate(session.start_time)}.`,
        type: "live_session",
        link_url: "/live-sessions",
      })),
    );
  }

  revalidatePath("/admin/live-sessions");
  revalidatePath("/live-sessions");
  revalidatePath("/notifications");
  return { success: "تم حفظ الحصة وإرسال إشعار للطلاب" };
}

export async function deleteLiveSession(sessionId: string) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("live_sessions").delete().eq("id", sessionId);
  revalidatePath("/admin/live-sessions");
  revalidatePath("/live-sessions");
  revalidatePath("/dashboard");
}

export async function saveNotification(_state: ActionState, formData: FormData) {
  return upsertAdminRow("notifications", formData);
}

export async function saveSuccessStory(_state: ActionState, formData: FormData) {
  return upsertAdminRow("success_stories", formData);
}

export async function updateProfile(_state: ActionState, formData: FormData): Promise<ActionState> {
  const profile = await getProfile();
  const supabase = await createClient();
  const fullName = String(formData.get("full_name") ?? "").trim();
  const { error } = await supabase.from("profiles").update({ full_name: fullName }).eq("id", profile.id);
  if (error) return { error: error.message };
  revalidatePath("/profile");
  return { success: "تم تحديث الملف الشخصي" };
}

export async function updateProfileForm(formData: FormData) {
  await updateProfile({}, formData);
}
