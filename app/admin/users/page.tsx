import { AppShell } from "@/components/AppShell";
import { AdminUsersManager } from "@/components/AdminUsersManager";
import { requireAdmin } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";

export default async function AdminUsersPage() {
  const profile = await requireAdmin();
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("id,full_name,email,level,role,subscription_package,is_active,created_at,has_completed_placement_test")
    .order("created_at", { ascending: false });

  const users = (data ?? []) as Profile[];

  return (
    <AppShell profile={profile}>
      <h1 className="text-3xl font-black">إدارة الحسابات</h1>
      <p className="mt-3 text-slate-400">عدّل باقات الأعضاء، وفلتر الحسابات، أو عطّل واحذف حسابات الطلاب.</p>
      <AdminUsersManager users={users} currentAdminId={profile.id} />
    </AppShell>
  );
}
