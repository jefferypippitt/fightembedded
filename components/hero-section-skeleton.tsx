import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dot } from "lucide-react";

export function HeroSkeleton() {
  return (
    <div className="w-full md:w-auto flex flex-col items-center">
      <Badge
        variant="outline"
        className="bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-600/20 dark:border-zinc-500/30 text-xs mb-1 md:mb-2"
      >
        <Dot className="h-3 w-3 sm:h-4 sm:w-4 animate-pulse text-green-500 dark:text-green-400" />
        Live Updates
      </Badge>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full max-w-[280px]">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="text-center">
            <div className="flex items-center justify-center space-x-1">
              <Skeleton className="h-6 w-12" />
              {i === 0 || i === 3 ? (
                <Skeleton className="h-4 w-4" />
              ) : null}
            </div>
            <Skeleton className="h-4 w-20 mx-auto mt-1" />
          </div>
        ))}
      </div>
    </div>
  );
} 