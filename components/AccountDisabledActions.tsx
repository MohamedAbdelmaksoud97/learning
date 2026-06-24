"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function AccountDisabledActions() {
  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <Button type="button" className="w-full" onClick={signOut}>
      <LogOut className="h-4 w-4" />
      تسجيل الخروج
    </Button>
  );
}
