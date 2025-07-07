import { Skeleton } from "@/components/ui/skeleton";

export function DivisionChartSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex items-center justify-between">
          {/* Rank and name skeleton */}
          <div className="flex items-center space-x-3">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-32" />
          </div>
          {/* Bar skeleton */}
          <div className="flex-1 mx-4">
            <Skeleton
              className="h-6 rounded"
              style={{ width: `${Math.random() * 60 + 20}%` }}
            />
          </div>
          {/* Follower count skeleton */}
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </div>
  );
}
