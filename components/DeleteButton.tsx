import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DeleteButton({
  action,
  label = "حذف",
}: {
  action: () => Promise<void>;
  label?: string;
}) {
  return (
    <form action={action}>
      <Button variant="danger" size="sm">
        <Trash2 className="h-4 w-4" />
        {label}
      </Button>
    </form>
  );
}
