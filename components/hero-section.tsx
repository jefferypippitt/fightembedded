import React from "react";
import NumberTicker from "./ui/number-ticker";
import { cn } from "@/lib/utils";

export default function HeroSection() {
  return (
    <div className="flex flex-col items-center text-center space-y-2 px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 w-full max-w-5xl mx-auto">
      {/* Main Heading */}
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight break-words">
        <span className="block pb-1 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
          Your Ultimate Source for
        </span>
        <span className="block leading-tight bg-gradient-to-r from-red-600 via-red-500 to-red-600 dark:from-red-400 dark:via-red-500 dark:to-red-400 bg-clip-text text-transparent">
          UFC Fighter Stats
        </span>
      </h1>

      {/* Subheading */}
      <p className="max-w-md mx-auto text-xs sm:text-sm lg:text-base font-medium bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600 dark:from-gray-300 dark:via-gray-200 dark:to-gray-300 bg-clip-text text-transparent">
        Explore detailed profiles, fight statistics, and rankings of all UFC
        athletes in one place.
      </p>

      {/* Stats Section */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 w-full max-w-xl">
        {[
          { value: 170, label: "Active Fighters", suffix: "+" },
          { value: 11, label: "Weight Classes" },
          { value: 11, label: "Champions" },
          { value: 200, label: "Events", suffix: "+" },
        ].map((stat, index) => (
          <div key={index} className="group relative h-20">
            <div
              className={cn(
                "absolute inset-0 rounded-lg",
                "h-full group relative overflow-hidden transition-all duration-300",
                "border border-red-600/20 dark:border-red-500/30",
                "bg-gradient-to-br from-white via-gray-50 to-gray-100",
                "dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900",
                "before:absolute before:inset-0 before:bg-gradient-to-r",
                "before:from-red-600/0 before:via-red-600/5 before:to-red-600/0",
                "dark:before:from-red-500/0 dark:before:via-red-500/20 dark:before:to-red-500/0",
                "hover:before:opacity-100 before:transition-opacity",
                "after:absolute after:inset-0 after:bg-gradient-to-t",
                "after:from-black/5 after:to-transparent",
                "dark:after:from-black/40 dark:after:to-transparent"
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
                <span className="text-xs text-gray-600 dark:text-gray-300">
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
