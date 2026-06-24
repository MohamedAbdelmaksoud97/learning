"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export function AccountStatusGuard({ userId }: { userId: string }) {
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`account-status:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${userId}`,
        },
        (payload) => {
          if (payload.new?.is_active === false) {
            window.location.href = "/account-disabled";
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return null;
}
