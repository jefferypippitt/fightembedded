import React from "react";
import NumberTicker from "./ui/number-ticker";

export default function HeroSection() {
  return (
    <div className="flex flex-col items-center text-center space-y-2 px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 w-full max-w-5xl mx-auto">
      {/* Main Heading */}
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight break-words">
        <span className="block pb-1">Your Ultimate Source for</span>
        <span className="block bg-clip-text text-transparent bg-red-500 leading-tight">
          UFC Fighter Stats
        </span>
      </h1>

      {/* Subheading */}
      <p className="max-w-md mx-auto text-xs sm:text-sm lg:text-base text-muted-foreground">
        Explore detailed profiles, fight statistics, and rankings of all UFC
        athletes in one place.
      </p>

      {/* Stats Section */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mt-4 sm:mt-6 w-full max-w-xl">
        <div className="flex flex-col items-center p-1 sm:p-2">
          <span className="text-base sm:text-lg lg:text-xl font-bold text-red-500">
            <NumberTicker value={170} className="text-base sm:text-lg lg:text-xl font-bold" />+
          </span>
          <span className="text-xs sm:text-sm text-muted-foreground">Active Fighters</span>
        </div>
        <div className="flex flex-col items-center p-1 sm:p-2">
          <span className="text-base sm:text-lg lg:text-xl font-bold text-red-500">
            <NumberTicker value={11} className="text-base sm:text-lg lg:text-xl font-bold" />
          </span>
          <span className="text-xs sm:text-sm text-muted-foreground">Weight Classes</span>
        </div>
        <div className="flex flex-col items-center p-1 sm:p-2">
          <span className="text-base sm:text-lg lg:text-xl font-bold text-red-500">
            <NumberTicker value={11} className="text-base sm:text-lg lg:text-xl font-bold" />
          </span>
          <span className="text-xs sm:text-sm text-muted-foreground">Champions</span>
        </div>
        <div className="flex flex-col items-center p-1 sm:p-2">
        <span className="text-base sm:text-lg lg:text-xl font-bold text-red-500">
            <NumberTicker value={200} className="text-base sm:text-lg lg:text-xl font-bold" />+
          </span>
          <span className="text-xs sm:text-sm text-muted-foreground">Events</span>
        </div>
      </div>
    </div>
  );
};
