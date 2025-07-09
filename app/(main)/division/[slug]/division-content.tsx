import type { Athlete } from "@/types/athlete";
import { AthletesSearch } from "@/components/athletes-search";
import Link from "next/link";

interface DivisionContentProps {
  athletes: Athlete[];
}

export function DivisionContent({ athletes }: DivisionContentProps) {
  if (athletes.length === 0) {
    return (
      <div className="text-center space-y-2">
        <p className="text-muted-foreground">
          No active athletes found in this division.
        </p>
        <p className="text-sm text-muted-foreground">
          Note: Retired athletes can be found in the{" "}
          <Link href="/retired" className="text-primary hover:underline">
            retired athletes
          </Link>{" "}
          section.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AthletesSearch athletes={athletes} showEmptyMessage={false} />
    </div>
  );
}
