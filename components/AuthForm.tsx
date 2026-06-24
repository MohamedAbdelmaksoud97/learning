"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { signIn, signUp } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const action = mode === "login" ? signIn : signUp;
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <Card className="w-full max-w-md p-6">
      <h1 className="text-2xl font-black text-white">{mode === "login" ? "تسجيل الدخول" : "إنشاء حساب"}</h1>
      <p className="mt-2 text-sm text-slate-400">
        {mode === "login" ? "ادخل إلى مسارك التعليمي." : "سيتم إرسال رسالة تأكيد عبر Supabase SMTP."}
      </p>
      <form action={formAction} className="mt-6 space-y-4">
        {mode === "signup" ? <Input name="full_name" placeholder="الاسم الكامل" required /> : null}
        <Input name="email" type="email" placeholder="البريد الإلكتروني" required />
        <Input name="password" type="password" placeholder="كلمة المرور" required minLength={6} />
        {state?.error ? <p className="text-sm text-red-300">{state.error}</p> : null}
        {state?.success ? <p className="text-sm text-emerald-300">{state.success}</p> : null}
        <Button className="w-full" disabled={pending}>
          {pending ? "جاري التنفيذ..." : mode === "login" ? "دخول" : "إنشاء الحساب"}
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </form>
      <p className="mt-5 text-center text-sm text-slate-400">
        {mode === "login" ? "ليس لديك حساب؟ " : "لديك حساب بالفعل؟ "}
        <Link href={mode === "login" ? "/signup" : "/login"} className="font-bold text-sky-300">
          {mode === "login" ? "أنشئ حسابا" : "تسجيل الدخول"}
        </Link>
      </p>
    </Card>
  );
}
