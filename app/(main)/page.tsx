import { Metadata } from "next";
import HeroSection from "@/components/hero-section";
import ChampionsSection from "@/components/champions-section";
import EventsSection from "@/components/events-section";
import RankingsSection from "@/components/rankings-section";

export const metadata: Metadata = {
  title: "UFC Athletes & Events",
  description: "Explore UFC athletes stats, rankings, and more in one place.",
};

export default async function Page() {
  return (
    <main>
      <HeroSection />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-2 sm:gap-3 mt-8">
        <div className="lg:col-span-4 space-y-3 sm:space-y-4 lg:space-y-6 order-last lg:order-first overflow-hidden">
          <ChampionsSection />
          <EventsSection />
        </div>

        <div>
          <RankingsSection />
        </div>
      </div>
    </main>
  );
}
