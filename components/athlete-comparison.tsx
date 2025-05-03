'use client'

import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Scale } from 'lucide-react'
import { AthleteListCard } from './athlete-list-card'
import { Badge } from './ui/badge'
import { Athlete } from '@/types/athlete'
import { useState } from 'react'

interface AthleteComparisonProps {
  selectedAthletes: Athlete[]
  onClearSelection: () => void
}

export function AthleteComparison({ selectedAthletes, onClearSelection }: AthleteComparisonProps) {
  const [open, setOpen] = useState(false)
  const canCompare = selectedAthletes.length === 2

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className={`gap-2 ${!canCompare ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent'}`}
          onClick={(e) => {
            if (!canCompare) {
              e.preventDefault()
              return
            }
            setOpen(true)
          }}
        >
          <Scale className="h-4 w-4" />
          Compare
          <Badge variant="secondary" className="ml-2">
            {selectedAthletes.length}/2
          </Badge>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[90vw] sm:max-w-[600px]">
        <SheetHeader>
          <SheetTitle>Athlete Comparison</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-8rem)] mt-6">
          <div className="grid grid-cols-2 gap-4 px-4">
            {selectedAthletes.map((athlete) => (
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
              />
            ))}
          </div>
          <Button 
            variant="default" 
            size="lg"
            className='mx-auto block mt-4 w-1/2'
            onClick={() => {
              onClearSelection()
              setOpen(false)
            }}
          >
            Clear Selection
          </Button>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
} 