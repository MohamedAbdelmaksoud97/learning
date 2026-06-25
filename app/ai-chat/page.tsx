import { AIChatClient } from "@/components/AIChatClient";
import { AppShell } from "@/components/AppShell";
import { getProfile } from "@/lib/data";

export default async function AIChatPage() {
  const profile = await getProfile();

  return (
    <AppShell profile={profile}>
      <AIChatClient userName={profile.full_name || profile.email} />
    </AppShell>
  );
}
