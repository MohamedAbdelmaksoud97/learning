import { TopNavbarClient } from "@/components/TopNavbarClient";
import { createClient } from "@/lib/supabase/server";
import { getNavLinks } from "@/lib/navigation";
import type { Profile } from "@/lib/types";

export async function TopNavbar({ profile }: { profile: Profile }) {
  const supabase = await createClient();
  const { count } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("user_id", profile.id)
    .eq("is_read", false);

  return (
    <TopNavbarClient
      profile={profile}
      unreadCount={count ?? 0}
      links={getNavLinks(profile.role)}
    />
  );
}
