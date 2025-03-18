import React from "react";
import Link from "next/link";
import NumberTicker from "./ui/number-ticker";
import { getStats } from "@/server/actions/get-stats";
import { Badge } from "@/components/ui/badge";
import { Dot, Trophy, Users, Weight, Calendar } from "lucide-react";
import { ShinyButton } from "@/components/magicui/shiny-button";

export default async function HeroSection() {
  const stats = await getStats();

  const statsData = [
    { 
      value: stats.activeAthletes, 
      label: "UFC Athletes", 
      suffix: "+",
      icon: <Users className="h-3.5 w-3.5" />
    },
    { 
      value: stats.weightClasses, 
      label: "Weight Classes",
      icon: <Weight className="h-3.5 w-3.5" />
    },
    { 
      value: stats.champions, 
      label: "Champions",
      icon: <Trophy className="h-3.5 w-3.5" />
    },
    { 
      value: stats.events, 
      label: "Events", 
      suffix: "+",
      icon: <Calendar className="h-3.5 w-3.5" />
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
        {/* Left Column - Main Content */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-3 lg:space-y-4 flex-1">
          {/* Main Heading */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
            <span className="block pb-0.5 text-gray-800 dark:text-gray-100">
              Your Ultimate Source for
            </span>
            <span className="block leading-tight text-red-500 dark:text-red-500">
              UFC Fighter Stats
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-sm sm:text-base font-medium text-gray-600 dark:text-gray-400 max-w-md lg:max-w-none">
            Explore detailed profiles, fight statistics, and rankings of all UFC
            athletes in one place.
          </p>

          {/* Explore All Athletes Button */}
          <Link href="/athletes">
            <ShinyButton>
              Explore All Athletes
            </ShinyButton>
          </Link>
        </div>

        {/* Right Column - Stats Grid */}
        <div className="flex flex-col items-center gap-3 w-full lg:w-auto lg:max-w-md">
          {/* Live Stats Badge */}
          <Badge
            variant="outline"
            className="bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-600/20 dark:border-zinc-500/30"
          >
            <Dot className="h-5 w-5 animate-pulse text-green-500 dark:text-green-400" />
            Live Updates
          </Badge>

          <div className="grid grid-cols-2 gap-3 w-full">
            {statsData.map((stat, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-lg bg-white dark:bg-neutral-950 p-3.5 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 border border-red-600/10 dark:border-red-600/10 hover:border-red-600/30 dark:hover:border-red-600/30"
              >
                {/* Background gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/0 to-red-600/0 group-hover:from-red-600/5 group-hover:to-red-600/10 transition-all duration-300" />
                
                <div className="relative flex flex-col items-center space-y-2">
                  {/* Icon with glow effect */}
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 shadow-md group-hover:shadow-red-500/20 transition-all duration-300">
                    {stat.icon}
                  </div>
                  
                  {/* Value with larger text */}
                  <div className="flex items-center space-x-0.5">
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
                  
                  {/* Label with subtle animation */}
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors duration-300">
                    {stat.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
