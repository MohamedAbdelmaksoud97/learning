import { AppShell } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LevelBadge } from "@/components/LevelBadge";
import { getProfile } from "@/lib/data";
import { updateProfileForm } from "@/lib/actions";

export default async function ProfilePage() {
  const profile = await getProfile();
  return (
    <AppShell profile={profile}>
      <Card className="max-w-2xl p-6">
        <h1 className="text-3xl font-black">الملف الشخصي</h1>
        <div className="mt-5 flex gap-3"><LevelBadge level={profile.level} /><span className="rounded-full bg-slate-800 px-3 py-1 text-xs">{profile.role}</span></div>
        <form action={updateProfileForm} className="mt-8 space-y-4">
          <Input name="full_name" defaultValue={profile.full_name ?? ""} placeholder="الاسم الكامل" />
          <Input value={profile.email ?? ""} disabled />
          <Button>حفظ التغييرات</Button>
        </form>
      </Card>
    </AppShell>
  );
}
