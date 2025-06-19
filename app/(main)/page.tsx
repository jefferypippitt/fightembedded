import { Metadata } from "next";
import HeroSectionWrapper from "@/components/hero-section-wrapper";
import ChampionsSectionWrapper from "@/components/champions-section-wrapper";
import EventsSectionWrapper from "@/components/events-section";
import RankingsSectionWrapper from "@/components/rankings-section";

// Static rendering with 1-week caching
export const dynamic = 'force-static'
export const revalidate = 604800 // Cache for 1 week

export const metadata: Metadata = {
  title: "Home",
  description:
    "Your Ultimate Source for UFC Fighter Stats. Explore detailed profiles, fight statistics, and rankings of all UFC athletes in one place",
};

export default async function Page() {
  const [heroSection, championsSection, eventsSection, rankingsSection] = await Promise.all([
    <HeroSectionWrapper key="hero" />,
    <ChampionsSectionWrapper key="champions" />,
    <EventsSectionWrapper key="events" />,
    <RankingsSectionWrapper key="rankings" />
  ]);

  return (
    <main>
      {heroSection}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-2 sm:gap-3 mt-8">
        <div className="lg:col-span-4 space-y-3 sm:space-y-4 lg:space-y-6 order-last lg:order-first overflow-hidden">
          {championsSection}
          {eventsSection}
        </div>

        <div className="lg:col-span-1 overflow-hidden">
          {rankingsSection}
        </div>
      </div>
    </main>
  );
}
