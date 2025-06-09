'use client'

import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
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

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      onClearSelection()
    }
  }

  const handleClose = () => {
    onClearSelection()
    setOpen(false)
  }

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>
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
          <Badge variant="destructive" className="ml-2">
            {selectedAthletes.length}/2
          </Badge>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[85vh]">
        <div className="mx-auto w-full max-w-4xl">
          <DrawerHeader>
            <DrawerTitle>Athlete Comparison</DrawerTitle>
          </DrawerHeader>
          <ScrollArea className="h-[calc(85vh-8rem)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
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
            <div className="p-4">
              <Button 
                variant="default" 
                size="lg"
                className="w-full"
                onClick={handleClose}
              >
                Close
              </Button>
            </div>
          </ScrollArea>
        </div>
      </DrawerContent>
    </Drawer>
  )
} 