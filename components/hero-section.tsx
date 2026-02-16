import { getLiveStats } from "@/server/actions/get-stats";
import { createStatsData } from "@/server/actions/create-stats-data";
import { StatsGrid } from "./stats-grid";
import HeroContent from "./hero-content";
import LiveUpdatesBadge from "./live-updates-badge";

export default async function HeroSection() {
  const stats = await getLiveStats();
  const statsData = createStatsData(stats);

  return (
    <section className="space-y-2 py-2 sm:py-4">
      <div className="flex flex-row items-center justify-between gap-4 md:gap-6 lg:gap-8">
        <HeroContent />
        <div className="w-auto flex flex-col items-center">
          <LiveUpdatesBadge />
          <div className="mt-3 md:mt-4">
            <StatsGrid statsData={statsData} />
          </div>
        </div>
      </div>
    </section>
  );
}
