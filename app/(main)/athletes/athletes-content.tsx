'use client'

import { AthleteListCard } from '@/components/athlete-list-card'
import type { Athlete } from '@/types/athlete'
import { SearchBar } from '@/components/search-bar'
import { AthleteComparison } from '@/components/athlete-comparison'
import { useState, useCallback, useMemo } from 'react'
import { useDebouncedCallback } from 'use-debounce'

interface AthletesContentProps {
  athletes: Athlete[]
}

function Athletes({ 
  athletes,
  selectedAthletes,
  onSelect
}: { 
  athletes: Athlete[]
  selectedAthletes: Athlete[]
  onSelect: (athlete: Athlete) => void
}) {
  if (athletes.length === 0) {
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
          retired={athlete.retired ?? false}
          isSelected={selectedAthletes.some((a) => a.id === athlete.id)}
          onSelect={() => onSelect(athlete)}
        />
      ))}
    </div>
  )
}

export function AthletesContent({ athletes }: AthletesContentProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAthletes, setSelectedAthletes] = useState<Athlete[]>([])

  // Simplified search with useMemo
  const filteredAthletes = useMemo(() => {
    if (!searchQuery.trim()) return athletes

    const searchTerms = searchQuery.toLowerCase().trim().split(/\s+/)
    
    return athletes.filter((athlete) => 
      searchTerms.every(term => 
        athlete.name.toLowerCase().includes(term) ||
        athlete.country.toLowerCase().includes(term) ||
        athlete.weightDivision.toLowerCase().includes(term)
      )
    )
  }, [athletes, searchQuery])

  // Simplified debounced search
  const handleSearch = useDebouncedCallback(
    (value: string) => setSearchQuery(value),
    300
  )

  // Simplified athlete selection
  const handleAthleteSelect = useCallback((athlete: Athlete) => {
    setSelectedAthletes(prev => {
      const isSelected = prev.some(a => a.id === athlete.id)
      if (isSelected) return prev.filter(a => a.id !== athlete.id)
      if (prev.length >= 2) return [prev[1], athlete]
      return [...prev, athlete]
    })
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
          All UFC Athletes
        </h1>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="w-full sm:w-[400px]">
            <SearchBar 
              defaultValue={searchQuery} 
              onChange={handleSearch}
              placeholder="Search athletes by name, country, or division..."
              aria-label="Search athletes"
              maxWidth="400px"
            />
          </div>
          <div className="shrink-0">
            <AthleteComparison 
              selectedAthletes={selectedAthletes}
              onClearSelection={() => setSelectedAthletes([])}
            />
          </div>
        </div>

        <Athletes 
          athletes={filteredAthletes} 
          selectedAthletes={selectedAthletes}
          onSelect={handleAthleteSelect}
        />
      </div>
    </div>
  )
} 