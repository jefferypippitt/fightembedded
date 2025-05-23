import { Suspense } from "react";
import { P4PSidebarSkeleton } from "@/components/p4p-sidebar-skeleton";
import { ChampionsSection } from "@/components/champions-section";
import { ChampionsSkeleton } from "@/components/champions-section-skeleton";
import { EventMarqueeSkeleton } from "@/components/event-marquee-skeleton";
import { getChampions } from "@/server/actions/get-champion";
import { getUpcomingEvents } from "@/server/actions/get-event";
import { EventMarqueeSection } from "@/components/event-marquee";
import HeroSection from "@/components/hero-section";
import { Metadata } from "next";
import { P4PRankings } from "@/components/p4p-rankings";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Your Ultimate Source for UFC Fighter Stats. Explore detailed profiles, fight statistics, and rankings of all UFC athletes in one place",
};

export default async function Home() {
  const { maleChampions, femaleChampions } = await getChampions();
  const events = await getUpcomingEvents();

  return (
    <div>
      <HeroSection />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-2 sm:gap-3">
        <div className="lg:col-span-4 space-y-3 sm:space-y-4 lg:space-y-6 order-last lg:order-first overflow-hidden">
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

        <aside className="lg:col-span-1 overflow-hidden">
          <Suspense fallback={<P4PSidebarSkeleton />}>
            <P4PRankings />
          </Suspense>
        </aside>
      </div>
    </div>
  );
}
