import { AppShell } from "@/components/AppShell";
import { AdminForm } from "@/components/AdminForm";
import { AdminTable } from "@/components/AdminTable";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/data";

export default async function AdminNotificationsPage() {
  const profile = await requireAdmin();
  const supabase = await createClient();
  const [notificationsResult, profilesResult] = await Promise.all([
    supabase.from("notifications").select("*").order("created_at", { ascending: false }),
    supabase
      .from("profiles")
      .select("id,full_name,email,subscription_package")
      .eq("role", "student")
      .eq("is_active", true)
      .order("full_name"),
  ]);

  return (
    <AppShell profile={profile}>
      <h1 className="text-3xl font-black">إدارة الإشعارات</h1>
      <p className="mt-3 text-slate-400">أرسل إشعارًا لعضو محدد أو لجميع أعضاء باقة معينة.</p>
      <div className="mt-6">
        <AdminForm
          type="notification"
          notificationRecipients={profilesResult.data ?? []}
        />
      </div>
      <AdminTable title="الإشعارات المرسلة" rows={notificationsResult.data ?? []} />
    </AppShell>
  );
}
