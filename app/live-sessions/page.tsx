import { AppShell } from "@/components/AppShell";
import { LiveSessionCard } from "@/components/LiveSessionCard";
import { EmptyState } from "@/components/EmptyState";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/data";
import { getAllowedLevels } from "@/lib/utils";

export default async function LiveSessionsPage() {
  const profile = await getProfile();
  const supabase = await createClient();
  const now = new Date().getTime();
  const levels = getAllowedLevels(profile.level);
  const { data } = await supabase
    .from("live_sessions")
    .select("*")
    .eq("is_active", true)
    .or(`applies_to_all.eq.true,level.in.(${levels.join(",")})`)
    .order("start_time");

  return (
    <AppShell profile={profile}>
      <h1 className="text-3xl font-black">الحصص المباشرة</h1>
      <p className="mt-3 text-slate-400">تقويم الحصص القادمة وروابط الانضمام والإعادة.</p>
      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        {data?.length ? (
          data.map((session) => <LiveSessionCard key={session.id} session={session} now={now} />)
        ) : (
          <EmptyState title="لا توجد حصص حاليا" />
        )}
      </div>
    </AppShell>
  );
}
