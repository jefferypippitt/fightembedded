"use cache";

import { Metadata } from "next";
import { Suspense } from "react";
import {
  AthletesSearchContainer,
  AthletesSearchInput,
} from "@/components/athletes-search";
import { AthleteImagePreloads } from "@/components/athlete-image-preloads";
import { getAthletes } from "@/server/actions/athlete";

export const metadata: Metadata = {
  title: "All UFC Athletes",
  description: "Search and compare UFC athletes by name, country, or division.",
};

async function AthletesContent() {
  const athletes = await getAthletes();

  return (
    <div className="space-y-8">
      <AthleteImagePreloads athletes={athletes} />
      <div className="w-full sm:max-w-xs lg:max-w-sm">
        <AthletesSearchInput className="w-full" athletes={athletes} />
      </div>
      <AthletesSearchContainer athletes={athletes} />
    </div>
  );
}

export default async function AthletesPage() {
  return (
    <section className="container space-y-6 pt-4 pb-6">
      <header className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl tracking-tighter">
            All UFC <span className="text-primary">Athletes</span>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
            Discover active fighters across the UFC roster. Filter by name,
            country, or division.
          </p>
        </div>
      </header>
      <Suspense fallback={<div>Loading athletes...</div>}>
        <AthletesContent />
      </Suspense>
    </section>
  );
}
