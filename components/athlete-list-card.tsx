import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { AthleteAvatar } from "@/components/ui/athlete-avatar";
import { getCountryCode } from "@/lib/country-codes";
import { memo } from "react";

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
      {/* Background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-primary/[0.05] opacity-0 group-hover:opacity-100 transition-opacity duration-150" />

      <CardContent className="p-0 relative z-10 flex flex-col h-full">
        {/* Main content */}
        <div className="flex-1">
          {/* Top Badge - Division and Rank/Champion Status */}
          <div className="flex justify-between items-center mb-2 sm:mb-3">
            {retired ? (
              <div className="flex items-center gap-1.5">
                <Badge variant="retired" className="text-[10px] py-0 px-2">
                  Retired
                </Badge>
              </div>
            ) : rank === 1 ? (
              <div className="flex items-center gap-1.5">
                <Badge variant="champion" className="text-[10px] py-0 px-2">
                  #1
                </Badge>
              </div>
            ) : rank ? (
              <Badge
                variant="outline"
                className="text-[10px] py-0 px-2 font-medium"
              >
                #{rank}
              </Badge>
            ) : (
              <Badge variant="nr" className="text-[10px] py-0 px-2 font-medium">
                Not Ranked
              </Badge>
            )}
            {age && (
              <Badge
                variant="secondary"
                className="text-[10px] py-0 px-2 font-medium"
              >
                Age: <span className="">{age}</span>
              </Badge>
            )}
          </div>

          {/* Avatar and Name section */}
          <div className="flex flex-col items-center mb-3 sm:mb-3">
            <AthleteAvatar
              imageUrl={imageUrl}
              countryCode={getCountryCode(country)}
              size="sm"
              priority={priority}
              className={cn("ring-primary/20 dark:ring-primary/30")}
            />

            <div className="text-center mt-2 sm:mt-2">
              <h3 className="font-semibold text-sm sm:text-sm text-foreground leading-tight">
                {name}
              </h3>
              <h4 className="text-[11px] mt-1 leading-none flex items-center justify-center space-x-0.5">
                <span className="text-green-600 dark:text-green-400 tabular-nums font-medium">
                  {wins}
                </span>
                <span className="text-muted-foreground">-</span>
                <span className="text-red-600 dark:text-red-400 tabular-nums font-medium">
                  {losses}
                </span>
                {draws > 0 && (
                  <>
                    <span className="text-muted-foreground">-</span>
                    <span className="text-yellow-600 dark:text-yellow-400 tabular-nums font-medium">
                      {draws}
                    </span>
                  </>
                )}
              </h4>
            </div>
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
