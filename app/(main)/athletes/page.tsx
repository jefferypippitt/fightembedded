import { Suspense } from "react"
import { getAthletes } from "@/server/actions/athlete"
import { AthleteListCard } from "@/components/athlete-list-card"

import { Skeleton } from "@/components/ui/skeleton"


import { use } from "react"
import { SearchBar } from "@/components/search-bar"

// Create a loading skeleton for the athlete cards
function AthleteCardSkeleton() {
  return (
    <div className="space-y-3">
      <div className="h-20 rounded-lg bg-muted" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  )
}

// Create an Athletes component to handle the async data
async function Athletes({ searchParams }: { searchParams: Promise<{ query?: string }> }) {
  // Await the searchParams before accessing query
  const params = await searchParams;
  const query = params?.query ?? "";
  
  const athletes = await getAthletes();
  
  // Filter athletes based on the query if it's not empty
  const filteredAthletes = query ? athletes.filter((athlete) =>
    athlete.name.toLowerCase().includes(query.toLowerCase())
  ) : athletes; // Return all athletes if no query

  // Handle the case where filteredAthletes might be empty
  if (filteredAthletes.length === 0) {
    console.warn("No athletes found matching the query:", query);
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
        />
      ))}
      {filteredAthletes.length === 0 && (
        <p className="text-muted-foreground col-span-full text-center">
          No athletes found.
        </p>
      )}
    </div>
  )
}

export default function AthletesPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ query?: string }> 
}) {
  return (
    <main className="container max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">UFC Athletes</h1>
        <SearchBar defaultValue={use(searchParams)?.query} />
      </div>
      
      <Suspense 
        fallback={
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <AthleteCardSkeleton key={i} />
            ))}
          </div>
        }
      >
        <Athletes searchParams={searchParams} />
      </Suspense>
    </main>
  )
} 