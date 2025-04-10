import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

function EventCardSkeleton() {
  return (
    <Card
      className={cn(
        "w-[400px] h-32 mx-3",
        "relative overflow-hidden",
        "border-red-600/20 dark:border-red-600/20",
        "bg-gray-50 dark:bg-zinc-950",
        "bg-linear-to-r from-transparent via-red-600/[0.03] to-transparent",
        "dark:bg-linear-to-r dark:from-transparent dark:via-red-400/[0.02] dark:to-transparent",
        "p-2"
      )}
    >
      <div className="h-full flex flex-col justify-between relative z-10">
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-20 rounded-full" />
        </div>

        <div className="flex items-center gap-1">
          <Skeleton className="h-3 w-3" />
          <Skeleton className="h-3 w-40" />
        </div>

        <div className="flex items-center gap-2 p-1.5 rounded-lg">
          <Skeleton className="h-4 w-16 rounded" />
          <div className="h-3 w-px bg-red-600/20 dark:bg-red-500/30" />
          <Skeleton className="h-3 flex-1" />
        </div>
      </div>
    </Card>
  );
}

export function EventMarqueeSkeleton() {
  return (
    <section className="space-y-2">
      <div className="flex justify-center">
        <Badge
          variant="outline"
          className="px-4 py-1.5 text-base bg-red-500/10 text-red-600 dark:text-red-400 border-red-600/20 dark:border-red-500/30"
        >
          <Skeleton className="h-5 w-32" />
        </Badge>
      </div>
      <div
        className={cn(
          "relative flex h-[180px] w-full flex-col items-center justify-center overflow-hidden rounded-lg",
          "border border-red-600/20 dark:border-red-600/20",
          "bg-gray-50 dark:bg-zinc-950",
          "bg-linear-to-r from-transparent via-red-600/[0.03] to-transparent",
          "dark:bg-linear-to-r dark:from-transparent dark:via-red-400/[0.02] dark:to-transparent",
          "px-4"
        )}
      >
        <div className="w-[900px] mx-auto py-4 flex gap-4">
          <EventCardSkeleton />
          <EventCardSkeleton />
          <EventCardSkeleton />
          <EventCardSkeleton />
        </div>
      </div>
    </section>
  );
}
