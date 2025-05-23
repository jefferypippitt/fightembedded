import React from "react";
import Link from "next/link";
import NumberTicker from "./ui/number-ticker";
import { getStats } from "@/server/actions/get-stats";
import { Badge } from "@/components/ui/badge";
import { Dot, TrendingUp } from "lucide-react";
import { ShinyButton } from "./magicui/shiny-button";


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
    icon: <TrendingUp className="h-4 w-4 text-green-600" />,
  },
  {
    value: stats.weightClasses,
    label: "Weight Classes",
  },
  {
    value: stats.champions,
    label: "Champions",
  },
  {
    value: stats.events,
    label: "Events",
    icon: <TrendingUp className="h-4 w-4 text-green-600" />,
  },
];

const StatCard = ({ stat }: { stat: StatItem }) => (
  <div className="text-center">
    <div className="flex items-center justify-center space-x-1">
      <NumberTicker value={stat.value} className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100" />
      {stat.icon && stat.icon}
    </div>
    <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
      {stat.label}
    </span>
  </div>
);

const HeroContent = () => (
  <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-3 md:space-y-4 w-full lg:flex-1">
    <div className="space-y-1 w-full">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-gray-800 dark:text-gray-100">
        Your Ultimate Source for
      </h1>
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight text-red-500 dark:text-red-500">
        UFC Fighter Stats
      </h1>
    </div>
    <p className="text-sm sm:text-base font-medium max-w-md">
      Dive into comprehensive profiles, detailed performance stats, and
      current rankings for every UFC athlete.
    </p>
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
    <Dot className="h-3 w-3 sm:h-4 sm:w-4 animate-pulse text-green-500 dark:text-green-400" />
    Live Updates
  </Badge>
);

const StatsGrid = ({ statsData }: { statsData: StatItem[] }) => (
  <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full max-w-[280px]">
    {statsData.map((stat, index) => (
      <StatCard key={index} stat={stat} />
    ))}
  </div>
);

export default async function HeroSection() {
  const stats = await getStats();
  const statsData = createStatsData(stats);

  return (
    <section className="w-full pb-4 sm:pb-6 px-3 sm:px-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
        <HeroContent />
        
        <div className="w-full md:w-auto flex flex-col items-center">
          <LiveUpdatesBadge />
          <StatsGrid statsData={statsData} />
        </div>
      </div>
    </section>
  );
}
