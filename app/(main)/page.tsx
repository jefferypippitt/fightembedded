import { Metadata } from "next";
import { Suspense } from "react";
import HeroSectionWrapper from "@/components/hero-section-wrapper";
import ChampionsSectionWrapper from "@/components/champions-section-wrapper";
import EventsSectionWrapper from "@/components/events-section";
import RankingsSectionWrapper from "@/components/rankings-section";
import { ChampionsSkeleton } from "@/components/champions-section-skeleton";
import { EventsSkeleton } from "@/components/events-section-skeleton";
import { RankingsSkeleton } from "@/components/rankings-section-skeleton";
import { HeroSkeleton } from "@/components/hero-section-skeleton";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Your Ultimate Source for UFC Fighter Stats. Explore detailed profiles, fight statistics, and rankings of all UFC athletes in one place",
};

export default function Page() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<HeroSkeleton/>}>
        <HeroSectionWrapper />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-2 sm:gap-3 mt-8">
        <div className="lg:col-span-4 space-y-3 sm:space-y-4 lg:space-y-6 order-last lg:order-first overflow-hidden">
          <Suspense fallback={<ChampionsSkeleton />}>
            <ChampionsSectionWrapper />
          </Suspense>
          <Suspense fallback={<EventsSkeleton />}>
            <EventsSectionWrapper />
          </Suspense>
        </div>

        <aside className="lg:col-span-1 overflow-hidden">
          <Suspense fallback={<RankingsSkeleton />}>
            <RankingsSectionWrapper />
          </Suspense>
        </aside>
      </div>
    </div>
  );
}
