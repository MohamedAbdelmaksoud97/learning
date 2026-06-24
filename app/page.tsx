import Link from "next/link";
import {
  ArrowLeft,
  BookOpenCheck,
  CalendarDays,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { buttonClassName } from "@/components/ui/button";

const features: [string, string, LucideIcon][] = [
  ["اختبار تفاعلي", "انتقالات سلسة وتغذية راجعة فورية", BookOpenCheck],
  ["حصص مباشرة", "تقويم وروابط مباشرة وعد تنازلي", CalendarDays],
  ["حماية Supabase", "Auth وRLS ومسارات محمية", ShieldCheck],
];

export default function Home() {
  return (
    <main className="premium-grid min-h-screen overflow-hidden bg-[#020617] text-slate-50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-6">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-600 font-black">
            ع
          </span>
          <span className="text-lg font-black">أكاديمية الارتقاء</span>
        </div>
        <div className="flex gap-3">
          <Link
            href="/login"
            className="text-sm font-bold text-slate-300 hover:text-white"
          >
            دخول
          </Link>
          <Link
            href="/signup"
            className="text-sm font-bold text-sky-300 hover:text-sky-200"
          >
            حساب جديد
          </Link>
        </div>
      </nav>
      <section className="mx-auto grid min-h-[calc(100vh-92px)] max-w-7xl items-center gap-10 px-5 pb-16 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="mb-5 inline-flex rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-2 text-sm font-bold text-sky-200">
            منصة تعليمية عربية بنظام مستويات ذكي
          </p>
          <h1 className="max-w-3xl text-4xl font-black leading-tight text-white md:text-6xl">
            تعلم بمسار واضح يبدأ من اختبار تحديد المستوى وينتهي بتقدم قابل
            للقياس
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
            تجربة SaaS داكنة، دروس فيديو، حصص مباشرة، إشعارات داخلية، ولوحة
            إدارة للمدربين.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/signup" className={buttonClassName("default")}>
              ابدأ الآن <ArrowLeft className="h-4 w-4" />
            </Link>
            <Link href="/login" className={buttonClassName("secondary")}>
              لدي حساب
            </Link>
          </div>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-2xl shadow-blue-950/30">
          <div className="grid gap-4">
            {features.map(([title, desc, Icon]) => (
              <div
                key={String(title)}
                className="rounded-2xl border border-slate-800 bg-[#0F172A] p-5 transition hover:border-sky-400/40"
              >
                <Icon className="h-7 w-7 text-sky-300" />
                <h3 className="mt-4 text-lg font-black">{title}</h3>
                <p className="mt-2 text-sm text-slate-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
