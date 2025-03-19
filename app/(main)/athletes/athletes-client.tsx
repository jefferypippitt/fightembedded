'use client'

import { useState, useMemo } from 'react'
import { SearchBar } from '@/components/search-bar'
import { AthleteListCard } from '@/components/athlete-list-card'
import { Athlete } from '@/types/athlete'
import { AthleteComparison } from '@/components/athlete-comparison'

interface AthletesClientProps {
  searchParams?: { [key: string]: string | string[] | undefined }
  athletes: Athlete[]
}

function Athletes({ 
  athletes, 
  query, 
  selectedAthletes, 
  onSelect 
}: { 
  athletes: Athlete[]
  query: string
  selectedAthletes: Athlete[]
  onSelect: (athlete: Athlete) => void
}) {
  const filteredAthletes = useMemo(() => {
    if (!query) return athletes

    const searchTerm = query.toLowerCase()
    return athletes.filter((athlete) =>
      athlete.name.toLowerCase().includes(searchTerm) ||
      athlete.country.toLowerCase().includes(searchTerm) ||
      athlete.weightDivision.toLowerCase().includes(searchTerm)
    )
  }, [athletes, query])

  if (filteredAthletes.length === 0) {
    return (
      <div className="text-center space-y-2">
        <p className="text-muted-foreground">
          No athletes found matching your search.
        </p>
        <p className="text-sm text-muted-foreground">
          Try adjusting your search terms or check for typos.
        </p>
      </div>
    )
  }

  return (
    <div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
      role="grid"
      aria-label="Athletes grid"
    >
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
    </div>
  )
}

export function AthletesClient({ searchParams, athletes }: AthletesClientProps) {
  const [selectedAthletes, setSelectedAthletes] = useState<Athlete[]>([])
  const [query, setQuery] = useState(searchParams?.query?.toString() || '')

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
            placeholder="Search athletes by name, country, or division..."
            aria-label="Search athletes"
          />
        </div>
        <AthleteComparison 
          selectedAthletes={selectedAthletes}
          onClearSelection={handleClearSelection}
        />
      </div>

      <Athletes 
        athletes={athletes} 
        query={query}
        selectedAthletes={selectedAthletes}
        onSelect={handleAthleteSelect}
      />
    </div>
  )
} 