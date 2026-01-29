import { getLiveStats } from "@/server/actions/get-stats";
import HeroSectionClient from "./hero-section-client";

interface Stats {
  totalAthletes: number;
  activeAthletes: number;
  retiredAthletes: number;
  totalEvents: number;
}

interface StatItem {
  value: number;
  label: string;
}

const createStatsData = (stats: Stats): StatItem[] => [
  {
    value: stats.totalAthletes,
    label: "Total Athletes",
  },
  {
    value: stats.totalEvents,
    label: "Total Events",
  },
];

export default async function HeroSection() {
  const stats = await getLiveStats();
  const statsData = createStatsData(stats);

  return (
    <section className="space-y-2 py-2 sm:py-4">
      <HeroSectionClient statsData={statsData} />
    </section>
  );
}
