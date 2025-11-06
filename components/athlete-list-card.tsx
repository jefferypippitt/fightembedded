import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { getCountryCode } from "@/lib/country-codes";
import { memo } from "react";
import Image from "next/image";

export interface AthleteListCardProps {
  id?: string;
  name: string;
  imageUrl?: string;
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
  onSelect?: () => void;
  priority?: boolean;
  disableCursor?: boolean;
}

// Map division names to badge variants
const getDivisionVariant = (
  division: string
):
  | "lightweight"
  | "welterweight"
  | "middleweight"
  | "lightHeavyweight"
  | "heavyweight"
  | "featherweight"
  | "bantamweight"
  | "flyweight"
  | "womenFeatherweight"
  | "womenBantamweight"
  | "womenFlyweight"
  | "womenStrawweight"
  | "default" => {
  // Remove gender prefix if present
  const divisionName = division.replace(/^(Men's|Women's)\s+/, "");

  // Men's divisions
  const menDivisions: Record<
    string,
    | "lightweight"
    | "welterweight"
    | "middleweight"
    | "lightHeavyweight"
    | "heavyweight"
    | "featherweight"
    | "bantamweight"
    | "flyweight"
  > = {
    Heavyweight: "heavyweight",
    "Light Heavyweight": "lightHeavyweight",
    Middleweight: "middleweight",
    Welterweight: "welterweight",
    Lightweight: "lightweight",
    Featherweight: "featherweight",
    Bantamweight: "bantamweight",
    Flyweight: "flyweight",
  };

  // Women's divisions
  const womenDivisions: Record<
    string,
    | "womenFeatherweight"
    | "womenBantamweight"
    | "womenFlyweight"
    | "womenStrawweight"
  > = {
    Featherweight: "womenFeatherweight",
    Bantamweight: "womenBantamweight",
    Flyweight: "womenFlyweight",
    Strawweight: "womenStrawweight",
  };

  // Check if it's a men's division first
  if (menDivisions[divisionName]) {
    return menDivisions[divisionName];
  }

  // Then check if it's a women's division
  if (womenDivisions[divisionName]) {
    return womenDivisions[divisionName];
  }

  return "default";
};

function AthleteListCardComponent({
  name,
  imageUrl,
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
  isSelected,
  onSelect,
  priority = false,
  disableCursor = false,
}: AthleteListCardProps) {
  // Calculate stats
  const totalFights = wins + losses + draws;
  const winRate = totalFights > 0 ? (wins / totalFights) * 100 : 0;
  const koRate = wins > 0 ? (winsByKo / wins) * 100 : 0;
  const submissionRate = wins > 0 ? (winsBySubmission / wins) * 100 : 0;

  // Get country code for flag
  const countryCode = getCountryCode(country);

  return (
    <Card
      className={cn(
        "@container/card h-full relative overflow-hidden group flex flex-col",
        "border-border/40 dark:border-border/40",
        "bg-transparent",
        "shadow-sm hover:shadow-md",
        "transition-shadow duration-200",
        "hover:border-primary/20 dark:hover:border-primary/20",
        "p-2 sm:p-3",
        !disableCursor && "cursor-pointer",
        isSelected && "ring-1 ring-primary/60"
      )}
      onClick={onSelect}
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
          {age && (
            <div className="flex items-center gap-1 text-[10px]">
              <span className="text-muted-foreground">Age:</span>
              <span className="font-medium text-foreground tabular-nums">
                {age}
              </span>
            </div>
          )}
        </div>

        {/* Border line that extends across full card width */}
        <div className="border-b border-border/40 -mx-2 sm:-mx-3 mb-3"></div>

        {/* Banner with Flag Background and Athlete Image */}
        <div className="relative h-14 w-full mb-3 overflow-hidden rounded-sm bg-muted/20">
          {/* Flag Background */}
          {countryCode && (
            <>
              <Image
                src={`https://flagcdn.com/${countryCode.toLowerCase()}.svg`}
                alt={`${country} flag`}
                fill
                className="object-cover opacity-80"
                priority={priority}
                quality={75}
                sizes="(max-width: 640px) 280px, 320px"
                unoptimized
              />
              {/* Vignette effect on flag */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.35)_100%)]" />
            </>
          )}

          {/* Centered Athlete Image */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="relative size-20 overflow-hidden rounded-md brightness-100">
              <Image
                src={imageUrl || "/placeholder/SILHOUETTE.avif"}
                alt={imageUrl ? name : "Athlete placeholder"}
                fill
                className="object-cover object-top brightness-100"
                priority={priority}
                quality={85}
                sizes="80px"
              />
            </div>
          </div>
        </div>

        {/* Name and Record section */}
        <div className="text-center mb-3">
          <h3 className="font-semibold text-sm text-foreground leading-tight">
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
            <Badge
              variant={getDivisionVariant(weightDivision)}
              className="text-[10px] py-0 px-2 font-medium"
            >
              {weightDivision.replace(/^(Men's|Women's)\s+/, "")}
            </Badge>
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
          <div className="flex items-center justify-between w-full text-[10px]">
            <span className="font-medium text-foreground">{country}</span>
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">Followers:</span>
              <span className="font-medium text-foreground">
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
