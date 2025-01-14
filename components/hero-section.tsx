import React from "react";
import Link from "next/link";
import NumberTicker from "./ui/number-ticker";
import { cn } from "@/lib/utils";
import { getStats } from "@/server/actions/get-stats";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Dot } from "lucide-react";

export default async function HeroSection() {
  const stats = await getStats();

  const statsData = [
    { value: stats.activeAthletes, label: "UFC Athletes", suffix: "+" },
    { value: stats.weightClasses, label: "Weight Classes" },
    { value: stats.champions, label: "Champions" },
    { value: stats.events, label: "Events", suffix: "+" },
  ];

  return (
    <div className="flex flex-col items-center text-center space-y-3 px-3 sm:px-4 lg:px-6 pt-0.5 pb-1 sm:pt-1 sm:pb-2 w-full max-w-5xl mx-auto">
      {/* Live Stats Badge */}
      <Badge
        variant="outline"
        className="bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-600/20 dark:border-zinc-500/30"
      >
        <Dot className="h-4 w-4 animate-pulse text-green-500 dark:text-green-400" />
        Updated Weekly
      </Badge>

      {/* Main Heading */}
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight break-words mt-1">
        <span className="block pb-1 text-gray-800 dark:text-gray-100">
          Your Ultimate Source for
        </span>
        <span className="block leading-tight text-red-600 dark:text-red-400">
          UFC Fighter Stats
        </span>
      </h1>

      {/* Subheading */}
      <p className="max-w-md mx-auto text-xs sm:text-sm lg:text-base font-medium text-gray-600 dark:text-gray-400 mt-1">
        Explore detailed profiles, fight statistics, and rankings of all UFC
        athletes in one place.
      </p>

      {/* Explore All Athletes Button */}
      <Link
        href="/athletes"
        className="group relative inline-flex items-center justify-center px-4 py-1.5 mt-4 text-xs font-semibold text-white bg-red-600 rounded-lg overflow-hidden transition-all duration-300 ease-out hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-gray-900"
      >
        Explore All Athletes
        <ChevronRight className="ml-1.5 h-3 w-3 transform transition-transform group-hover:translate-x-1" />
        <span className="absolute inset-0 h-[200%] w-[200%] rotate-45 translate-x-[-70%] transition-all group-hover:scale-100 bg-white/30 group-hover:translate-x-[50%] z-20 duration-1000 ease-out"></span>
      </Link>

      {/* Stats Section */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 w-full max-w-xl">
        {statsData.map((stat, index) => (
          <div key={index} className="relative h-20">
            <div
              className={cn(
                "absolute inset-0 rounded-lg",
                "h-full relative overflow-hidden",
                "border border-red-600/20 dark:border-red-600/20",
                "bg-white dark:bg-zinc-950",
                "hover:bg-gray-50 dark:hover:bg-black"
              )}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-1 rounded-lg">
              <div className="flex items-center justify-center h-6">
                <NumberTicker
                  value={stat.value}
                  className="text-lg font-bold text-red-600 dark:text-red-400"
                />
                {stat.suffix && (
                  <span className="text-lg font-bold text-red-600 dark:text-red-400">
                    {stat.suffix}
                  </span>
                )}
              </div>
              <div className="h-4 flex items-center justify-center">
                <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">
                  {stat.label}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
