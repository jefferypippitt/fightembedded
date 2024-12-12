import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getAthletesByDivision } from "@/server/actions/get-athlete";
import {
  getDivisionBySlug,
  parseDivisionSlug,
  getFullDivisionName,
} from "@/data/weight-class";
import { AthleteListCard } from "@/components/athlete-list-card";
import { AthleteListCardSkeleton } from "./loading";

async function Athletes({ fullDivisionName }: { fullDivisionName: string }) {
  const athletes = await getAthletesByDivision(fullDivisionName);

  if (athletes.length === 0) {
    return (
      <p className="text-muted-foreground">
        No athletes found in this division.
      </p>
    );
  }

  // Sort athletes by rank (ascending order)
  const sortedAthletes = [...athletes].sort((a, b) => {
    // Handle cases where rank might be null/undefined
    if (!a.rank) return 1; // Push null/undefined ranks to the end
    if (!b.rank) return -1;
    return a.rank - b.rank;
  });

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {sortedAthletes.map((athlete) => (
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
        />
      ))}
    </div>
  );
}

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function DivisionPage({ params }: PageProps) {
  const resolvedParams = await params;

  if (!resolvedParams.slug) return notFound();

  // Normalize the slug to lowercase
  const normalizedSlug =
    typeof resolvedParams.slug === "string"
      ? resolvedParams.slug.toLowerCase()
      : "";

  // Parse and validate the division slug
  const { gender, isValid } = parseDivisionSlug(normalizedSlug);
  if (!isValid) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold">Invalid Division</h1>
        <p className="text-muted-foreground">
          The division &quot;{resolvedParams.slug}&quot; is not valid.
        </p>
      </main>
    );
  }

  // Get the division details
  const division = getDivisionBySlug(normalizedSlug);
  if (!division) return notFound();

  // Get the full division name
  const isWomen = gender === "women";
  const fullDivisionName = getFullDivisionName(division, isWomen).toLowerCase();

  return (
    <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <h1 className="text-2xl font-bold capitalize">
        {fullDivisionName} Division
      </h1>

      <Suspense
        fallback={
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <AthleteListCardSkeleton key={i} />
            ))}
          </div>
        }
      >
        <Athletes fullDivisionName={fullDivisionName} />
      </Suspense>
    </main>
  );
}
