"use cache";

import { getRetiredAthletes } from "@/server/actions/athlete";
import { Metadata } from "next";
import { Suspense } from "react";
import {
  AthletesSearchContainer,
  AthletesSearchInput,
} from "@/components/athletes-search";
import { AthleteImagePreloads } from "@/components/athlete-image-preloads";

export const metadata: Metadata = {
  title: "Retired Athletes",
  description: "Browse all retired UFC fighters and their career statistics",
  openGraph: {
    title: "Retired Athletes",
    description:
      "View detailed statistics and career records of retired UFC fighters. Get comprehensive analytics and performance data.",
    type: "website",
    siteName: "Fight Embedded",
  },
  twitter: {
    card: "summary",
    title: "Retired Athletes",
    description:
      "Complete stats and career records of retired UFC athletes. Access detailed performance metrics and analytics.",
  },
};

async function RetiredContent() {
  const athletes = await getRetiredAthletes();

  return (
    <div className="space-y-8">
      <AthleteImagePreloads athletes={athletes} />
      <div className="w-full sm:max-w-xs lg:max-w-sm">
        <AthletesSearchInput
          className="w-full"
          athletes={athletes}
          placeholder="Search retired athletes..."
        />
      </div>
      <AthletesSearchContainer athletes={athletes} />
    </div>
  );
}

export default async function RetiredPage() {
  return (
    <section className="container space-y-6 pt-4 pb-6">
      <header className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl tracking-tighter">
            Retired <span className="text-primary">Athletes</span>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
            Explore the career records, statistics, and profiles of retired UFC athletes.
          </p>
        </div>
      </header>
      <Suspense fallback={<div>Loading athletes...</div>}>
        <RetiredContent />
      </Suspense>
    </section>
  );
}
