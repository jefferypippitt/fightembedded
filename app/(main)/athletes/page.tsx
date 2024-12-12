import { Suspense } from "react";
import { getAthletes } from "@/server/actions/athlete";
import { AthleteListCard } from "@/components/athlete-list-card";
import { Skeleton } from "@/components/ui/skeleton";
import { use } from "react";
import { SearchBar } from "@/components/search-bar";

// Create a loading skeleton for the athlete cards
function AthleteCardSkeleton() {
  return (
    <div className="rounded-lg border bg-card">
      <div className="p-3">
        {/* Avatar and Name section */}
        <div className="flex flex-col items-center mb-2">
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
  );
}

// Create an Athletes component to handle the async data
async function Athletes({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  // Await the searchParams before accessing query
  const params = await searchParams;
  const query = params?.query ?? "";

  const athletes = await getAthletes();

  // Filter athletes based on the query if it's not empty
  const filteredAthletes = query
    ? athletes.filter((athlete) =>
        athlete.name.toLowerCase().includes(query.toLowerCase())
      )
    : athletes; // Return all athletes if no query

  // Handle the case where filteredAthletes might be empty
  if (filteredAthletes.length === 0) {
    console.warn("No athletes found matching the query:", query);
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {filteredAthletes.map((athlete) => (
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
      {filteredAthletes.length === 0 && (
        <p className="text-muted-foreground col-span-full text-center">
          No athletes found.
        </p>
      )}
    </div>
  );
}

export default function AthletesPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  return (
    <main className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="space-y-6">
        <div className="space-y-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-center">All UFC Athletes</h1>
          <div className="w-full max-w-2xl">
            <SearchBar defaultValue={use(searchParams)?.query} />
          </div>
        </div>

        <Suspense
          fallback={
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[...Array(6)].map((_, i) => (
                <AthleteCardSkeleton key={i} />
              ))}
            </div>
          }
        >
          <Athletes searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  );
}
