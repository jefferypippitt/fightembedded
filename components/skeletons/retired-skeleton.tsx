import { Skeleton } from "@/components/ui/skeleton"

export function RetiredSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header area */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-10 w-[120px]" />
      </div>

      {/* Grid of athletes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-4">
            {/* Image */}
            <Skeleton className="aspect-[3/4] w-full rounded-lg" />
            
            {/* Text content */}
            <div className="space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex gap-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-9" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 