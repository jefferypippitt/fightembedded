import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

function AthleteCardSkeleton() {
  return (
    <Card className="hover:bg-accent/50 transition-colors">
      <CardContent className="p-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 sm:h-14 sm:w-14 rounded-full" />
          <div className="flex flex-col gap-1.5 flex-1 min-w-0">
            <div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-12" />
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 mt-1">
              <div className="flex items-center justify-between w-full">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-12" />
              </div>
              <div className="flex items-center justify-between w-full">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-12" />
              </div>
              <div className="flex items-center justify-between w-full">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-12" />
              </div>
              <div className="flex items-center justify-between w-full">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-12" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
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