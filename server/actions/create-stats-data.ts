import { Stats, StatItem } from "@/types/hero";

export const createStatsData = (stats: Stats): StatItem[] => [
  {
    value: stats.totalAthletes,
    label: "Total Athletes",
  },
  {
    value: stats.totalEvents,
    label: "Total Events",
  },
];
