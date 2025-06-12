'use client'

import { AthleteListCard } from '@/components/athlete-list-card'
import type { Athlete } from '@/types/athlete'
import { SearchBar } from '@/components/search-bar'
import { useState, useMemo } from 'react'
import { useDebouncedCallback } from 'use-debounce'

interface RetiredContentProps {
  athletes: Athlete[]
}

function Athletes({ 
  athletes,
  searchQuery
}: { 
  athletes: Athlete[]
  searchQuery: string
}) {
  // Memoized filtered athletes
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

  if (filteredAthletes.length === 0) {
    return (
      <div className="text-center space-y-2">
        <p className="text-muted-foreground">
          No retired athletes found matching your search.
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
      aria-label="Retired athletes grid"
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
          retired={true}
        />
      ))}
    </div>
  )
}

export function RetiredContent({ athletes }: RetiredContentProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  // Debounced search handler
  const handleSearch = useDebouncedCallback(
    (value: string) => {
      setIsSearching(true)
      setSearchQuery(value)
      setIsSearching(false)
    },
    300
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="w-full sm:w-[400px]">
          <SearchBar 
            onChange={handleSearch}
            placeholder="Search retired athletes by name, country, or division..."
            aria-label="Search retired athletes"
            maxWidth="400px"
            isLoading={isSearching}
          />
        </div>
      </div>
      <Athletes athletes={athletes} searchQuery={searchQuery} />
    </div>
  )
} 