import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getAthletesByDivision } from "@/server/actions/get-athlete";
import { getDivisionBySlug, parseDivisionSlug, getFullDivisionName } from "@/data/weight-class";
import { Skeleton } from "@/components/ui/skeleton";
import { AthleteListCard } from "@/components/athlete-list-card";


async function Athletes({ fullDivisionName }: { fullDivisionName: string }) {
  const athletes = await getAthletesByDivision(fullDivisionName);

  if (athletes.length === 0) {
    return <p className="text-muted-foreground">No athletes found in this division.</p>;
  }

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {athletes.map((athlete) => (
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
        />
      ))}
    </div>
  );
}

// Update the AthleteCardSkeleton component
function AthleteCardSkeleton() {
  return (
    <div className="rounded-lg border bg-card">
      <div className="p-3">
        {/* Avatar and Name section */}
        <div className="flex flex-col items-center mb-2 relative">
          {/* Rank badge position */}
          <div className="absolute -top-1 -right-1">
            <Skeleton className="h-4 w-8" />
          </div>
          <div className="relative">
            <Skeleton className="h-16 w-16 rounded-full" />
          </div>
          <div className="text-center mt-2 space-y-1">
            <Skeleton className="h-4 w-24 mx-auto" />
            <Skeleton className="h-3 w-16 mx-auto" />
          </div>
        </div>

        {/* Division and Country */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>

        {/* Stats section */}
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-1">
              <div className="flex justify-between">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-8" />
              </div>
              <Skeleton className="h-1 w-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-3 py-2 border-t">
        <div className="flex justify-between">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-8" />
        </div>
      </div>
    </div>
  )
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
  const normalizedSlug = typeof resolvedParams.slug === 'string' ? resolvedParams.slug.toLowerCase() : '';

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
      <h1 className="text-2xl font-bold capitalize">{fullDivisionName} Division</h1>
      
      <Suspense fallback={
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <AthleteCardSkeleton key={i} />
          ))}
        </div>
      }>
        <Athletes fullDivisionName={fullDivisionName} />
      </Suspense>
    </main>
  );
}