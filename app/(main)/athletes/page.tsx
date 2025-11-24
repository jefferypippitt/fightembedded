import { Metadata } from "next";
import { Suspense } from "react";
import {
  AthletesSearchContainer,
  AthletesSearchInput,
} from "@/components/athletes-search";
import { getAthletes } from "@/server/actions/athlete";

export const metadata: Metadata = {
  title: "All UFC Athletes",
  description: "Search and compare UFC athletes by name, country, or division.",
};

export default async function AthletesPage() {
  const athletes = await getAthletes();

  return (
    <section className="container space-y-10 py-6">
      <header className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-primary uppercase tracking-wide">
            Athlete Directory
          </p>
          <h1 className="text-balance text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white">
            All UFC Athletes
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground text-balance max-w-2xl">
            Discover every active fighter across the UFC roster. Filter by name,
            country, or division to lock in quick comparisons.
          </p>
        </div>
        <div className="w-full sm:max-w-xs lg:max-w-sm">
          <Suspense fallback={null}>
            <AthletesSearchInput className="w-full" athletes={athletes} />
          </Suspense>
        </div>
      </header>
      <Suspense fallback={null}>
        <AthletesSearchContainer athletes={athletes} />
      </Suspense>
    </section>
  );
}
