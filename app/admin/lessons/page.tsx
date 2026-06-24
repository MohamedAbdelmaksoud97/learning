import { AdminForm } from "@/components/AdminForm";
import { AdminLessonTabs } from "@/components/AdminLessonTabs";
import { AppShell } from "@/components/AppShell";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/data";
import type { Lesson } from "@/lib/types";

export default async function AdminLessonsPage() {
  const profile = await requireAdmin();
  const supabase = await createClient();
  const { data } = await supabase
    .from("lessons")
    .select("*")
    .order("level")
    .order("lesson_order");

  return (
    <AppShell profile={profile}>
      <h1 className="text-3xl font-black">إدارة الدروس</h1>
      <div className="mt-6">
        <AdminForm type="lesson" />
      </div>
      <AdminLessonTabs lessons={(data ?? []) as Lesson[]} />
    </AppShell>
  );
}
