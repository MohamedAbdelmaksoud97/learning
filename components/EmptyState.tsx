import { Card } from "@/components/ui/card";

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <Card className="p-8 text-center">
      <h3 className="text-lg font-bold text-slate-50">{title}</h3>
      {description ? <p className="mt-2 text-sm text-slate-400">{description}</p> : null}
    </Card>
  );
}
