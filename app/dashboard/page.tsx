import Link from "next/link";
import {
  BarChart3,
  BookOpen,
  BookOpenCheck,
  Brain,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ClipboardList,
  Flame,
  Gauge,
  Lightbulb,
  LineChart,
  Map,
  Mic,
  ShieldCheck,
  Target,
  Trophy,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { StatCard } from "@/components/StatCard";
import { buttonClassName } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getDashboardData } from "@/lib/data";
import { cn, getLevelLabel } from "@/lib/utils";

const dayLabels = ["سبت", "أحد", "إثن", "ثلا", "أرب", "خمي", "جمع"];

const beginnerGuideItems = [
  {
    title: "كل يوم درس جديد",
    body: "ستدرس يومياً درساً جديداً متكاملاً يحتوي على فيديو، نص، وتطبيق عملي لتضمن التطور التدريجي والمستمر.",
    icon: BookOpen,
  },
  {
    title: "التركيز على التطبيق أولاً",
    body: "التداول مهارة عملية؛ لذا ركز على التطبيق المباشر على الشارت أكثر من الحفظ والتعليم النظري.",
    icon: Target,
  },
  {
    title: "تعلّم بأمان على حساب تجريبي",
    body: "الأخطاء واردة جداً في البداية. استخدم الحساب التجريبي لتتدرب براحتك دون المخاطرة بمالك الحقيقي.",
    icon: ShieldCheck,
  },
  {
    title: "طبّق وشارك تحليلك يومياً",
    body: "التدريب اليومي ضرورة. شارك تحليلاتك لنراجع تقدمك ونصحح أخطاءك أولاً بأول.",
    icon: LineChart,
  },
  {
    title: "هدفك: الاستقلالية التامة",
    body: "مع الاستمرار والتصحيح ستصل لمرحلة تعتمد فيها على تحليلك الشخصي وتصنع قراراتك دون توصيات.",
    icon: Trophy,
  },
];

function toDateKey(value: Date) {
  return value.toISOString().slice(0, 10);
}

function addDays(value: Date, days: number) {
  const next = new Date(value);
  next.setDate(next.getDate() + days);
  return next;
}

function getLearningStreak(completedDates: string[]) {
  const completedSet = new Set(
    completedDates.map((value) => toDateKey(new Date(value))),
  );
  const today = new Date();

  if (!completedSet.has(toDateKey(today))) return 0;

  let streak = 0;
  let cursor = today;

  while (completedSet.has(toDateKey(cursor))) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }

  return streak;
}

