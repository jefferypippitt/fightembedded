import React from "react";
import Link from "next/link";
import NumberTicker from "./ui/number-ticker";
import { getStats } from "@/server/actions/get-stats";
import { Badge } from "@/components/ui/badge";
import { Dot, Trophy, Users, Weight, Calendar } from "lucide-react";
import { ShinyButton } from "@/components/magicui/shiny-button";

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
  <div className="group relative overflow-hidden rounded-lg bg-white dark:bg-neutral-950 p-2.5 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 border border-red-600/10 dark:border-red-600/10 hover:border-red-600/30 dark:hover:border-red-600/30">
    <div className="absolute inset-0 bg-gradient-to-br from-red-600/0 to-red-600/0 group-hover:from-red-600/5 group-hover:to-red-600/10 transition-all duration-300" />
    <div className="relative flex flex-col items-center space-y-1.5">
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 shadow-md group-hover:shadow-red-500/20 transition-all duration-300">
        {stat.icon}
      </div>
      <div className="flex items-center space-x-0.5">
        <NumberTicker
          value={stat.value}
          className="text-lg font-bold"
        />
        {stat.suffix && (
          <span className="text-lg font-bold text-red-600">
            {stat.suffix}
          </span>
        )}
      </div>
      <span className="text-xs font-medium text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors duration-300">
        {stat.label}
      </span>
    </div>
  </div>
)

const HeroContent = () => (
  <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-2 lg:space-y-3 flex-1">
    <div className="space-y-1">
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-gray-800 dark:text-gray-100">
          Your Ultimate Source for
        </h1>
      </div>
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight text-red-500 dark:text-red-500">
          UFC Fighter Stats
        </h1>
      </div>
    </div>
    <div>
      <p className="text-sm sm:text-base font-medium max-w-md lg:max-w-none">
        Dive into comprehensive profiles, detailed performance stats, and current
        rankings for every UFC athlete.
      </p>
    </div>
    <div>
      <Link href="/athletes">
        <ShinyButton>Explore All Athletes</ShinyButton>
      </Link>
    </div>
  </div>
)

const StatsGrid = ({ statsData }: { statsData: StatItem[] }) => (
  <div className="flex flex-col items-center gap-2 w-full lg:w-auto lg:max-w-md">
    <Badge
      variant="outline"
      className="bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-600/20 dark:border-zinc-500/30"
    >
      <Dot className="h-4 w-4 animate-pulse text-green-500 dark:text-green-400" />
      Live Updates
    </Badge>
    <div className="grid grid-cols-2 gap-2 w-full">
      {statsData.map((stat, index) => (
        <StatCard key={index} stat={stat} />
      ))}
    </div>
  </div>
)

export default async function HeroSection() {
  const stats = await getStats();
  const statsData = createStatsData(stats);

  return (
    <div className="w-full pb-4 sm:pb-6">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-2 lg:gap-3">
        <HeroContent />
        <StatsGrid statsData={statsData} />
      </div>
    </div>
  );
}