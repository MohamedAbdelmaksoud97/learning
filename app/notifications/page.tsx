import { AppShell } from "@/components/AppShell";
import { NotificationItem } from "@/components/NotificationItem";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/data";
import { markAllNotificationsRead } from "@/lib/actions";

export default async function NotificationsPage() {
  const profile = await getProfile();
  const supabase = await createClient();
  const { data } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", profile.id)
    .order("created_at", { ascending: false });

  return (
    <AppShell profile={profile}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black">الإشعارات</h1>
          <p className="mt-3 text-slate-400">إشعارات داخلية فقط داخل المنصة.</p>
        </div>
        <form action={markAllNotificationsRead}>
          <Button variant="secondary">تعليم الكل كمقروء</Button>
        </form>
      </div>
      <div className="mt-8 grid gap-4">
        {data?.length ? data.map((notification) => <NotificationItem key={notification.id} notification={notification} />) : <EmptyState title="لا توجد إشعارات" />}
      </div>
    </AppShell>
  );
}
