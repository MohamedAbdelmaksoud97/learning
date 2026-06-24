import { AppShell } from "@/components/AppShell";
import { EmptyState } from "@/components/EmptyState";
import { PlacementTestClient } from "@/components/PlacementTestClient";
import { getProfile } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import type { Question } from "@/lib/types";

export default async function PlacementTestPage() {
  const profile = await getProfile();
  const supabase = await createClient();
  const { data } = await supabase
    .from("questions")
    .select("*, options:question_options(*)")
    .eq("is_active", true)
    .order("question_order", { ascending: true });

  const questions = (data ?? []) as Question[];

  return (
    <AppShell profile={profile}>
      {questions.length ? (
        <PlacementTestClient questions={questions} />
      ) : (
        <EmptyState
          title="لا توجد أسئلة متاحة"
          description="أضف أسئلة اختبار تحديد المستوى من لوحة الإدارة أولا."
        />
      )}
    </AppShell>
  );
}
