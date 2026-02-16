import { Metadata } from "next";
import { Suspense } from "react";
import HeroSection from "@/components/hero-section";
import ChampionsSection from "@/components/champions-section";
import EventsSection from "@/components/events-section";
import RankingsSection from "@/components/rankings-section";
import { Skeleton } from "@/components/ui/skeleton";
import { AthletesGridSkeleton } from "@/components/athletes-grid-skeleton";

export const metadata: Metadata = {
  title: "UFC Athletes & Events",
  description: "Explore UFC athletes stats, rankings, and more in one place.",
};

function HeroSkeleton() {
  return (
    <section className="space-y-2 py-2 sm:py-4">
      <div className="flex flex-col items-center gap-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-48" />
        <div className="flex gap-6 mt-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    </section>
  );
}

function ChampionsSkeleton() {
  return (
    <div className="space-y-8">
      <AthletesGridSkeleton count={8} />
    </div>
  );
}

function RankingsSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-6 w-32" />
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <Skeleton className="h-4 w-6" />
          <Skeleton className="h-4 w-full" />
        </div>
      ))}
    </div>
  );
}

export default function Page() {
  return (
    <main>
      <Suspense fallback={<HeroSkeleton />}>
        <HeroSection />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-2 sm:gap-3 mt-8">
        <div className="lg:col-span-4 space-y-3 sm:space-y-4 lg:space-y-6 order-last lg:order-first overflow-hidden">
          <Suspense fallback={<ChampionsSkeleton />}>
            <ChampionsSection />
          </Suspense>
          <Suspense fallback={null}>
            <EventsSection />
          </Suspense>
        </div>

        <div>
          <Suspense fallback={<RankingsSkeleton />}>
            <RankingsSection />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
