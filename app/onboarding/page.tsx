import Link from "next/link";
import { BookOpen, Gauge } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Button, buttonClassName } from "@/components/ui/button";
import { getProfile } from "@/lib/data";
import { startBeginner } from "@/lib/actions";

export default async function OnboardingPage() {
  const profile = await getProfile();
  return (
    <AppShell profile={profile}>
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-black">اختر نقطة البداية</h1>
        <p className="mt-3 text-slate-400">يمكنك دخول اختبار تحديد المستوى أو البدء مباشرة من الأساسيات.</p>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <Card className="p-6">
            <Gauge className="h-9 w-9 text-sky-300" />
            <h2 className="mt-5 text-2xl font-black">اختبار تحديد المستوى</h2>
            <p className="mt-3 text-sm leading-7 text-slate-400">تجربة تفاعلية تحدد مستواك وتفتح لك المسار المناسب.</p>
            <Link href="/placement-test" className={`${buttonClassName("default")} mt-6 w-full`}>ابدأ الاختبار</Link>
          </Card>
          <Card className="p-6">
            <BookOpen className="h-9 w-9 text-sky-300" />
            <h2 className="mt-5 text-2xl font-black">ابدأ كمبتدئ</h2>
            <p className="mt-3 text-sm leading-7 text-slate-400">اختيار سريع يضبط مستواك على مبتدئ ويمكنك التطور لاحقا.</p>
            <form action={startBeginner} className="mt-6">
              <Button variant="secondary" className="w-full">ابدأ من البداية</Button>
            </form>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
