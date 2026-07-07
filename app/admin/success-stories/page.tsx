import { AppShell } from "@/components/AppShell";
import { AdminForm } from "@/components/AdminForm";
import { AdminSuccessStoriesManager } from "@/components/AdminSuccessStoriesManager";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/data";
import type { SuccessStory } from "@/lib/types";

export default async function AdminSuccessStoriesPage() {
  const profile = await requireAdmin();
  const supabase = await createClient();
  const { data } = await supabase
    .from("success_stories")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <AppShell profile={profile}>
      <h1 className="text-3xl font-black">إدارة قصص النجاح</h1>
      <div className="mt-6">
        <AdminForm type="story" />
      </div>
      <AdminSuccessStoriesManager stories={(data ?? []) as SuccessStory[]} />
    </AppShell>
  );
}
