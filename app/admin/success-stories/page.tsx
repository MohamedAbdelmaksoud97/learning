import { AppShell } from "@/components/AppShell";
import { AdminForm } from "@/components/AdminForm";
import { AdminTable } from "@/components/AdminTable";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/data";

export default async function AdminSuccessStoriesPage() {
  const profile = await requireAdmin();
  const supabase = await createClient();
  const { data } = await supabase
    .from("success_stories")
    .select("id,student_name,title,description,score,image_url,is_published,created_at")
    .order("created_at", { ascending: false });

  return (
    <AppShell profile={profile}>
      <h1 className="text-3xl font-black">إدارة قصص النجاح</h1>
      <div className="mt-6">
        <AdminForm type="story" />
      </div>
      <AdminTable title="القصص" rows={data ?? []} />
    </AppShell>
  );
}
