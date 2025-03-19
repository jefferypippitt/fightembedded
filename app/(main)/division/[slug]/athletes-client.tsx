'use client'

import { useState } from 'react'
import { AthleteListCard } from '@/components/athlete-list-card'
import { AthleteComparison } from '@/components/athlete-comparison'
import { Athlete } from '@/types/athlete'
import Link from 'next/link'

interface AthletesClientProps {
  athletes: Athlete[]
}

export function AthletesClient({ athletes }: AthletesClientProps) {
  const [selectedAthletes, setSelectedAthletes] = useState<Athlete[]>([])

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
    )
  }

  // Sort athletes by rank (ascending order)
  const sortedAthletes = [...athletes].sort((a, b) => {
    if (!a.rank) return 1
    if (!b.rank) return -1
    return a.rank - b.rank
  })

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <AthleteComparison 
          selectedAthletes={selectedAthletes}
          onClearSelection={handleClearSelection}
        />
      </div>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {sortedAthletes.map((athlete) => (
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
            onSelect={() => handleAthleteSelect(athlete)}
          />
        ))}
      </div>
    </div>
  )
} 