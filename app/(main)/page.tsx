import { Metadata } from "next";
import HeroSectionWrapper from "@/components/hero-section-wrapper";
import ChampionsSectionWrapper from "@/components/champions-section-wrapper";
import EventsSectionWrapper from "@/components/events-section";
import RankingsSectionWrapper from "@/components/rankings-section";

// Static rendering with 1-week caching - following Next.js best practices
export const dynamic = "force-static";
export const revalidate = 604800; // 1 week

export const metadata: Metadata = {
  title: "FightEmbedded - UFC Fighter Database & Rankings",
  description:
    "Comprehensive UFC fighter database with rankings, statistics, and real-time updates. Explore fighters, divisions, and championship history.",
};

export default async function Page() {
  return (
    <main>
      <HeroSectionWrapper />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-2 sm:gap-3 mt-8">
        <div className="lg:col-span-4 space-y-3 sm:space-y-4 lg:space-y-6 order-last lg:order-first overflow-hidden">
          <ChampionsSectionWrapper />
          <EventsSectionWrapper />
        </div>

        <div className="lg:col-span-1 overflow-hidden">
          <RankingsSectionWrapper />
        </div>
      </div>
    </main>
  );
}
