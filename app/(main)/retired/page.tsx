import { getRetiredAthletes } from "@/server/actions/get-retired-athletes";
import { AthleteListCard } from "@/components/athlete-list-card";
import { Badge } from "@/components/ui/badge";
import { Metadata } from "next";
import { Athlete } from "@/types/athlete";

export const metadata: Metadata = {
  title: "Retired Athletes",
  description: "List of retired UFC fighters",
};

export default async function RetiredAthletesPage() {
  const retiredAthletes = await getRetiredAthletes();

  return (
    <main className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="space-y-6">
        <div className="flex justify-center mb-6">
          <Badge
            variant="outline"
            className="px-4 py-1.5 text-xl sm:text-2xl bg-red-500/10 text-red-600 dark:text-red-400 border-red-600/20 dark:border-red-500/30"
          >
            Retired UFC Athletes
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {retiredAthletes.length > 0 ? (
            retiredAthletes.map((athlete: Athlete) => (
              <AthleteListCard
                key={athlete.id}
                name={athlete.name}
                weightDivision={athlete.weightDivision}
                imageUrl={athlete.imageUrl || undefined}
                country={athlete.country}
                wins={athlete.wins}
                losses={athlete.losses}
                draws={athlete.draws}
                winsByKo={athlete.winsByKo}
                winsBySubmission={athlete.winsBySubmission}
                rank={athlete.rank}
                followers={athlete.followers}
                age={athlete.age}
                retired={true}
              />
            ))
          ) : (
            <p className="col-span-full text-center text-muted-foreground">
              No retired athletes found.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
