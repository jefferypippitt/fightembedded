import { StatItem } from "@/types/hero";

export const StatCard = ({ stat }: { stat: StatItem }) => (
  <div className="text-center">
    <div className="flex items-center justify-center">
      <span className="text-lg font-semibold tabular-nums tracking-tight sm:text-xl md:text-2xl lg:text-3xl">
        {stat.value}
      </span>
    </div>
    <span className="mt-0.5 block text-xs leading-tight text-primary sm:text-sm">
      {stat.label}
    </span>
  </div>
);
