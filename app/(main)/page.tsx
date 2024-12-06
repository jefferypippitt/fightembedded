import { Suspense } from "react";

import { P4PSidebar } from "@/components/p4p-sidebar";
import { ChampionsSection } from "@/components/champions-section";
import { ChampionsSkeleton } from "@/components/champions-section-skeleton";
import { EventsSection } from "@/components/events-section";
import { EventsSectionSkeleton } from "@/components/events-section-skeleton";

import { getChampions } from "@/server/actions/get-champion";
import { getUpcomingEvents } from "@/server/actions/get-event";

export default async function Home() {
  const { maleChampions, femaleChampions } = await getChampions();
  const events = await getUpcomingEvents();

  return (
    <div className="space-y-4">
      <h1 className="text-xl sm:text-2xl font-bold text-center">
        UFC Champions
      </h1>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-4 space-y-8">
          <Suspense fallback={<ChampionsSkeleton />}>
            <ChampionsSection
              maleChampions={maleChampions}
              femaleChampions={femaleChampions}
            />
          </Suspense>

          <Suspense fallback={<EventsSectionSkeleton />}>
            <EventsSection events={events} />
          </Suspense>
        </div>

        <aside className="lg:col-span-1">
          <P4PSidebar />
        </aside>
      </div>
    </div>
  );
}
