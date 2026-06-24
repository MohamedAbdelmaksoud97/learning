import { cn, getLevelLabel } from "@/lib/utils";

export function LevelBadge({ level, className }: { level?: string | null; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-xs font-bold text-sky-200",
        className,
      )}
    >
      {getLevelLabel(level)}
    </span>
  );
}
