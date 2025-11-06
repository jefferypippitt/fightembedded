import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

interface AthletesGridSkeletonProps {
  count?: number;
}

export function AthletesGridSkeleton({ count = 6 }: AthletesGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <Card
          key={i}
          className="h-full relative overflow-hidden flex flex-col p-2 sm:p-3 border-border/40 dark:border-border/40 bg-transparent"
        >
          {/* Corner Badges */}
          <div className="flex justify-between pb-2">
            <Skeleton className="h-3 w-8" />
            <Skeleton className="h-3 w-12" />
          </div>

          {/* Border line */}
          <div className="border-b border-border/40 -mx-2 sm:-mx-3 mb-3" />

          {/* Banner with Image */}
          <div className="relative h-14 w-full mb-3 overflow-hidden rounded-sm bg-muted/20">
            <Skeleton className="absolute inset-0" />
            {/* Centered Image Placeholder */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <Skeleton className="size-20 rounded-md" />
            </div>
          </div>

          {/* Name */}
          <div className="text-center mb-3">
            <Skeleton className="h-4 w-24 mx-auto mb-2" />
            <Skeleton className="h-3 w-16 mx-auto" />
          </div>

          {/* Division Badge */}
          <div className="flex items-center justify-center mb-3">
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>

          {/* Stats with Progress Bars */}
          <div className="space-y-1.5 sm:space-y-2">
            <div className="flex justify-between items-center">
              <Skeleton className="h-2.5 w-12" />
              <Skeleton className="h-2.5 w-8" />
            </div>
            <Skeleton className="h-1.5 w-full rounded-full" />

            <div className="flex justify-between items-center">
              <Skeleton className="h-2.5 w-12" />
              <Skeleton className="h-2.5 w-8" />
            </div>
            <Skeleton className="h-1.5 w-full rounded-full" />

            <div className="flex justify-between items-center">
              <Skeleton className="h-2.5 w-12" />
              <Skeleton className="h-2.5 w-8" />
            </div>
            <Skeleton className="h-1.5 w-full rounded-full" />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between w-full pt-4 mt-auto">
            <Skeleton className="h-2.5 w-16" />
            <Skeleton className="h-2.5 w-20" />
          </div>
        </Card>
      ))}
    </div>
  );
}
