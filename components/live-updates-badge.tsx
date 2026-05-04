import { Badge } from "@/components/ui/badge";

export default function LiveUpdatesBadge() {
  return (
    <Badge variant="outline">
      <span className="relative flex items-center gap-1">
        <span className="relative flex size-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-green-500 dark:bg-green-400" />
          <span className="relative inline-flex size-2 rounded-full bg-green-500 dark:bg-green-400" />
        </span>
        Live Updates
      </span>
    </Badge>
  );
}
