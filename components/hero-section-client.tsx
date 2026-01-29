"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Dot } from "lucide-react";
import { ShinyButton } from "@/components/magicui/shiny-button";
import { NumberTicker } from "@/components/ui/number-ticker";

interface StatItem {
  value: number;
  label: string;
}

interface HeroSectionClientProps {
  statsData: StatItem[];
}

const StatCard = ({ stat, index }: { stat: StatItem; index: number }) => (
  <div className="text-center">
    < div className="flex items-center justify-center">
      <NumberTicker
        value={stat.value}
        delay={0.3}
        className="text-lg xs:text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100"
      />
    </div>
    <span className="text-sm xs:text-sm font-medium text-primary block mt-1">
      {stat.label}
    </span >
  </div >
);

const HeroContent = () => (
  <div className="flex flex-col items-start text-left space-y-3 md:space-y-4 w-full lg:flex-1">
    < div className="space-y-1 w-full">
      < h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900 dark:text-white text-balance">
        Your Ultimate Source For
      </h1 >
      <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight leading-tight text-red-500 dark:text-red-500 text-balance">
        UFC Athletes & Events
      </h1 >
    </div >
    <div className="mt-1 mb-2 md:mt-2 md:mb-0">
      < Link href="/athletes">
        < ShinyButton className="text-sm sm:text-sm px-3 py-2 sm:px-4 sm:py-2">
          Explore All Athletes
        </ShinyButton >
      </Link >
    </div >
  </div >
);

const LiveUpdatesBadge = () => (
  <div>
    <Badge
      variant="outline"
      className="bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-600/20 dark:border-zinc-500/30 text-xs mb-1 md:mb-2"
    >
      <Dot className="h-4 w-4 animate-pulse text-green-500 dark:text-green-400" />
      Live Updates
    </Badge>
  </div >
);

const StatsGrid = ({ statsData }: { statsData: StatItem[] }) => (
  <div className="grid grid-cols-2 gap-3 xs:gap-4 sm:gap-6 w-full max-w-[260px] xs:max-w-[280px] sm:max-w-[320px]">
    {
      statsData.map((stat, index) => (
        <StatCard key={index} stat={stat} index={index} />
      ))
    }
  </div >
);

export default function HeroSectionClient({ statsData }: HeroSectionClientProps) {
  return (
    <div className="flex flex-row items-center justify-between gap-4 md:gap-6 lg:gap-8">
      <HeroContent />
      <div className="w-auto flex flex-col items-center">
        <LiveUpdatesBadge />
        <div className="mt-3 md:mt-4">
          <StatsGrid statsData={statsData} />
        </div >
      </div >
    </div >
  );
}
