import React from "react";
import Link from "next/link";
import NumberTicker from "./ui/number-ticker";
import { getLiveStats } from "@/server/actions/get-stats";
import { Badge } from "@/components/ui/badge";
import { Dot } from "lucide-react";
import { ShinyButton } from "./magicui/shiny-button";
import { IconTrendingUp } from "@tabler/icons-react";

interface StatItem {
  value: number;
  label: string;
  icon?: React.ReactNode;
}

interface Stats {
  totalAthletes: number;
  activeAthletes: number;
  retiredAthletes: number;
  totalEvents: number;
}

const createStatsData = (stats: Stats): StatItem[] => [
  {
    value: stats.totalAthletes,
    label: "Total Athletes",
    icon: <IconTrendingUp className="h-4 w-4 text-green-500" />,
  },
  {
    value: stats.totalEvents,
    label: "Total Events",
    icon: <IconTrendingUp className="h-4 w-4 text-green-500" />,
  },
];

const StatCard = ({ stat }: { stat: StatItem }) => (
  <div className="text-center">
    <div className="flex items-center justify-center space-x-1 xs:space-x-2">
      <NumberTicker
        value={stat.value}
        className="text-lg xs:text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100 font-mono"
      />
      {stat.icon && stat.icon}
    </div>
    <span className="text-sm xs:text-sm font-medium text-muted-foreground">
      {stat.label}
    </span>
  </div>
);

const HeroContent = () => (
  <div className="flex flex-col items-start text-left space-y-3 md:space-y-4 w-full lg:flex-1">
    <div className="space-y-1 w-full">
      <h1 className="text-2xl xs:text-3xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-800 dark:text-gray-100 text-balance">
        Your Ultimate Source for
      </h1>
      <h1 className="text-2xl xs:text-3xl sm:text-3xl lg:text-4xl font-bold tracking-tight leading-tight text-red-500 dark:text-red-500 text-balance">
        UFC Athletes and Events
      </h1>
    </div>
    <div className="mt-1 mb-2 md:mt-2 md:mb-0">
      <Link href="/athletes">
        <ShinyButton className="text-sm sm:text-sm px-3 py-2 sm:px-4 sm:py-2">
          Explore All Athletes
        </ShinyButton>
      </Link>
    </div>
  </div>
);

const LiveUpdatesBadge = () => (
  <Badge
    variant="outline"
    className="bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-600/20 dark:border-zinc-500/30 text-xs mb-1 md:mb-2"
  >
    <Dot className="h-4 w-4 animate-pulse text-green-500 dark:text-green-400" />
    Live Updates
  </Badge>
);

const StatsGrid = ({ statsData }: { statsData: StatItem[] }) => (
  <div className="grid grid-cols-2 gap-3 xs:gap-4 sm:gap-6 w-full max-w-[260px] xs:max-w-[280px] sm:max-w-[320px]">
    {statsData.map((stat, index) => (
      <StatCard key={index} stat={stat} />
    ))}
  </div>
);

export default async function HeroSection() {
  const stats = await getLiveStats();
  const statsData = createStatsData(stats);

  return (
    <section>
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
