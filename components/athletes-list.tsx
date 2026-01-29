import { AthleteListCard } from "@/components/athlete-list-card";
import type { Athlete } from "@/types/athlete";

interface AthletesListProps {
  athletes: Athlete[];
  showEmptyMessage?: boolean;
  emptyMessage?: string;
  disableCursor?: boolean;
}

export function AthletesList({
  athletes,
  showEmptyMessage = true,
  emptyMessage = "No athletes found.",
  disableCursor = false,
}: AthletesListProps) {
  if (athletes.length === 0 && showEmptyMessage) {
    return (
      <div className="text-center space-y-2">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div
      className="*:data-[slot=card]:bg-card grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 *:data-[slot=card]:shadow-xs"
      role="grid"
      aria-label="Athletes grid"
    >
      {athletes.map((athlete) => (
        <AthleteListCard
          key={athlete.id}
          id={athlete.id}
          name={athlete.name}
          weightDivision={athlete.weightDivision}
          imageUrl={athlete.imageUrl || undefined}
          updatedAt={athlete.updatedAt}
          country={athlete.country}
          wins={athlete.wins}
          losses={athlete.losses}
          draws={athlete.draws ?? undefined}
          winsByKo={athlete.winsByKo}
          winsBySubmission={athlete.winsBySubmission}
          rank={athlete.rank ?? undefined}
          poundForPoundRank={athlete.poundForPoundRank ?? undefined}
          followers={athlete.followers}
          age={athlete.age}
          retired={athlete.retired ?? false}
          priority={false}
          disableCursor={disableCursor}
        />
      ))}
    </div>
  );
}
