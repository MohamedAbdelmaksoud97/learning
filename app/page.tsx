import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  BarChart3,
  BookOpenCheck,
  CalendarDays,
  LineChart,
  ShieldCheck,
} from "lucide-react";
import { buttonClassName } from "@/components/ui/button";

const features = [
  {
    title: "مسار منظم من الصفر",
    description:
      "ابدأ بالمفاهيم الأساسية ثم انتقل تدريجيا إلى قراءة السوق وإدارة المخاطر.",
    icon: BookOpenCheck,
  },
  {
    title: "تطبيق عملي على السوق",
    description: "دروس وتمارين تساعدك على قراءة الشارت وفهم الحركة بدون تعقيد.",
    icon: LineChart,
  },
  {
    title: "حصص مباشرة مع المدرب",
    description: "مواعيد واضحة، روابط حضور، وإعادات للحصص عند توفرها.",
    icon: CalendarDays,
  },
];

const stats = [
  ["3", "مستويات تعليمية"],
  ["10+", "اختبارات وتطبيقات"],
  ["24/7", "وصول للمنصة"],
];

export default function Home() {
  return (
    <main
      className="min-h-screen overflow-hidden bg-[#020617] text-slate-50"
      dir="rtl"
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-6">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="تعلم التداول"
            width={44}
            height={44}
            className="h-11 w-11 rounded-2xl bg-white object-contain p-1"
          />
          <span className="text-lg font-black"> وصل للتطور المالي </span>
        </Link>
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

      <section className="mx-auto grid min-h-[calc(100vh-92px)] max-w-7xl items-center gap-10 px-5 pb-16 lg:grid-cols-[1fr_0.92fr]">
        <div>
          <p className="mb-5 inline-flex rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-2 text-sm font-bold text-sky-200">
            منصة عربية لتعليم التداول بطريقة عملية ومنظمة
          </p>
          <h1 className="max-w-3xl text-4xl font-black leading-tight text-white md:text-6xl">
            تعلم التداول بثقة من الأساسيات إلى قراءة السوق وإدارة المخاطر
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
            منصة تعليمية عربية تساعدك على بناء فهم واضح للتداول خطوة بخطوة، مع
            دروس مرتبة حسب المستوى، اختبارات قصيرة، حصص مباشرة، ومساعد ذكي يجيب
            عن أسئلتك أثناء التعلم.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/signup" className={buttonClassName("default")}>
              ابدأ التعلم الآن <ArrowLeft className="h-4 w-4" />
            </Link>
            <Link href="/login" className={buttonClassName("secondary")}>
              لدي حساب
            </Link>
          </div>
          <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
            {stats.map(([value, label]) => (
              <div
                key={label}
                className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4"
              >
                <p className="text-2xl font-black text-white">{value}</p>
                <p className="mt-1 text-xs text-slate-400">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-2xl shadow-blue-950/30">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-sky-300">
                  نظرة تعليمية على السوق
                </p>
                <h2 className="mt-2 text-2xl font-black text-white">
                  تعلم قبل أن تخاطر
                </h2>
              </div>
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-600/20 text-sky-200">
                <BarChart3 className="h-6 w-6" />
              </span>
            </div>

            <div className="mt-6 h-56 rounded-2xl border border-slate-800 bg-[#0F172A] p-4">
              <div className="flex h-full items-end gap-2">
                {[36, 54, 44, 70, 62, 88, 74, 94].map((height, index) => (
                  <div
                    key={index}
                    className="flex flex-1 flex-col items-center gap-2"
                  >
                    <div
                      className="w-full rounded-t-xl bg-gradient-to-t from-blue-700 to-sky-300"
                      style={{ height: `${height}%` }}
                    />
                    <span className="h-1 w-1 rounded-full bg-slate-600" />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm leading-7 text-emerald-100">
              <div className="mb-2 flex items-center gap-2 font-bold">
                <ShieldCheck className="h-4 w-4" />
                تنبيه مهم
              </div>
              المحتوى تعليمي فقط وليس توصية مالية. الهدف هو بناء المعرفة
              والانضباط قبل اتخاذ أي قرار.
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-slate-800 bg-[#0F172A] p-5 transition hover:border-sky-400/40"
              >
                <feature.icon className="h-7 w-7 text-sky-300" />
                <h3 className="mt-4 text-lg font-black">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
