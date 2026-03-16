"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn, getCachedImageUrl } from "@/lib/utils";
import { getCountryCode } from "@/lib/country-codes";
import { memo, useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";

export interface AthleteListCardProps {
  id?: string;
  name: string;
  imageUrl?: string;
  updatedAt?: Date | string;
  country: string;
  wins?: number;
  losses?: number;
  draws?: number;
  winsByKo?: number;
  winsBySubmission?: number;
  rank?: number;
  followers?: number;
  age?: number;
  retired?: boolean;
  weightDivision?: string;
  poundForPoundRank?: number;
  isSelected?: boolean;
  suppressSelectedStyles?: boolean;
  onSelect?: () => void;
  priority?: boolean;
  disableCursor?: boolean;
  /** Called once when this card's images have loaded (or failed). Used for synchronized grid reveal. */
  onImagesReady?: () => void;
  /** When true, reveal content (used when parent has confirmed all cards are ready). */
  revealWhen?: boolean;
}

function AthleteListCardComponent({
  name,
  imageUrl,
  updatedAt,
  country,
  wins = 0,
  losses = 0,
  draws = 0,
  winsByKo = 0,
  winsBySubmission = 0,
  rank,
  followers = 0,
  age,
  retired = false,
  weightDivision,
  isSelected = false,
  suppressSelectedStyles = false,
  onSelect,
  disableCursor = false,
  priority = false,
  onImagesReady,
}: AthleteListCardProps) {
  // Get cached image URL with version parameter for cache busting
  const cachedImageUrl = getCachedImageUrl(imageUrl || null, updatedAt);
  // Track image loading for synchronized grid reveal (simplified)
  const [flagLoaded, setFlagLoaded] = useState(false);
  const [athleteLoaded, setAthleteLoaded] = useState(false);
  const hasReportedReady = useRef(false);

  const countryCode = getCountryCode(country);
  const imagesReady = countryCode ? flagLoaded && athleteLoaded : athleteLoaded;

  // Report once to parent when this card's images are ready (for grid-wide reveal)
  useEffect(() => {
    if (imagesReady && onImagesReady && !hasReportedReady.current) {
      hasReportedReady.current = true;
      onImagesReady();
    }
  }, [imagesReady, onImagesReady]);

  const handleFlagLoad = useCallback(() => {
    setFlagLoaded(true);
  }, []);

  const handleAthleteLoad = useCallback(() => {
    setAthleteLoaded(true);
  }, []);

  // Treat errors as "loaded" so one failed image doesn't block grid reveal
  const handleFlagError = useCallback(() => setFlagLoaded(true), []);
  const handleAthleteError = useCallback(() => setAthleteLoaded(true), []);

  const isClickable = Boolean(onSelect);
  const isInteractive = isClickable && !disableCursor;

  const handleCardKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (!isInteractive || !onSelect) return;
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onSelect();
      }
    },
    [isInteractive, onSelect]
  );

  // Calculate stats
  const totalFights = wins + losses + draws;
  const winRate = totalFights > 0 ? (wins / totalFights) * 100 : 0;
  const koRate = wins > 0 ? (winsByKo / wins) * 100 : 0;
  const submissionRate = wins > 0 ? (winsBySubmission / wins) * 100 : 0;

  return (
    <Card
      className={cn(
        "@container/card h-full relative overflow-hidden group flex flex-col border-border/40 dark:border-border/40 bg-transparent shadow-sm p-2 sm:p-3 transition-all duration-200",
        isInteractive &&
          "cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/55 focus:ring-offset-2 focus:ring-offset-background focus-visible:ring-2 focus-visible:ring-primary/55 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        isInteractive &&
          isSelected &&
          !suppressSelectedStyles &&
          "border-primary/55 hover:border-primary/70 hover:bg-transparent hover:ring-0",
        isInteractive &&
          !isSelected &&
          "hover:border-primary/45 hover:shadow-md hover:bg-primary/5 hover:ring-2 hover:ring-primary/45 dark:hover:ring-primary/60"
      )}
      style={{ contentVisibility: "auto", containIntrinsicSize: "0 280px" }}
      onClick={isInteractive ? onSelect : undefined}
      onKeyDown={handleCardKeyDown}
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      aria-pressed={isInteractive ? isSelected : undefined}
      aria-label={isInteractive ? `Select ${name} for comparison` : undefined}
    >
      <CardContent className="p-0 flex flex-col">
        {/* Corner Badges */}
        <div className="flex justify-between pb-2">
          {retired ? (
            <span className="text-[12px] font-medium text-red-500">
              Retired
            </span>
          ) : rank ? (
            <span className="text-[12px] font-medium">#{rank}</span>
          ) : (
            <span className="text-[12px] font-medium">NR</span>
          )}
          {age ? (
            <div className="flex items-center gap-1 text-[10px]">
              <span className="text-muted-foreground">Age:</span>
              <span className="font-medium text-foreground tabular-nums">
                {age}
              </span>
            </div>
          ) : null}
        </div>

        {/* Border line that extends across full card width */}
        <div className="border-b border-border/40 -mx-2 sm:-mx-3 mb-3"></div>

        {/* Banner with Flag Background and Athlete Image */}
        <div className="relative h-14 w-full mb-3 overflow-hidden rounded-sm bg-muted/20">
          {/* Flag Background */}
          {countryCode && (
            <Image
              src={`https://flagcdn.com/${countryCode.toLowerCase()}.svg`}
              alt={`${country} flag`}
              fill
              className="object-cover opacity-80"
              priority={priority}
              fetchPriority={priority ? "high" : undefined}
              quality={90}
              sizes="(max-width: 640px) 800px, (max-width: 1024px) 640px, 682px"
              unoptimized
              onLoad={handleFlagLoad}
              onError={handleFlagError}
            />
          )}

          {/* Centered Athlete Image */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="relative size-20 overflow-hidden rounded-md">
              <Image
                src={cachedImageUrl || "/placeholder/SILHOUETTE.avif"}
                alt={cachedImageUrl ? name : "Athlete placeholder"}
                fill
                className="object-cover object-top"
                priority={priority}
                fetchPriority={priority ? "high" : undefined}
                quality={90}
                sizes="160px"
                onLoad={handleAthleteLoad}
                onError={handleAthleteError}
              />
            </div>
          </div>
        </div>

        {/* Name and Record section */}
        <div className="mb-3 text-center">
          <h3 className="line-clamp-1 font-semibold text-sm text-foreground leading-tight">
            {name}
          </h3>
          <h4 className="text-[11px] mt-1 leading-none flex items-center justify-center space-x-0.5">
            <span className="text-green-500 tabular-nums font-medium">
              {wins}
            </span>
            <span className="text-muted-foreground">-</span>
            <span className="text-red-500 tabular-nums font-medium">
              {losses}
            </span>
            {draws > 0 && (
              <>
                <span className="text-muted-foreground">-</span>
                <span className="text-neutral-500 tabular-nums">{draws}</span>
              </>
            )}
          </h4>
        </div>

        {/* Division */}
        {weightDivision && (
          <div className="flex items-center justify-center mb-3">
            <span className="max-w-full truncate px-2 py-0 text-[10px] font-semibold tracking-wide text-foreground/70 uppercase">
              {weightDivision.replace(/^(Men's|Women's)\s+/, "")}
            </span>
          </div>
        )}

        {/* Stats with Progress Bars */}
        <div className="space-y-1.5 sm:space-y-2">
          <div className="flex justify-between items-center text-[10px] text-muted-foreground">
            <span>Win Rate</span>
            <span className="font-medium text-foreground">
              {winRate.toFixed(1)}%
            </span>
          </div>
          <Progress
            value={winRate}
            className="h-1.5 bg-primary/10 dark:bg-primary/20 [&>div]:bg-primary"
          />

          <div className="flex justify-between items-center text-[10px] text-muted-foreground">
            <span>KO/TKO</span>
            <span className="font-medium text-foreground">
              {koRate.toFixed(1)}%
            </span>
          </div>
          <Progress
            value={koRate}
            className="h-1.5 bg-primary/10 dark:bg-primary/20 [&>div]:bg-primary"
          />

          <div className="flex justify-between items-center text-[10px] text-muted-foreground">
            <span>Submission</span>
            <span className="font-medium text-foreground">
              {submissionRate.toFixed(1)}%
            </span>
          </div>
          <Progress
            value={submissionRate}
            className="h-1.5 bg-primary/10 dark:bg-primary/20 [&>div]:bg-primary"
          />
        </div>

        {/* Footer */}
        <CardFooter className="px-0 pt-4">
          <div className="flex w-full items-center justify-between gap-2 text-[10px]">
            <span className="truncate font-medium text-foreground">{country}</span>
            <div className="flex min-w-0 items-center gap-1">
              <span className="shrink-0 text-muted-foreground">Followers:</span>
              <span className="truncate font-medium text-foreground">
                {followers.toLocaleString()}
              </span>
            </div>
          </div>
        </CardFooter>
      </CardContent>
    </Card>
  );
}

// Memoize the component to prevent unnecessary re-renders
export const AthleteListCard = memo(AthleteListCardComponent);
