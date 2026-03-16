import { StatItem } from "@/types/hero";

export const StatCard = ({ stat }: { stat: StatItem }) => (
  <div className="text-center">
    <div className="flex items-center justify-center">
      <span className="text-xl sm:text-xl md:text-3xl font-bold">
        {stat.value}
      </span>
    </div>
    <span className="text-xs sm:text-sm font-medium text-primary block">
      {stat.label}
    </span>
  </div>
);
