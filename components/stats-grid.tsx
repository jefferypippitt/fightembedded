import { StatCard } from "./stat-card";
import { StatItem } from "@/types/hero";

export const StatsGrid = ({ statsData }: { statsData: StatItem[] }) => (
  <div className="grid grid-cols-2 gap-3 xs:gap-4 sm:gap-6 w-full max-w-[260px] xs:max-w-[280px] sm:max-w-[320px]">
    {statsData.map((stat, index) => (
      <StatCard key={index} stat={stat} />
    ))}
  </div>
);
