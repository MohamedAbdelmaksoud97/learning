import Link from "next/link";
import { BookOpenCheck, CalendarDays, Gauge, Trophy } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { StatCard } from "@/components/StatCard";
import { Card } from "@/components/ui/card";
import { buttonClassName } from "@/components/ui/button";
import { getDashboardData } from "@/lib/data";
import { getLevelLabel } from "@/lib/utils";

export default async function DashboardPage() {
  const data = await getDashboardData();
  if (!data.profile.level) {
    return (
      <AppShell profile={data.profile}>
        <Card className="p-8">
          <h1 className="text-2xl font-black">أكمل الإعداد الأولي</h1>
          <p className="mt-3 text-slate-400">اختر مستواك قبل الدخول إلى الدروس.</p>
          <Link href="/onboarding" className={`${buttonClassName("default")} mt-6`}>الانتقال للإعداد</Link>
        </Card>
      </AppShell>
    );
  }

  return (
    <AppShell profile={data.profile}>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="المستوى الحالي" value={getLevelLabel(data.profile.level)} icon={Trophy} />
        <StatCard title="آخر نتيجة اختبار" value={data.attempt ? `${data.attempt.percentage}%` : "لم يبدأ"} icon={Gauge} />
        <StatCard title="التقدم" value={`${data.progress}%`} icon={BookOpenCheck} detail={`${data.completedCount}/${data.totalLessons} دروس`} />
        <StatCard title="الحصة القادمة" value={data.liveSession ? "مجدولة" : "لا يوجد"} icon={CalendarDays} />
      </div>
      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2 p-6">
          <h2 className="text-2xl font-black">تابع التعلم</h2>
          <p className="mt-3 text-slate-400">
            {data.nextLesson ? data.nextLesson.title : "كل الدروس المتاحة مكتملة حاليا."}
          </p>
          <Link href={data.nextLesson ? `/lessons/${data.nextLesson.id}` : "/lessons"} className={`${buttonClassName("default")} mt-6`}>
            متابعة التعلم
          </Link>
        </Card>
        <Card className="p-6">
          <h2 className="text-xl font-black">آخر إشعار</h2>
          <p className="mt-3 text-sm leading-7 text-slate-400">{data.notification?.title ?? "لا توجد إشعارات بعد"}</p>
          <Link href="/notifications" className="mt-5 inline-block text-sm font-bold text-sky-300">عرض الإشعارات</Link>
        </Card>
      </div>
    </AppShell>
  );
}
