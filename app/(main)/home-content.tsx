import { ChampionsSection } from "@/components/champions-section";
import { EventMarqueeSection } from "@/components/event-marquee";
import { P4PRankings } from "@/components/p4p-rankings";
import type { Athlete } from "@prisma/client";
import type { Event } from "@/types/event";
import HeroSection from "@/components/hero-section";

interface HomeContentProps {
  maleChampions: Athlete[];
  femaleChampions: Athlete[];
  events: Event[];
  maleP4PRankings: Athlete[];
  femaleP4PRankings: Athlete[];
}


async function HomeData({ 
  maleChampions, 
  femaleChampions, 
  events
}: Pick<HomeContentProps, "maleChampions" | "femaleChampions" | "events">) {
  return (
    <>
      <ChampionsSection
        maleChampions={maleChampions}
        femaleChampions={femaleChampions}
      />

      <EventMarqueeSection events={events} />
    </>
  );
}

export function HomeContent(props: HomeContentProps) {
  return (
    <div>
      <HeroSection />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-2 sm:gap-3">
        <div className="lg:col-span-4 space-y-3 sm:space-y-4 lg:space-y-6 order-last lg:order-first overflow-hidden">
          <HomeData {...props} />
        </div>

        <aside className="lg:col-span-1 overflow-hidden">
          <P4PRankings
            maleP4PRankings={props.maleP4PRankings}
            femaleP4PRankings={props.femaleP4PRankings}
          />
        </aside>
      </div>
    </div>
  );
} 