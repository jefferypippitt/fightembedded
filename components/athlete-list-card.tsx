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

// AthleteImage component for full image display
interface AthleteImageProps {
  imageUrl?: string;
  countryCode?: string;
  priority?: boolean;
}

function AthleteImage({
  imageUrl,
  countryCode,
  priority = false,
}: AthleteImageProps) {
  // Validate country code
  const validCountryCode =
    countryCode && countryCode.length >= 2 && countryCode.length <= 10
      ? countryCode.toLowerCase()
      : null;

  const flagSrc = `https://flagcdn.com/${validCountryCode}.svg`;

  return (
    <>
      {/* Flag Background - Semi-transparent */}
      {validCountryCode && (
        <div className="absolute inset-0">
          <Image
            src={flagSrc}
            alt={`${validCountryCode} flag`}
            fill
            className="object-cover opacity-85"
            priority={priority}
            quality={75}
            sizes="(max-width: 768px) 200px, 250px"
            unoptimized={true}
          />
        </div>
      )}

      {/* Athlete Image - Centered and properly sized */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-16 h-16 sm:w-18 sm:h-18 overflow-hidden rounded-md">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt="Athlete"
              fill
              className="object-cover"
              priority={priority}
              quality={75}
              sizes="(max-width: 768px) 64px, 72px"
            />
          ) : (
            <Image
              src="/placeholder/SILHOUETTE.avif"
              alt="Athlete placeholder"
              fill
              className="object-cover opacity-85"
              priority={priority}
              quality={75}
              sizes="(max-width: 768px) 64px, 72px"
            />
          )}
        </div>
      </div>
    </>
  );
}

function AthleteListCardComponent({
  name,
  imageUrl = "/images/default-avatar.svg",
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
  const totalFights = wins + losses + draws;
  const winRate = totalFights > 0 ? (wins / totalFights) * 100 : 0;
  const koRate = wins > 0 ? (winsByKo / wins) * 100 : 0;
  const submissionRate = wins > 0 ? (winsBySubmission / wins) * 100 : 0;

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
          ) : rank === 1 ? (
            <span className="text-[12px] font-bold bg-gradient-to-r from-yellow-500 to-amber-500 dark:from-yellow-400 dark:to-amber-400 bg-clip-text text-transparent">
              #1
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

        {/* Full Image Section */}
        <div className="relative h-16 sm:h-16 mb-3 overflow-hidden rounded-sm">
          <AthleteImage
            imageUrl={imageUrl}
            countryCode={getCountryCode(country)}
            priority={priority}
          />
        </div>

        {/* Name and Record section */}
        <div className="text-center mb-3">
          <h3 className="font-semibold text-sm sm:text-sm text-foreground leading-tight">
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
            <span className="font-medium text-foreground ">
              {winRate.toFixed(1)}%
            </span>
          </div>
          <Progress
            value={winRate}
            className="h-1.5 bg-primary/10 dark:bg-primary/20 [&>div]:bg-primary"
          />

          <div className="flex justify-between items-center text-[10px] text-muted-foreground">
            <span>KO/TKO</span>
            <span className="font-medium text-foreground ">
              {koRate.toFixed(1)}%
            </span>
          </div>
          <Progress
            value={koRate}
            className="h-1.5 bg-primary/10 dark:bg-primary/20 [&>div]:bg-primary"
          />

          <div className="flex justify-between items-center text-[10px] text-muted-foreground">
            <span>Submission</span>
            <span className="font-medium text-foreground ">
              {submissionRate.toFixed(1)}%
            </span>
          </div>
          <Progress
            value={submissionRate}
            className="h-1.5 bg-primary/10 dark:bg-primary/20 [&>div]:bg-primary"
          />
        </div>

        {/* Footer */}
        <CardFooter className="px-0 pt-4 sm:pt-4">
          <div className="flex items-center justify-between w-full text-[10px]">
            <div className="flex items-center gap-1">
              <span className="font-medium text-foreground">{country}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">Followers:</span>
              <span className="font-medium text-foreground ">
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
