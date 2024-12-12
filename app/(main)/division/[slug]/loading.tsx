import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function AthleteListCardSkeleton() {
  return (
    <Card className="hover:bg-accent/50 transition-colors">
      <CardContent className="p-3">
        {/* Top Badge - Ranking and Age */}
        <div className="flex justify-between items-center mb-3">
          <Skeleton className="h-3 w-6" />
          <Skeleton className="h-3 w-10" />
        </div>

        {/* Avatar and Name Section */}
        <div className="flex flex-col items-center mb-3">
          <Skeleton className="h-16 w-16 rounded-full ring-1 ring-gray-300" />
          <div className="text-center mt-2">
            <Skeleton className="h-4 w-24 mb-1" />
            <Skeleton className="h-3 w-12" />
          </div>
        </div>

        {/* Stats with Progress Bars */}
        <div className="space-y-1.5">
          {/* Win Rate */}
          <div className="flex justify-between items-center text-[10px]">
            <Skeleton className="h-2 w-12" />
            <Skeleton className="h-2 w-8" />
          </div>
          <Skeleton className="h-1 w-full" />

          {/* KO/TKO */}
          <div className="flex justify-between items-center text-[10px]">
            <Skeleton className="h-2 w-12" />
            <Skeleton className="h-2 w-8" />
          </div>
          <Skeleton className="h-1 w-full" />

          {/* Submission */}
          <div className="flex justify-between items-center text-[10px]">
            <Skeleton className="h-2 w-12" />
            <Skeleton className="h-2 w-8" />
          </div>
          <Skeleton className="h-1 w-full" />
        </div>
      </CardContent>

      <CardFooter className="px-3 py-2 border-t">
        <div className="flex items-center justify-between w-full text-[10px]">
          <div className="flex items-center gap-1">
            <Skeleton className="h-3 w-3" />
            <Skeleton className="h-2 w-12" />
          </div>
          <div className="flex items-center gap-1">
            <Skeleton className="h-2 w-16" />
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

export default function Loading() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {Array.from({ length: 9 }).map((_, i) => (
        <AthleteListCardSkeleton key={i} />
      ))}
    </div>
  );
}
