import { NumberTicker } from "@/components/ui/number-ticker";
import { StatItem } from "@/types/hero";

export const StatCard = ({ stat }: { stat: StatItem }) => (
  <div className="text-center">
    <div className="flex items-center justify-center">
      <NumberTicker
        value={stat.value}
        delay={0.3}
        className="text-lg xs:text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100"
      />
    </div>
    <span className="text-sm xs:text-sm font-medium text-primary block mt-1">
      {stat.label}
    </span>
  </div>
);
