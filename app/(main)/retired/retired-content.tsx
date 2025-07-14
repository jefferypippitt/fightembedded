import { AthletesList } from "@/components/athletes-list";
import type { Athlete } from "@/types/athlete";

interface RetiredContentProps {
  athletes: Athlete[];
}

export function RetiredContent({ athletes }: RetiredContentProps) {
  return (
    <AthletesList
      athletes={athletes}
      emptyMessage="No retired athletes found."
    />
  );
}
