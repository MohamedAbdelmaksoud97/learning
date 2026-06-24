import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatArabicDate(value: string | Date, options?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("ar-EG", {
    dateStyle: "medium",
    timeStyle: "short",
    ...options,
  }).format(new Date(value));
}

export function getLevelLabel(level?: string | null) {
  if (level === "expert") return "خبير";
  if (level === "advanced") return "متقدم";
  return "مبتدئ";
}

export function getAllowedLevels(level?: string | null) {
  if (level === "expert") return ["beginner", "advanced", "expert"];
  if (level === "advanced") return ["beginner", "advanced"];
  return ["beginner"];
}

export function calculateLevel(percentage: number) {
  if (percentage >= 80) return "expert";
  if (percentage >= 50) return "advanced";
  return "beginner";
}
