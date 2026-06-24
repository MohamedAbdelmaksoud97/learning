"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export function NotificationBell({
  unreadCount,
  userId,
}: {
  unreadCount: number;
  userId: string;
}) {
  const [count, setCount] = useState(unreadCount);
  const [hasNew, setHasNew] = useState(unreadCount > 0);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`notification-bell:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          setCount((value) => value + 1);
          setHasNew(true);
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          if (payload.old?.is_read === false && payload.new?.is_read === true) {
            setCount((value) => Math.max(value - 1, 0));
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return (
    <Link
      href="/notifications"
      onClick={() => setHasNew(false)}
      className={cn(
        "relative grid h-11 w-11 place-items-center rounded-xl border bg-slate-900 text-slate-100 transition hover:border-sky-400/50",
        hasNew ? "border-sky-400/70 shadow-lg shadow-sky-950/40" : "border-slate-800",
      )}
      aria-label="الإشعارات"
    >
      <Bell className={cn("h-5 w-5", hasNew ? "text-sky-300" : "text-slate-100")} />
      {hasNew ? (
        <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(56,189,248,0.95)]" />
      ) : null}
      {count > 0 ? (
        <span className="absolute -left-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white ring-2 ring-slate-950">
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </Link>
  );
}
