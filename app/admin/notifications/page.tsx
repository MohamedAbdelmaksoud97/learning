import { AppShell } from "@/components/AppShell";
import { AdminForm } from "@/components/AdminForm";
import { AdminTable } from "@/components/AdminTable";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/data";

export default async function AdminNotificationsPage() {
  const profile = await requireAdmin();
  const supabase = await createClient();
  const { data } = await supabase.from("notifications").select("*").order("created_at", { ascending: false });
  return <AppShell profile={profile}><h1 className="text-3xl font-black">إدارة الإشعارات</h1><div className="mt-6"><AdminForm type="notification" /></div><AdminTable title="الإشعارات" rows={data ?? []} /></AppShell>;
}
