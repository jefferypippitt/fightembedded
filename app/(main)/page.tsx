import { Metadata } from "next";
import HeroSectionWrapper from "@/components/hero-section-wrapper";
import ChampionsSectionWrapper from "@/components/champions-section-wrapper";
import EventsSectionWrapper from "@/components/events-section";
import RankingsSectionWrapper from "@/components/rankings-section";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Your Ultimate Source for UFC Fighter Stats. Explore detailed profiles, fight statistics, and rankings of all UFC athletes in one place",
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
