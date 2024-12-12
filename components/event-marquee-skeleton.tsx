import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

function EventCardSkeleton() {
  return (
    <Card className="w-80 mx-3">
      <CardContent className="p-2.5 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-16" />
        </div>

        <div className="flex items-center gap-1">
          <Skeleton className="h-3 w-3" />
          <Skeleton className="h-3 w-32" />
        </div>

        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-16" />
          <div className="h-3 w-px bg-muted-foreground/30" />
          <Skeleton className="h-3 w-24" />
        </div>
      </CardContent>
    </Card>
  );
}

export function EventMarqueeSkeleton() {
  return (
    <section className="space-y-2">
      <div className="relative flex h-[180px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background px-4">
        <div className="w-[700px] mx-auto py-4 flex gap-4">
          <EventCardSkeleton />
        </div>
      </div>
    </section>
  );
} 