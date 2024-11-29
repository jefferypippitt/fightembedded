import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

function AthleteCardSkeleton() {
  return (
    <Card className="hover:bg-accent/50 transition-colors">
      <CardContent className="p-3">
        {/* Avatar and Name section */}
        <div className="flex flex-col items-center mb-2 relative">
          {/* Rank badge position */}
          <div className="absolute -top-1 -right-1">
            <Skeleton className="h-4 w-8" />
          </div>
          <div className="relative">
            <Skeleton className="h-16 w-16 rounded-full" />
          </div>
          <div className="text-center mt-2 space-y-1">
            <Skeleton className="h-4 w-24 mx-auto" />
            <Skeleton className="h-3 w-16 mx-auto" />
          </div>
        </div>

        {/* Division and Country */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>

        {/* Stats section */}
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-1">
              <div className="flex justify-between">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-8" />
              </div>
              <Skeleton className="h-1 w-full" />
            </div>
          ))}
        </div>
      </CardContent>

      {/* Footer */}
      <div className="px-3 py-2 border-t">
        <div className="flex justify-between">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-8" />
        </div>
      </div>
    </Card>
  )
}

export default function DivisionLoading() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <Skeleton className="h-8 w-64" />
      
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <AthleteCardSkeleton key={i} />
        ))}
      </div>
    </main>
  )
}