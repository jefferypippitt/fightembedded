import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { getRetiredAthletes } from "@/server/actions/get-retired-athletes";

export default async function LoadingRetiredPage() {
  const retiredAthletes = await getRetiredAthletes();
  const skeletonCount = retiredAthletes.length;

  return (
    <main className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="space-y-6">
        <div className="flex justify-center mb-6">
          <Badge
            variant="outline"
            className="px-4 py-1.5 text-xl sm:text-2xl bg-red-500/10 text-red-600 dark:text-red-400 border-red-600/20 dark:border-red-500/30"
          >
            Retired UFC Athletes
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <Skeleton key={i} className="h-[250px] w-full rounded-lg" />
          ))}
        </div>
      </div>
    </main>
  );
}
