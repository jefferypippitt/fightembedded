"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useState, useCallback } from "react";

interface AthleteAvatarProps {
  imageUrl?: string;
  countryCode?: string;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
  priority?: boolean;
}

const sizeMap = {
  xs: "h-12 w-12",
  sm: "h-14 w-14",
  md: "h-16 w-16",
  lg: "h-28 w-28",
};

const imageSizes = {
  xs: "96px", // 48px * 2 for device pixel ratio
  sm: "112px", // 56px * 2 for device pixel ratio
  md: "128px", // 64px * 2 for device pixel ratio
  lg: "224px", // 112px * 2 for device pixel ratio
};

// Minimal placeholder for instant initial render
const PLACEHOLDER_BLUR =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYwIiBoZWlnaHQ9IjE2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMWExYTFhIi8+PC9zdmc+";

export function AthleteAvatar({
  imageUrl,
  countryCode,
  size = "md",
  className,
  priority = false,
}: AthleteAvatarProps) {
  const sizeValue = imageSizes[size];

  // Track image loading states for synchronized reveal
  const [flagLoaded, setFlagLoaded] = useState(false);
  const [athleteLoaded, setAthleteLoaded] = useState(false);

  // Validate country code
  const validCountryCode =
    countryCode && countryCode.length >= 2 && countryCode.length <= 10
      ? countryCode.toLowerCase()
      : null;

  // Both images must load before revealing (or no flag means just athlete)
  const imagesReady = validCountryCode
    ? flagLoaded && athleteLoaded
    : athleteLoaded;

  const handleFlagLoad = useCallback(() => setFlagLoaded(true), []);
  const handleAthleteLoad = useCallback(() => setAthleteLoaded(true), []);

  const flagSrc = `https://flagcdn.com/${validCountryCode}.svg`;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-sm",
        sizeMap[size],
        className
      )}
    >
      {/* Placeholder skeleton while loading */}
      <div
        className={cn(
          "absolute inset-0 bg-muted/40 transition-opacity duration-300 z-0",
          imagesReady ? "opacity-0" : "opacity-100"
        )}
      />

      {/* Flag Background */}
      {validCountryCode && (
        <div className="absolute inset-0 z-0">
          <Image
            src={flagSrc}
            alt={`${validCountryCode} flag`}
            fill
            className={cn(
              "object-cover transition-opacity duration-300",
              imagesReady ? "opacity-80" : "opacity-0"
            )}
            priority={priority}
            quality={90}
            sizes={sizeValue}
            unoptimized={true}
            onLoad={handleFlagLoad}
          />
        </div>
      )}

      {/* Athlete Image */}
      <div className="absolute inset-0 z-10">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt="Profile"
            fill
            className={cn(
              "object-cover transition-opacity duration-300",
              imagesReady ? "opacity-100" : "opacity-0"
            )}
            priority={priority}
            quality={90}
            sizes={sizeValue}
            placeholder="blur"
            blurDataURL={PLACEHOLDER_BLUR}
            onLoad={handleAthleteLoad}
          />
        ) : (
          <div className="h-full w-full bg-muted/20 flex items-center justify-center">
            <Image
              src="/placeholder/SILHOUETTE.avif"
              alt="Profile placeholder"
              fill
              className={cn(
                "object-cover opacity-85 transition-opacity duration-300",
                imagesReady ? "opacity-85" : "opacity-0"
              )}
              priority={priority}
              quality={90}
              sizes={sizeValue}
              placeholder="blur"
              blurDataURL={PLACEHOLDER_BLUR}
              onLoad={handleAthleteLoad}
            />
          </div>
        )}
      </div>
    </div>
  );
}
