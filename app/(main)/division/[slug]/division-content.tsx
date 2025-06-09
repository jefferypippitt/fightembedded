'use client'

import { useState, useCallback, useMemo } from 'react'
import { AthleteListCard } from '@/components/athlete-list-card'
import { SearchBar } from '@/components/search-bar'
import { AthleteComparison } from '@/components/athlete-comparison'
import type { Athlete } from '@/types/athlete'
import Link from 'next/link'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'

interface DivisionContentProps {
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

export function DivisionContent({ athletes }: DivisionContentProps) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const [selectedAthletes, setSelectedAthletes] = useState<Athlete[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // Debounced search handler with loading state
  const handleSearch = useDebouncedCallback((term: string) => {
    setIsSearching(true)
    const params = new URLSearchParams(searchParams)
    
    if (term) {
      params.set('query', term)
    } else {
      params.delete('query')
    }
    
    router.replace(`${pathname}?${params.toString()}`)
    setIsSearching(false)
  }, 300)

  const handleAthleteSelect = useCallback((athlete: Athlete) => {
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
  }, [])

  const handleClearSelection = useCallback(() => {
    setSelectedAthletes([])
  }, [])

  // Memoize the current query to prevent unnecessary re-renders
  const query = useMemo(() => searchParams.get('query') || '', [searchParams])

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

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="w-full sm:w-[400px]">
          <SearchBar 
            defaultValue={query} 
            onChange={handleSearch}
            placeholder="Search athletes by name, country, or division..."
            aria-label="Search athletes"
            maxWidth="400px"
            isLoading={isSearching}
          />
        </div>
        <div className="shrink-0">
          <AthleteComparison 
            selectedAthletes={selectedAthletes}
            onClearSelection={handleClearSelection}
          />
        </div>
      </div>

      <Athletes 
        athletes={athletes} 
        selectedAthletes={selectedAthletes}
        onSelect={handleAthleteSelect}
      />
    </div>
  )
} 