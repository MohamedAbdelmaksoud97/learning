import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "وصل للتطور المالي",
  description: "منصة عربية احترافية لتعليم التداول",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="h-full antialiased">
      <body className="min-h-full bg-[#020617] text-slate-50">{children}</body>
    </html>
  );
}
