import { Metadata } from "next";
import { Suspense } from "react";
import {
  AthletesSearchContainer,
  AthletesSearchInput,
} from "@/components/athletes-search";
import { getAthletes } from "@/server/actions/athlete";
import { Skeleton } from "@/components/ui/skeleton";
import { AthletesGridSkeleton } from "@/components/athletes-grid-skeleton";

export const metadata: Metadata = {
  title: "All UFC Athletes",
  description: "Search and compare UFC athletes by name, country, or division.",
};

export default async function AthletesPage() {
  "use cache";
  const athletes = await getAthletes();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
          All UFC Athletes
        </h1>
        <Suspense
          fallback={
            <Skeleton className="w-full sm:w-80 lg:w-96 h-10 rounded-md" />
          }
        >
          <AthletesSearchInput
            className="w-full sm:w-80 lg:w-96"
            athletes={athletes}
          />
        </Suspense>
      </div>
      <Suspense fallback={<AthletesGridSkeleton count={8} />}>
        <AthletesSearchContainer athletes={athletes} />
      </Suspense>
    </div>
  );
}
