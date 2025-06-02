import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function AthletesSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="w-full sm:w-[400px]">
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="shrink-0">
          <Skeleton className="h-10 w-[120px]" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="h-full relative overflow-hidden group border-red-600/10 dark:border-red-600/10 bg-white dark:bg-neutral-950 shadow-xs hover:shadow-md transition-all duration-200 hover:border-red-600/20 dark:hover:border-red-600/20 p-2">
            <CardContent className="p-2 pt-0 relative z-10">
              <div className="flex justify-between items-center mb-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-12" />
              </div>

              <div className="flex flex-col items-center mb-2">
                <Skeleton className="h-16 w-16 rounded-full mb-2" />
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-3 w-16" />
              </div>

              <div className="flex items-center justify-center mb-2">
                <Skeleton className="h-5 w-20" />
              </div>

              <div className="space-y-1">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-3 w-12" />
                    </div>
                    <Skeleton className="h-1 w-full" />
                  </div>
                ))}
              </div>
            </CardContent>

            <CardFooter className="px-2 py-1 border-red-600/10 dark:border-red-500/20 relative z-10">
              <div className="flex items-center justify-between w-full">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-20" />
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
} 