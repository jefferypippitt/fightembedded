'use client'

import { AthleteListCard } from '@/components/athlete-list-card'
import type { Athlete } from '@/types/athlete'

interface RetiredContentProps {
  athletes: Athlete[]
}

function Athletes({ 
  athletes
}: { 
  athletes: Athlete[]
}) {
  if (athletes.length === 0) {
    return (
      <div className="text-center space-y-2">
        <p className="text-muted-foreground">
          No retired athletes found.
        </p>
        <p className="text-sm text-muted-foreground">
          Check back later for updates.
        </p>
      </div>
    )
  }

  return (
    <div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
      role="grid"
      aria-label="Retired athletes grid"
    >
      {athletes.map((athlete) => (
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
          retired={true}
        />
      ))}
    </div>
  )
}

export function RetiredContent({ athletes }: RetiredContentProps) {
  return <Athletes athletes={athletes} />
} 