import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

function EventCardSkeleton() {
  return (
    <Card
      className={cn(
        "w-[400px] h-32 mx-3",
        "relative overflow-hidden",
        "border-red-600/20 dark:border-red-600/20",
        "bg-gray-50 dark:bg-black",
        "bg-gradient-to-r from-transparent via-red-600/5 to-transparent",
        "dark:from-transparent dark:via-red-600/10 dark:to-transparent"
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
      <div className="flex justify-center">
        <Badge
          variant="outline"
          className="px-4 py-1.5 text-base bg-red-500/10 text-red-600 dark:text-red-400 border-red-600/20 dark:border-red-500/30"
        >
          <Skeleton className="h-5 w-32" />
        </Badge>
      </div>
      <div className="relative flex h-[180px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-gray-50 dark:bg-black border-red-600/20 dark:border-red-600/20 px-4">
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
