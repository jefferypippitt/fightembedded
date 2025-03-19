import { Suspense } from "react";
import { getRetiredAthletes } from "@/server/actions/get-retired-athletes";
import { AthleteListCard } from "@/components/athlete-list-card";
import { Metadata } from "next";
import RetiredLoadingPage from "./loading";

export const metadata: Metadata = {
  title: "Retired Athletes",
  description: "Browse retired UFC fighters and their career statistics",
};

async function RetiredAthletes() {
  const retiredAthletes = await getRetiredAthletes();

  if (!retiredAthletes || retiredAthletes.length === 0) {
    return (
      <div className="text-center space-y-2">
        <p className="text-muted-foreground">
          No retired athletes found.
        </p>
        <p className="text-sm text-muted-foreground">
          Check back later for updates.
        </p>
      </div>
    );
  }

  return (
    <div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
      role="grid"
      aria-label="Retired athletes grid"
    >
      {retiredAthletes.map((athlete) => (
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
      ))}
    </div>
  );
}

export default function RetiredAthletesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-center mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
          Retired UFC Athletes
        </h1>
      </div>
      <Suspense fallback={<RetiredLoadingPage />}>
        <RetiredAthletes />
      </Suspense>
    </div>
  );
}
