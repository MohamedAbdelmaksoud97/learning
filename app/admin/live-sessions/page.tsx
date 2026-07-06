import { AdminForm } from "@/components/AdminForm";
import { AppShell } from "@/components/AppShell";
import { DeleteButton } from "@/components/DeleteButton";
import { Card } from "@/components/ui/card";
import { deleteLiveSession } from "@/lib/actions";
import { requireAdmin } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import { formatArabicDate, getLevelLabel } from "@/lib/utils";

export default async function AdminLiveSessionsPage() {
  const profile = await requireAdmin();
  const supabase = await createClient();
  const { data } = await supabase
    .from("live_sessions")
    .select("*")
    .order("start_time", { ascending: false });

  return (
    <AppShell profile={profile}>
      <h1 className="text-3xl font-black">إدارة الحصص المباشرة</h1>
      <p className="mt-3 text-slate-400">
        أضف وقت الحصة ورابط البث. يمكنك جعل الحصة متاحة لكل المستويات. كل الأوقات هنا بتوقيت السعودية.
      </p>
      <div className="mt-6">
        <AdminForm type="live" />
      </div>
      <div className="mt-8 grid gap-4">
        {data?.map((session) => (
          <Card key={session.id} className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-sky-400/10 px-3 py-1 text-xs font-bold text-sky-200">
                    {session.applies_to_all ? "كل المستويات" : getLevelLabel(session.level)}
                  </span>
                  <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                    {session.is_active ? "نشطة" : "غير نشطة"}
                  </span>
                </div>
                <h2 className="mt-3 text-xl font-black">{session.title}</h2>
                <p className="mt-2 text-sm text-slate-400">{formatArabicDate(session.start_time)} بتوقيت السعودية</p>
              </div>
              <DeleteButton action={deleteLiveSession.bind(null, session.id)} label="حذف الحصة" />
            </div>
          </Card>
        ))}
        {!data?.length ? <Card className="p-6 text-slate-400">لا توجد حصص مباشرة.</Card> : null}
      </div>
    </AppShell>
  );
}
