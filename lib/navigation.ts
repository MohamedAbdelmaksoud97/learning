export type NavIconKey =
  | "dashboard"
  | "assistant"
  | "roadmap"
  | "lessons"
  | "live"
  | "notifications"
  | "stories"
  | "profile"
  | "admin"
  | "users";

export type NavLink = {
  href: string;
  label: string;
  icon: NavIconKey;
};

export const appNavLinks: NavLink[] = [
  { href: "/dashboard", label: "الرئيسية", icon: "dashboard" },
  { href: "/roadmap", label: "الخارطة", icon: "roadmap" },
  { href: "/ai-chat", label: "المساعد الذكي", icon: "assistant" },
  { href: "/lessons", label: "الدروس", icon: "lessons" },
  { href: "/live-sessions", label: "الحصص المباشرة", icon: "live" },
  { href: "/notifications", label: "الإشعارات", icon: "notifications" },
  { href: "/success-stories", label: "قصص النجاح", icon: "stories" },
  { href: "/profile", label: "الملف الشخصي", icon: "profile" },
];

export const adminNavLinks: NavLink[] = [
  { href: "/admin", label: "الإدارة", icon: "admin" },
  { href: "/admin/users", label: "إدارة الحسابات", icon: "users" },
];

export function getNavLinks(role?: string | null) {
  return role === "admin" ? [...appNavLinks, ...adminNavLinks] : appNavLinks;
}