function LearningStreakCard({ completedDates }: { completedDates: string[] }) {
  const streak = getLearningStreak(completedDates);
  const today = new Date();
  const completedSet = new Set(
    completedDates.map((value) => toDateKey(new Date(value))),
  );
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = addDays(today, index - 6);
    const active = completedSet.has(toDateKey(date));
    const current = index === 6;
    return {
      label: dayLabels[date.getDay()],
      day: date.getDate(),
      active,
      current,
    };
  });

  return (
    <Card className="relative overflow-hidden p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_45%,rgba(37,99,235,0.18),transparent_38%)]" />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="grid h-20 w-20 place-items-center rounded-3xl bg-orange-500 text-white shadow-lg shadow-orange-950/30">
            <Flame className="h-10 w-10" />
          </div>
          <div>
            <div className="flex items-end gap-3">
              <span className="text-6xl font-black text-white">{streak}</span>
              <span className="pb-3 text-2xl font-black text-slate-300">
                يوم متتالي
              </span>
            </div>
            <p className="text-slate-400">
              {streak ? "استمر، لا تكسر السلسلة اليوم." : "ابدأ رحلتك اليوم!"}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-end gap-2">
          {days.map((day) => (
            <div key={`${day.label}-${day.day}`} className="text-center">
              <p
                className={cn(
                  "mb-2 text-xs font-bold",
                  day.current ? "text-orange-300" : "text-slate-500",
                )}
              >
                {day.label}
              </p>
              <div
                className={cn(
                  "grid h-14 w-14 place-items-center rounded-xl text-lg font-black transition",
                  day.active
                    ? "bg-emerald-500/20 text-emerald-300"
                    : "bg-slate-800/80 text-slate-500",
                  day.current && "bg-orange-500 text-white shadow-lg shadow-orange-950/30",
                )}
              >
                {day.day}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

function BeginnerGuideCard() {
  return (
    <Card className="overflow-hidden p-0">
      <details className="group">
        <summary
          dir="ltr"
          className="flex cursor-pointer list-none items-center justify-between gap-4 p-6 [&::-webkit-details-marker]:hidden"
        >
          <ChevronDown className="h-6 w-6 text-slate-400 transition group-open:rotate-180" />
          <h2
            dir="rtl"
            className="flex items-center gap-2 text-3xl font-black text-white"
          >
            <Lightbulb className="h-7 w-7 text-yellow-300" />
            دليل المبتدئين
          </h2>
        </summary>
        <div className="space-y-4 border-t border-slate-800 px-6 pb-6 pt-2">
          {beginnerGuideItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex items-start gap-4 rounded-2xl border border-slate-800 bg-slate-950/55 p-4"
              >
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-blue-600/15 text-sky-300">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">{item.title}</h3>
                  <p className="mt-2 leading-7 text-slate-400">{item.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </details>
    </Card>
  );
}

function TodayTasksCard({
  nextLessonTitle,
  nextLessonHref,
  nextLessonId,
}: {
  nextLessonTitle: string;
  nextLessonHref: string;
  nextLessonId?: string;
}) {
  const lessonCardsHref = nextLessonId
    ? `/lessons/${nextLessonId}?tab=vocabulary`
    : "/lessons";
  const lessonExerciseHref = nextLessonId
    ? `/lessons/${nextLessonId}/quiz`
    : "/lessons";
  const tasks = [
    {
      title: "درس اليوم",
      body: nextLessonTitle,
      icon: BookOpen,
      href: nextLessonHref,
    },
    {
      title: "البطاقات التعليمية",
      body: "اذهب إلى بطاقات ومفردات الدرس الحالي",
      icon: Brain,
      href: lessonCardsHref,
    },
    {
      title: "المعلم الذكي",
      body: "اسأل عن أي نقطة غير واضحة",
      icon: Mic,
      href: "/ai-chat",
    },
    {
      title: "التمرين",
      body: "اذهب إلى تمرين الدرس الحالي",
      icon: BarChart3,
      href: lessonExerciseHref,
    },
  ];

  return (
    <Card className="p-6">
      <h2 className="mb-6 flex items-center gap-2 text-3xl font-black text-white">
        <ClipboardList className="h-7 w-7 text-sky-300" />
        مهام اليوم
      </h2>
      <div className="space-y-4">
        {tasks.map((task) => {
          const Icon = task.icon;
          return (
            <Link
              key={task.title}
              href={task.href}
              className="flex items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-800/70 p-4 transition hover:-translate-y-0.5 hover:border-sky-400/50"
            >
              <div className="flex items-center gap-4">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-blue-600/15 text-sky-300">
                  <Icon className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">{task.title}</h3>
                  <p className="mt-1 text-slate-400">{task.body}</p>
                </div>
              </div>
              <ChevronLeft className="h-5 w-5 text-slate-400" />
            </Link>
          );
        })}
      </div>
    </Card>
  );
}

function ActivityCard({ completedDates }: { completedDates: string[] }) {
  const completedSet = new Set(
    completedDates.map((value) => toDateKey(new Date(value))),
  );
  const today = new Date();
  const cells = Array.from({ length: 84 }, (_, index) => {
    const date = addDays(today, index - 83);
    return {
      key: toDateKey(date),
      active: completedSet.has(toDateKey(date)),
      current: toDateKey(date) === toDateKey(today),
    };
  });

  return (
    <Card className="p-6">
      <h2 className="mb-6 flex items-center gap-2 text-3xl font-black text-white">
        <CalendarDays className="h-7 w-7 text-sky-300" />
        نشاطك
      </h2>
      <div className="grid grid-cols-12 gap-2">
        {cells.map((cell) => (
          <div
            key={cell.key}
            className={cn(
              "aspect-square rounded-md bg-slate-800",
              cell.active && "bg-blue-500",
              cell.current && "ring-2 ring-sky-300",
            )}
            title={cell.key}
          />
        ))}
      </div>
      <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-400">
        <span>أقل</span>
        <span className="h-4 w-4 rounded bg-slate-800" />
        <span className="h-4 w-4 rounded bg-blue-900" />
        <span className="h-4 w-4 rounded bg-blue-600" />
        <span className="h-4 w-4 rounded bg-sky-300" />
        <span>أكثر</span>
      </div>
    </Card>
  );
}

function ProgressMapPreview({
  completedCount,
  totalLessons,
  nextLessonIndex,
}: {
  completedCount: number;
  totalLessons: number;
  nextLessonIndex: number;
}) {
  const visible = Array.from({ length: Math.min(8, Math.max(totalLessons, 1)) });

  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 className="flex items-center gap-2 text-3xl font-black text-white">
          <Map className="h-7 w-7 text-sky-300" />
          خارطة التقدم
        </h2>
        <Link href="/roadmap" className="text-sm font-bold text-sky-300">
          عرض الخارطة
        </Link>
      </div>
      <div className="flex flex-wrap gap-3">
        {visible.map((_, index) => {
          const completed = index < completedCount;
          const current = index === nextLessonIndex;
          return (
            <div
              key={index}
              className={cn(
                "relative grid h-16 w-16 place-items-center rounded-2xl border text-lg font-black",
                completed &&
                  "border-emerald-500/50 bg-emerald-500/15 text-emerald-300",
                current &&
                  "border-blue-500 bg-blue-600/20 text-white ring-2 ring-blue-500/70",
                !completed &&
                  !current &&
                  "border-slate-800 bg-slate-800/80 text-slate-500",
              )}
            >
              {completed ? <CheckIcon /> : current ? index + 1 : "قفل"}
            </div>
          );
        })}
      </div>
      <div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-400">
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded bg-emerald-400" />
          مكتمل
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded bg-blue-500" />
          الحالي
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded bg-slate-700" />
          متاح لاحقاً
        </span>
      </div>
    </Card>
  );
}

function CheckIcon() {
  return <BookOpenCheck className="h-7 w-7" />;
}

export default async function DashboardPage() {
  const data = await getDashboardData();
  if (!data.profile.level) {
    return (
      <AppShell profile={data.profile}>
        <Card className="p-8">
          <h1 className="text-2xl font-black">أكمل الإعداد الأولي</h1>
          <p className="mt-3 text-slate-400">
            اختر مستواك قبل الدخول إلى الدروس.
          </p>
          <Link href="/onboarding" className={`${buttonClassName("default")} mt-6`}>
            الانتقال للإعداد
          </Link>
        </Card>
      </AppShell>
    );
  }

  const nextLessonHref = data.nextLesson
    ? `/lessons/${data.nextLesson.id}`
    : "/lessons";
  const nextLessonTitle =
    data.nextLesson?.title ?? "كل الدروس المتاحة مكتملة حالياً.";

  return (
    <AppShell profile={data.profile}>
      <div className="space-y-8">
        <LearningStreakCard completedDates={data.completedDates} />

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="المستوى الحالي"
            value={getLevelLabel(data.profile.level)}
            icon={Trophy}
          />
          <StatCard
            title="آخر نتيجة اختبار"
            value={data.attempt ? `${data.attempt.percentage}%` : "لم يبدأ"}
            icon={Gauge}
          />
          <StatCard
            title="التقدم"
            value={`${data.progress}%`}
            icon={BookOpenCheck}
            detail={`${data.completedCount}/${data.totalLessons} دروس`}
          />
          <StatCard
            title="الحصة القادمة"
            value={data.liveSession ? "مجدولة" : "لا يوجد"}
            icon={CalendarDays}
          />
        </div>

        <BeginnerGuideCard />

        <div className="grid gap-5 lg:grid-cols-[1.25fr_0.9fr]">
          <TodayTasksCard
            nextLessonTitle={nextLessonTitle}
            nextLessonHref={nextLessonHref}
            nextLessonId={data.nextLesson?.id}
          />
          <ActivityCard completedDates={data.completedDates} />
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          <Card className="lg:col-span-2 p-6">
            <h2 className="text-2xl font-black">تابع التعلم</h2>
            <p className="mt-3 text-slate-400">{nextLessonTitle}</p>
            <Link href={nextLessonHref} className={`${buttonClassName("default")} mt-6`}>
              متابعة التعلم
            </Link>
          </Card>
          <Card className="p-6">
            <h2 className="text-xl font-black">آخر إشعار</h2>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              {data.notification?.title ?? "لا توجد إشعارات بعد"}
            </p>
            <Link
              href="/notifications"
              className="mt-5 inline-block text-sm font-bold text-sky-300"
            >
              عرض الإشعارات
            </Link>
          </Card>
        </div>

        <ProgressMapPreview
          completedCount={data.completedCount}
          totalLessons={data.totalLessons}
          nextLessonIndex={Math.max(0, data.completedCount)}
        />
      </div>
    </AppShell>
  );
}
