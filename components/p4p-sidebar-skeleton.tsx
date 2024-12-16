import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function P4PSidebarSkeleton() {
  return (
    <Card
      className={cn(
        "h-full flex flex-col",
        "border-red-600/20 dark:border-red-500/30",
        "bg-gradient-to-br from-white via-gray-50 to-gray-100",
        "dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900",
        "relative overflow-hidden"
      )}
    >
      <CardHeader className="p-2 pb-0 shrink-0">
        <div className="flex items-center justify-center mb-2">
          <Skeleton className="h-4 w-40" />
        </div>
        <div className="w-full h-8 bg-red-600/10 dark:bg-red-500/20 rounded-md" />
      </CardHeader>
      <CardContent className="p-2 flex-1">
        {[...Array(15)].map((_, i) => (
          <div key={i} className="flex items-center space-x-2 p-1.5">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-grow space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
} 