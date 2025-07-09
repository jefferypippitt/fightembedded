import type { Athlete } from "@/types/athlete";
import { AthletesSearch } from "@/components/athletes-search";

interface AthletesContentProps {
  athletes: Athlete[];
}

export function AthletesContent({ athletes }: AthletesContentProps) {
  return (
    <div className="space-y-4">
      <AthletesSearch athletes={athletes} />
    </div>
  );
}
