import Link from "next/link";
import {
  Bell,
  BookOpen,
  Bot,
  CalendarDays,
  LayoutDashboard,
  Medal,
  Settings,
  User,
  Users,
} from "lucide-react";
import { signOut } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import type { Profile } from "@/lib/types";

const links = [
  { href: "/dashboard", label: "لوحة التحكم", icon: LayoutDashboard },
  { href: "/ai-chat", label: "المساعد الذكي", icon: Bot },
  { href: "/lessons", label: "الدروس", icon: BookOpen },
  { href: "/live-sessions", label: "الحصص المباشرة", icon: CalendarDays },
  { href: "/notifications", label: "الإشعارات", icon: Bell },
  { href: "/success-stories", label: "قصص النجاح", icon: Medal },
  { href: "/profile", label: "الملف الشخصي", icon: User },
];

export function AppSidebar({ profile }: { profile: Profile }) {
  return (
    <aside className="hidden min-h-screen w-72 shrink-0 border-l border-slate-800 bg-slate-950/80 p-5 lg:block">
      <Link href="/dashboard" className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-600 text-lg font-black text-white">
          ع
        </span>
        <div>
          <p className="text-lg font-black text-white">استاذة حصه</p>
          <p className="text-xs text-slate-400">تعلم عربي احترافي</p>
        </div>
      </Link>
      <nav className="mt-10 space-y-2">
        {links.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-900 hover:text-white"
          >
            <item.icon className="h-5 w-5 text-sky-300" />
            {item.label}
          </Link>
        ))}
        {profile.role === "admin" ? (
          <>
            <Link
              href="/admin"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-900 hover:text-white"
            >
              <Settings className="h-5 w-5 text-sky-300" />
              الإدارة
            </Link>
            <Link
              href="/admin/users"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-900 hover:text-white"
            >
              <Users className="h-5 w-5 text-sky-300" />
              إدارة الحسابات
            </Link>
          </>
        ) : null}
      </nav>
      <form action={signOut} className="mt-10">
        <Button variant="secondary" className="w-full">
          تسجيل الخروج
        </Button>
      </form>
    </aside>
  );
}
