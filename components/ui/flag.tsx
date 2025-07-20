"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface FlagProps {
  countryCode: string;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  xs: "h-10 w-10 md:h-12 md:w-12",
  sm: "h-12 w-12 md:h-16 md:w-16",
  md: "h-20 w-20 md:h-24 md:w-24",
  lg: "h-24 w-24 md:h-32 md:w-32",
};

export function Flag({ countryCode, size = "md", className = "" }: FlagProps) {
  const [error, setError] = useState(false);

  // Validate country code
  const validCountryCode =
    countryCode && countryCode.length >= 2 && countryCode.length <= 10
      ? countryCode.toLowerCase()
      : null;

  if (!validCountryCode) return null;

  const primarySrc = `https://flagcdn.com/${validCountryCode}.svg`;
  const fallbackSrc = `https://countryflags.io/${validCountryCode}/flat/64.png`;

  return (
    <img
      src={error ? fallbackSrc : primarySrc}
      alt={`${validCountryCode} flag`}
      className={cn(sizeMap[size], "rounded-full object-cover", className)}
      onError={() => setError(true)}
    />
  );
}
