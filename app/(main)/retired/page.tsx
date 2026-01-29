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

function RetiredSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="h-10 w-48 animate-pulse rounded-md bg-muted" />
        <div className="h-4 w-64 animate-pulse rounded-md bg-muted" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-48 animate-pulse rounded-xl border border-border/60 bg-muted/40"
          />
        ))}
      </div>
    </div>
  );
}

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
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Retired Directory
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <h1 className="text-balance text-2xl font-semibold text-gray-900 dark:text-white sm:text-3xl">
              Retired Athletes
            </h1>
          </div>
          <p className="text-balance text-sm text-muted-foreground sm:text-base">
            Explore the career records, statistics, and profiles of retired UFC athletes.
          </p>
        </div>
      </header>
      <Suspense fallback={<RetiredSkeleton />}>
        <RetiredContent />
      </Suspense>
    </section>
  );
}
