import { getLiveStats } from "@/server/actions/get-stats";
import { createStatsData } from "@/server/actions/create-stats-data";
import { StatsGrid } from "./stats-grid";
import HeroContent from "./hero-content";
import LiveUpdatesBadge from "./live-updates-badge";

interface HeroSectionProps {
  stats?: Awaited<ReturnType<typeof getLiveStats>>;
}

export default async function HeroSection({ stats: providedStats }: HeroSectionProps = {}) {
  const stats = providedStats ?? (await getLiveStats());
  const statsData = createStatsData(stats);

  return (
    <section className="flex flex-row items-center justify-between gap-4 py-3 sm:py-4 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
      <HeroContent />
      <div className="flex flex-col items-center gap-2 lg:gap-3">
        <LiveUpdatesBadge />
        <StatsGrid statsData={statsData} className="lg:w-auto" />
      </div>
    </section>
  );
}
