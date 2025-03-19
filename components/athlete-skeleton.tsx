import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function AthleteCardSkeleton() {
  return (
    <Card className="h-full relative overflow-hidden">
      <CardContent className="p-3">
        {/* Top Badge - Ranking and Age */}
        <div className="flex justify-between items-center mb-3">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-4 w-12" />
        </div>

        {/* Avatar and Name section */}
        <div className="flex flex-col items-center mb-3">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="text-center mt-2">
            <Skeleton className="h-4 w-32 mb-1" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>

        {/* Division */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>

        {/* Stats with Progress Bars */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-12" />
          </div>
          <Skeleton className="h-1 w-full" />

          <div className="flex justify-between items-center">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-12" />
          </div>
          <Skeleton className="h-1 w-full" />

          <div className="flex justify-between items-center">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-12" />
          </div>
          <Skeleton className="h-1 w-full" />
        </div>
      </CardContent>

      <CardFooter className="px-3 py-2 border-t">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-1">
            <Skeleton className="h-3 w-20" />
          </div>
          <div className="flex items-center gap-1">
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

export function AthletesGridSkeleton({ count = 9 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <AthleteCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function AthletesListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
      ))}
    </div>
  )
} 