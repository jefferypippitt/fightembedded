import { Badge } from "@/components/ui/badge";
import { Dot } from "lucide-react";

export default function LiveUpdatesBadge() {
  return (
    <div>
      <Badge variant="outline">
        <Dot className="size-4 animate-pulse text-green-500" />
        Live Updates
      </Badge>
    </div>
  );
}
