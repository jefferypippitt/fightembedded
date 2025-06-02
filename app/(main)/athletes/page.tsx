import { getAthletes } from '@/server/actions/athlete'
import { Metadata } from "next"
import { AthletesContent } from './athletes-content'

export const metadata: Metadata = {
  title: "Athletes",
  description: "Browse all UFC fighters and their career statistics",
}

export default async function AthletesPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>
}) {
  const athletes = await getAthletes()
  const params = await searchParams
  const query = params.query || ''
  
  // Enhanced server-side filtering with better search logic
  const filteredAthletes = query.trim()
    ? athletes.filter((athlete) => {
        const searchTerm = query.toLowerCase().trim()
        const searchTerms = searchTerm.split(/\s+/)
        
        // Check if all search terms are found in any of the searchable fields
        return searchTerms.every(term => {
          const nameMatch = athlete.name.toLowerCase().includes(term)
          const countryMatch = athlete.country.toLowerCase().includes(term)
          const divisionMatch = athlete.weightDivision.toLowerCase().includes(term)
          
          return nameMatch || countryMatch || divisionMatch
        })
      })
    : athletes

  return <AthletesContent athletes={filteredAthletes} />
}
