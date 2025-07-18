import React from "react";
import Link from "next/link";
import NumberTicker from "./ui/number-ticker";
import { getStats } from "@/server/actions/get-stats";
import { Badge } from "@/components/ui/badge";
import { Loader } from "lucide-react";
import { ShinyButton } from "./magicui/shiny-button";
import { IconTrendingUp } from "@tabler/icons-react";

interface StatItem {
  value: number;
  label: string;
  icon?: React.ReactNode;
}

interface Stats {
  activeAthletes: number;
  weightClasses: number;
  champions: number;
  events: number;
}

const createStatsData = (stats: Stats): StatItem[] => [
  {
    value: stats.activeAthletes,
    label: "UFC Athletes",
    icon: <IconTrendingUp className="h-4 w-4 text-green-500" />,
  },
  {
    value: stats.events,
    label: "Events",
    icon: <IconTrendingUp className="h-4 w-4 text-green-500" />,
  },
];

const StatCard = ({ stat }: { stat: StatItem }) => (
  <div className="text-center">
    <div className="flex items-center justify-center space-x-1 xs:space-x-2">
      <NumberTicker
        value={stat.value}
        className="text-base xs:text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100 font-mono"
      />
      {stat.icon && stat.icon}
    </div>
    <span className="text-xs xs:text-sm sm:text-base font-medium text-gray-600 dark:text-gray-400">
      {stat.label}
    </span>
  </div>
);

const HeroContent = () => (
  <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-3 md:space-y-4 w-full lg:flex-1">
    <div className="space-y-1 w-full">
      <h1 className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-800 dark:text-gray-100 text-balance">
        Your Ultimate Source for
      </h1>
      <h1 className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight leading-tight text-red-500 dark:text-red-500 text-balance">
        UFC Athletes and Events
      </h1>
    </div>
    <div className="mt-1 mb-2 md:mt-2 md:mb-0">
      <Link href="/athletes">
        <ShinyButton>Explore All Athletes</ShinyButton>
      </Link>
    </div>
  </div>
);

const LiveUpdatesBadge = () => (
  <Badge
    variant="outline"
    className="bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-600/20 dark:border-zinc-500/30 text-xs mb-1 md:mb-2"
  >
    <Loader className="h-4 w-4 animate-spin-slow text-green-500 dark:text-green-400" />
    Live Updates
  </Badge>
);

const StatsGrid = ({ statsData }: { statsData: StatItem[] }) => (
  <div className="grid grid-cols-2 gap-2 xs:gap-4 sm:gap-6 w-full max-w-[280px] xs:max-w-[320px]">
    {statsData.map((stat, index) => (
      <StatCard key={index} stat={stat} />
    ))}
  </div>
);

export default async function HeroSection() {
  const stats = await getStats();
  const statsData = createStatsData(stats);

  return (
    <section>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
        <HeroContent />
        <div className="w-full md:w-auto flex flex-col items-center">
          <LiveUpdatesBadge />
          <div className="mt-3 md:mt-4">
            <StatsGrid statsData={statsData} />
          </div>
        </div>
      </div>
    </section>
  );
}
