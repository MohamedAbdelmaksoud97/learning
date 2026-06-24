import { AdminQuestionForm } from "@/components/AdminQuestionForm";
import { AppShell } from "@/components/AppShell";
import { DeleteButton } from "@/components/DeleteButton";
import { Card } from "@/components/ui/card";
import { deleteQuestion } from "@/lib/actions";
import { requireAdmin } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import { getLevelLabel } from "@/lib/utils";
import type { Question } from "@/lib/types";

export default async function AdminQuestionsPage() {
  const profile = await requireAdmin();
  const supabase = await createClient();
  const { data } = await supabase
    .from("questions")
    .select("*, options:question_options(*)")
    .order("question_order", { ascending: true });
  const questions = (data ?? []) as Question[];

  return (
    <AppShell profile={profile}>
      <h1 className="text-3xl font-black">إدارة الأسئلة</h1>
      <p className="mt-3 text-slate-400">هذه الأسئلة هي المصدر الوحيد لاختبار تحديد المستوى.</p>
      <div className="mt-6">
        <AdminQuestionForm />
      </div>
      <div className="mt-8 space-y-5">
        {questions.map((question) => (
          <Card key={question.id} className="p-5">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm text-sky-300">{getLevelLabel(question.level)} - ترتيب {question.question_order}</p>
                <h2 className="mt-2 text-xl font-black text-white">{question.question_text}</h2>
              </div>
              <DeleteButton action={deleteQuestion.bind(null, question.id)} />
            </div>
            <AdminQuestionForm question={question} />
          </Card>
        ))}
        {!questions.length ? (
          <Card className="p-6 text-slate-400">لا توجد أسئلة بعد. أضف أول سؤال من النموذج أعلاه.</Card>
        ) : null}
      </div>
    </AppShell>
  );
}
