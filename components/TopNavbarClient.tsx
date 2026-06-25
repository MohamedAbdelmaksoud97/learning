"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Bell,
  BookOpen,
  Bot,
  CalendarDays,
  LayoutDashboard,
  LogOut,
  Medal,
  Menu,
  Settings,
  User,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { NotificationBell } from "@/components/NotificationBell";
import { signOut } from "@/lib/actions";
import type { NavIconKey, NavLink } from "@/lib/navigation";
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

export function TopNavbarClient({
  profile,
  unreadCount,
  links,
}: {
  profile: Profile;
  unreadCount: number;
  links: NavLink[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/95 px-4 py-4 backdrop-blur lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3 text-sm font-bold text-slate-100 transition active:scale-95 lg:hidden"
            aria-expanded={open}
            aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
          >
            {open ? (
              <X className="h-5 w-5 text-sky-300" />
            ) : (
              <Menu className="h-5 w-5 text-sky-300" />
            )}
            القائمة
          </button>
          <div className="min-w-0">
            <p className="text-sm text-slate-400">مرحبا بك</p>
            <h1 className="truncate text-xl font-black text-white">
              {profile.full_name || profile.email}
            </h1>
          </div>
        </div>
        <NotificationBell unreadCount={unreadCount} userId={profile.id} />
      </div>

      {open ? (
        <div className="mt-4 rounded-2xl border border-slate-800 bg-[#020617] p-3 shadow-2xl shadow-blue-950/30 lg:hidden">
          <div className="mb-3 flex items-center gap-3 border-b border-slate-800 px-2 pb-3">
            <Image
              src="/logo.png"
              alt="تعلم التداول"
              width={40}
              height={40}
              className="h-10 w-10 rounded-xl bg-white object-contain p-1"
            />
            <div>
              <p className="text-sm font-black text-white">استاذة حصه </p>
              <p className="text-xs text-slate-400">روابط المنصة</p>
            </div>
          </div>
          <nav className="grid gap-2">
            {links.map((item) => {
              const Icon = iconMap[item.icon];
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm font-bold text-slate-100"
                >
                  <Icon className="h-5 w-5 text-sky-300" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <form
            action={signOut}
            className="mt-3 border-t border-slate-800 pt-3"
          >
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/90 px-4 py-3 text-sm font-bold text-slate-100"
            >
              <LogOut className="h-5 w-5 text-sky-300" />
              تسجيل الخروج
            </button>
          </form>
        </div>
      ) : null}
    </header>
  );
}
