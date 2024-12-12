import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function EventCardSkeleton() {
  return (
    <Card
      className={cn(
        "w-[400px] h-32 mx-3",
        "relative overflow-hidden",
        "border-red-600/20 dark:border-red-500/30",
        "bg-gradient-to-br from-white via-gray-50 to-gray-100",
        "dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900"
      )}
    >
      <CardContent className="p-2.5 h-full flex flex-col justify-between">
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>

        <div className="flex items-center gap-1">
          <Skeleton className="h-3 w-3" />
          <Skeleton className="h-3 w-40" />
        </div>

        <div className="flex items-center gap-2 bg-black/5 dark:bg-black/40 p-2 rounded-lg">
          <Skeleton className="h-4 w-20 rounded" />
          <div className="h-3 w-px bg-red-600/20 dark:bg-red-500/30" />
          <Skeleton className="h-4 flex-1" />
        </div>
      </CardContent>
    </Card>
  );
}

export function EventMarqueeSkeleton() {
  return (
    <section className="space-y-2">
      <Skeleton className="h-7 w-36" /> {/* For "Upcoming Events" title */}
      <div className="relative flex h-[180px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background px-4">
        <div className="w-[900px] mx-auto py-4 flex gap-4">
          <EventCardSkeleton />
          <EventCardSkeleton />
          <EventCardSkeleton />
        </div>
      </div>
    </section>
  );
} 