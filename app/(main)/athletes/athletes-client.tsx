'use client'

import { useState } from "react"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { SearchBar } from "@/components/search-bar"
import { AthleteListCard } from "@/components/athlete-list-card"
import { Card, CardContent } from "@/components/ui/card"
import { Athlete } from "@/types/athlete"
import { AthleteComparison } from "@/components/athlete-comparison"

interface AthletesClientProps {
  searchParams?: { [key: string]: string | string[] | undefined }
  athletes: Athlete[]
}

function Athletes({ athletes, query, selectedAthletes, onSelect }: { 
  athletes: Athlete[], 
  query: string,
  selectedAthletes: Athlete[],
  onSelect: (athlete: Athlete) => void
}) {
  const filteredAthletes = query
    ? athletes.filter((athlete) =>
        athlete.name.toLowerCase().includes(query.toLowerCase())
      )
    : athletes

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {filteredAthletes.map((athlete) => (
        <AthleteListCard
          key={athlete.id}
          id={athlete.id}
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
          retired={athlete.retired ?? false}
          isSelected={selectedAthletes.some((a) => a.id === athlete.id)}
          onSelect={() => onSelect(athlete)}
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

function AthleteCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="aspect-[4/3] bg-muted animate-pulse" />
        <div className="p-4 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </CardContent>
    </Card>
  )
}

export function AthletesClient({ searchParams, athletes }: AthletesClientProps) {
  const [selectedAthletes, setSelectedAthletes] = useState<Athlete[]>([])
  const [query, setQuery] = useState(searchParams?.query?.toString() || "")

  const handleAthleteSelect = (athlete: Athlete) => {
    setSelectedAthletes((current) => {
      const isSelected = current.some((a) => a.id === athlete.id)
      
      if (isSelected) {
        return current.filter((a) => a.id !== athlete.id)
      }
      
      if (current.length >= 2) {
        return current
      }
      
      return [...current, athlete]
    })
  }

  const handleClearSelection = () => {
    setSelectedAthletes([])
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <SearchBar 
            defaultValue={query} 
            onChange={(value) => setQuery(value)}
          />
        </div>
        <AthleteComparison 
          selectedAthletes={selectedAthletes}
          onClearSelection={handleClearSelection}
        />
      </div>

      <Suspense fallback={
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <AthleteCardSkeleton key={i} />
          ))}
        </div>
      }>
        <Athletes 
          athletes={athletes} 
          query={query}
          selectedAthletes={selectedAthletes}
          onSelect={handleAthleteSelect}
        />
      </Suspense>
    </div>
  )
} 