import { createClient } from "@/lib/supabase/server";
import { NotificationBell } from "@/components/NotificationBell";
import type { Profile } from "@/lib/types";

export async function TopNavbar({ profile }: { profile: Profile }) {
  const supabase = await createClient();
  const { count } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("user_id", profile.id)
    .eq("is_read", false);

  return (
    <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/80 px-4 py-4 backdrop-blur lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">مرحبا بك</p>
          <h1 className="text-xl font-black text-white">{profile.full_name || profile.email}</h1>
        </div>
        <NotificationBell unreadCount={count ?? 0} userId={profile.id} />
      </div>
    </header>
  );
}
