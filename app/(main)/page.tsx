import { Suspense } from "react";

import { P4PSidebar } from "@/components/p4p-sidebar";
import { ChampionsSection } from "@/components/champions-section";
import { ChampionsSkeleton } from "@/components/champions-section-skeleton";
import { EventMarqueeSkeleton } from "@/components/event-marquee-skeleton";
import { getChampions } from "@/server/actions/get-champion";
import { getUpcomingEvents } from "@/server/actions/get-event";
import { EventMarqueeSection } from "@/components/event-marquee";
import HeroSection from "@/components/hero-section";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
};

export default async function Home() {
  const { maleChampions, femaleChampions } = await getChampions();
  const events = await getUpcomingEvents();

  return (
    <div className="flex flex-col w-full gap-4 sm:gap-6">
      <HeroSection />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6 min-h-[800px]">
        <div className="lg:col-span-4 space-y-4 sm:space-y-6 lg:space-y-8 order-last lg:order-first">
          <Suspense fallback={<ChampionsSkeleton />}>
            <ChampionsSection
              maleChampions={maleChampions}
              femaleChampions={femaleChampions}
            />
          </Suspense>

          <Suspense fallback={<EventMarqueeSkeleton />}>
            <EventMarqueeSection events={events} />
          </Suspense>
        </div>

        <aside className="lg:col-span-1 h-full">
          <P4PSidebar />
        </aside>
      </div>
    </div>
  );
}
