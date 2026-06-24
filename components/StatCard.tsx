import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

export function StatCard({
  title,
  value,
  icon: Icon,
  detail,
}: {
  title: string;
  value: string | number;
  icon: LucideIcon;
  detail?: string;
}) {
  return (
    <Card className="group p-5 transition hover:-translate-y-1 hover:border-sky-400/40 hover:shadow-blue-950/40">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">{title}</p>
          <p className="mt-2 text-2xl font-black text-slate-50">{value}</p>
        </div>
        <div className="rounded-2xl bg-blue-600/15 p-3 text-sky-300 transition group-hover:bg-blue-600/25">
          <Icon className="h-6 w-6" />
        </div>
      </div>
      {detail ? <p className="mt-4 text-sm text-slate-400">{detail}</p> : null}
    </Card>
  );
}
