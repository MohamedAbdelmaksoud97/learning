import { Card } from "@/components/ui/card";

export function AdminTable({ title, rows }: { title: string; rows: Record<string, unknown>[] }) {
  const keys = rows[0] ? Object.keys(rows[0]).slice(0, 6) : [];
  return (
    <Card className="mt-6 overflow-hidden">
      <div className="border-b border-slate-800 p-5">
        <h2 className="text-xl font-black">{title}</h2>
      </div>
      {rows.length ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-950 text-slate-400">
              <tr>{keys.map((key) => <th key={key} className="p-3 text-right">{key}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={String(row.id ?? index)} className="border-t border-slate-800">
                  {keys.map((key) => <td key={key} className="max-w-64 truncate p-3 text-slate-300">{String(row[key] ?? "")}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="p-5 text-slate-400">لا توجد بيانات.</p>
      )}
    </Card>
  );
}
