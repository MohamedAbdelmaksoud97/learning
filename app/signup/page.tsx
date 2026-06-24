import { AuthForm } from "@/components/AuthForm";

export default function SignupPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#020617] px-4">
      <AuthForm mode="signup" />
    </main>
  );
}
