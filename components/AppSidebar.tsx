import Link from "next/link";
import Image from "next/image";
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
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/actions";
import { getNavLinks, type NavIconKey } from "@/lib/navigation";
import type { Profile } from "@/lib/types";

const iconMap = {
  dashboard: LayoutDashboard,
  assistant: Bot,
  lessons: BookOpen,
  live: CalendarDays,
  notifications: Bell,
  stories: Medal,
  profile: User,
  admin: Settings,
  users: Users,
} satisfies Record<NavIconKey, typeof LayoutDashboard>;

export function BrandMark() {
  return (
    <Link href="/dashboard" className="flex items-center gap-3">
      <Image
        src="/logo.png"
        alt="تعلم التداول"
        width={44}
        height={44}
        className="h-11 w-11 rounded-2xl bg-white object-contain p-1"
      />
      <div>
        <p className="text-lg font-black text-white"> وصل للتطور المالي </p>
        <p className="text-xs text-slate-400">منصة عربية احترافية</p>
      </div>
    </Link>
  );
}

export function AppSidebar({ profile }: { profile: Profile }) {
  const links = getNavLinks(profile.role);

  return (
    <aside className="hidden min-h-screen w-72 shrink-0 border-l border-slate-800 bg-slate-950/80 p-5 lg:block">
      <BrandMark />
      <nav className="mt-10 space-y-2">
        {links.map((item) => {
          const Icon = iconMap[item.icon];
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-900 hover:text-white"
            >
              <Icon className="h-5 w-5 text-sky-300" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <form action={signOut} className="mt-10">
        <Button variant="secondary" className="w-full">
          تسجيل الخروج
        </Button>
      </form>
    </aside>
  );
}
