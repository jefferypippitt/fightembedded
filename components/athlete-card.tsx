import { Athlete } from "@prisma/client";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Medal } from "lucide-react";
import { AthleteAvatar } from "@/components/ui/athlete-avatar";
import { getCountryCode } from "@/lib/country-codes";
import { cn } from "@/lib/utils";
import { memo } from "react";

interface AthleteCardProps {
  athlete: Athlete;
  showDivision?: boolean;
  showStats?: boolean;
  showFollowers?: boolean;
  className?: string;
}

// Map division names to badge variants
const getDivisionVariant = (
  division: string,
  gender: "MALE" | "FEMALE"
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
  if (gender === "MALE") {
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
    return menDivisions[divisionName] || "default";
  }

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
  return womenDivisions[divisionName] || "default";
};

function AthleteCardComponent({
  athlete,
  showDivision = true,
  showStats = true,
  showFollowers = true,
  className = "",
}: AthleteCardProps) {
  if (!athlete) {
    return null;
  }

  const record = `${athlete.wins}-${athlete.losses}${
    athlete.draws > 0 ? `-${athlete.draws}` : ""
  }`;
  const totalFights = athlete.wins + athlete.losses + athlete.draws;
  const winRate = totalFights > 0 ? (athlete.wins / totalFights) * 100 : 0;
  const koRate = athlete.wins > 0 ? (athlete.winsByKo / athlete.wins) * 100 : 0;
  const submissionRate =
    athlete.wins > 0 ? (athlete.winsBySubmission / athlete.wins) * 100 : 0;
  const isChampion = athlete.rank === 1;

  return (
    <Card
      className={cn(
        "h-full relative overflow-hidden group",
        "border-border/40 dark:border-border/40",
        "bg-card dark:bg-card",
        "shadow-sm hover:shadow-md",
        "transition-all duration-300",
        "hover:border-primary/20 dark:hover:border-primary/20",
        "p-3",
        className
      )}
    >
      {/* Background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/[0.02] group-hover:to-primary/[0.03] transition-all duration-300" />

      <CardContent className="p-0 relative z-10">
        {/* Top Badge - Division and Rank/Champion Status */}
        <div className="flex justify-between items-center mb-3">
          {athlete.retired ? (
            <div className="flex items-center gap-1.5">
              <Badge variant="retired" className="text-[10px] py-0 px-2">
                Retired
              </Badge>
            </div>
          ) : isChampion ? (
            <div className="flex items-center gap-1.5">
              <Medal className="h-3.5 w-3.5 text-yellow-500" />
              <Badge variant="champion" className="text-[10px] py-0 px-2">
                Champion
              </Badge>
            </div>
          ) : athlete.poundForPoundRank ? (
            <Badge
              variant="secondary"
              className="text-[10px] py-0 px-2 font-medium bg-primary/10 text-primary hover:bg-primary/20"
            >
              P4P #{athlete.poundForPoundRank}
            </Badge>
          ) : (
            <Badge
              variant="secondary"
              className="text-[10px] py-0 px-2 font-medium bg-muted text-muted-foreground hover:bg-muted/80"
            >
              Not Ranked
            </Badge>
          )}
          {athlete.age && (
            <Badge
              variant="secondary"
              className="text-[10px] py-0 px-2 font-medium bg-muted text-muted-foreground hover:bg-muted/80"
            >
              Age: {athlete.age}
            </Badge>
          )}
        </div>

        {/* Avatar and Name section */}
        <div className="flex flex-col items-center mb-3">
          <AthleteAvatar
            imageUrl={athlete.imageUrl || "/default-avatar.png"}
            countryCode={getCountryCode(athlete.country)}
            size="sm"
            priority={true}
            className={cn(
              "ring-primary/20 dark:ring-primary/30 group-hover:ring-primary/30 dark:group-hover:ring-primary/40 transition-all duration-300",
              athlete.retired && "opacity-75"
            )}
          />

          <div className="text-center mt-2">
            <h3 className="font-semibold text-sm text-foreground leading-tight">
              {athlete.name}
            </h3>
            <h4 className="text-[10px] font-medium text-muted-foreground leading-tight">
              {record}
            </h4>
          </div>
        </div>

        {/* Division */}
        {showDivision && (
          <div className="flex items-center justify-center mb-3">
            <Badge
              variant={getDivisionVariant(
                athlete.weightDivision,
                athlete.gender as "MALE" | "FEMALE"
              )}
              className="text-[10px] py-0 px-2 font-medium"
            >
              {athlete.weightDivision}
            </Badge>
          </div>
        )}

        {/* Stats with Progress Bars */}
        {showStats && (
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px] text-muted-foreground">
              <span>Win Rate</span>
              <span className="font-medium text-foreground">
                {winRate.toFixed(1)}%
              </span>
            </div>
            <Progress
              value={winRate}
              className="h-1.5 bg-primary/10 dark:bg-primary/20 [&>div]:bg-primary [&>div]:group-hover:bg-primary/90 transition-colors duration-300"
            />

            <div className="flex justify-between items-center text-[10px] text-muted-foreground">
              <span>KO/TKO</span>
              <span className="font-medium text-foreground">
                {koRate.toFixed(1)}%
              </span>
            </div>
            <Progress
              value={koRate}
              className="h-1.5 bg-primary/10 dark:bg-primary/20 [&>div]:bg-primary [&>div]:group-hover:bg-primary/90 transition-colors duration-300"
            />

            <div className="flex justify-between items-center text-[10px] text-muted-foreground">
              <span>Submission</span>
              <span className="font-medium text-foreground">
                {submissionRate.toFixed(1)}%
              </span>
            </div>
            <Progress
              value={submissionRate}
              className="h-1.5 bg-primary/10 dark:bg-primary/20 [&>div]:bg-primary [&>div]:group-hover:bg-primary/90 transition-colors duration-300"
            />
          </div>
        )}
      </CardContent>

      {showFollowers && (
        <CardFooter className="px-0 pt-3 pb-0 border-t border-border/40 dark:border-border/40 relative z-10">
          <div className="flex items-center justify-between w-full text-[10px]">
            <div className="flex items-center gap-1">
              <span className="font-medium text-foreground">
                {athlete.country}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">Followers:</span>
              <span className="font-medium text-foreground">
                {athlete.followers.toLocaleString()}
              </span>
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}

// Memoize the component to prevent unnecessary re-renders
export const AthleteCard = memo(AthleteCardComponent);
