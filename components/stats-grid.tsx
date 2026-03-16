import { StatCard } from "./stat-card";
import { StatItem } from "@/types/hero";
import { cn } from "@/lib/utils";

interface StatsGridProps {
  statsData: StatItem[];
  className?: string;
}

export const StatsGrid = ({ statsData, className }: StatsGridProps) => (
  <div
    className={cn(
      "grid grid-cols-2 gap-2 sm:gap-4 md:gap-6 w-[180px] sm:w-[200px] md:max-w-[320px]",
      className
    )}
  >
    {statsData.map((stat, index) => (
      <StatCard key={index} stat={stat} />
    ))}
  </div>
);
