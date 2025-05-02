import React from "react";
import Link from "next/link";
import NumberTicker from "./ui/number-ticker";
import { getStats } from "@/server/actions/get-stats";
import { Badge } from "@/components/ui/badge";
import { Dot, Trophy, Users, Weight, Calendar } from "lucide-react";
import { ShinyButton } from "./magicui/shiny-button";


interface StatItem {
  value: number;
  label: string;
  suffix?: string;
  icon: React.ReactNode;
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
    suffix: "+",
    icon: <Users className="h-3.5 w-3.5" />,
  },
  {
    value: stats.weightClasses,
    label: "Weight Classes",
    icon: <Weight className="h-3.5 w-3.5" />,
  },
  {
    value: stats.champions,
    label: "Champions",
    icon: <Trophy className="h-3.5 w-3.5" />,
  },
  {
    value: stats.events,
    label: "Events",
    suffix: "+",
    icon: <Calendar className="h-3.5 w-3.5" />,
  },
];

const StatCard = ({ stat }: { stat: StatItem }) => (
  <div className="relative rounded-lg bg-white dark:bg-neutral-950 p-1.5 sm:p-2.5 shadow-md border border-red-600/10 dark:border-red-600/10">
    <div className="flex flex-col items-center space-y-1">
      <div className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 shadow-md">
        {stat.icon}
      </div>
      <div className="flex items-center space-x-0.5">
        <NumberTicker value={stat.value} className="text-base sm:text-lg font-bold" />
        {stat.suffix && (
          <span className="text-base sm:text-lg font-bold text-red-600">{stat.suffix}</span>
        )}
      </div>
      <span className="text-[10px] sm:text-xs font-medium text-gray-600 dark:text-gray-400">
        {stat.label}
      </span>
    </div>
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
  <div className="grid grid-cols-4 md:grid-cols-2 gap-1.5 sm:gap-2 w-full max-w-screen-sm md:max-w-xs lg:max-w-md">
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
