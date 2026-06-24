import { Lock, Unlock } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { setAccountActive } from "@/lib/actions";
import { requireAdmin } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import { getLevelLabel } from "@/lib/utils";
import type { Profile } from "@/lib/types";

export default async function AdminUsersPage() {
  const profile = await requireAdmin();
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("id,full_name,email,level,role,is_active,created_at,has_completed_placement_test")
    .order("created_at", { ascending: false });

  const users = (data ?? []) as Profile[];

  return (
    <AppShell profile={profile}>
      <h1 className="text-3xl font-black">إدارة الحسابات</h1>
      <p className="mt-3 text-slate-400">يمكنك تعطيل حساب ومنعه من الوصول إلى المنصة، أو إعادة تفعيله.</p>
      <div className="mt-8 grid gap-4">
        {users.map((user) => (
          <Card key={user.id} className="p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-black text-white">{user.full_name || user.email}</h2>
                  <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">{user.role}</span>
                  <span className={user.is_active ? "rounded-full bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200" : "rounded-full bg-red-400/10 px-3 py-1 text-xs text-red-200"}>
                    {user.is_active ? "نشط" : "معطل"}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-400">{user.email}</p>
                <p className="mt-1 text-xs text-slate-500">المستوى: {getLevelLabel(user.level)}</p>
              </div>
              {user.id !== profile.id ? (
                user.is_active ? (
                  <form action={setAccountActive.bind(null, user.id, false)}>
                    <Button variant="danger" size="sm">
                      <Lock className="h-4 w-4" />
                      تعطيل الحساب
                    </Button>
                  </form>
                ) : (
                  <form action={setAccountActive.bind(null, user.id, true)}>
                    <Button variant="secondary" size="sm">
                      <Unlock className="h-4 w-4" />
                      تفعيل الحساب
                    </Button>
                  </form>
                )
              ) : (
                <span className="text-xs text-slate-500">حسابك الحالي</span>
              )}
            </div>
          </Card>
        ))}
        {!users.length ? <Card className="p-6 text-slate-400">لا توجد حسابات.</Card> : null}
      </div>
    </AppShell>
  );
}
