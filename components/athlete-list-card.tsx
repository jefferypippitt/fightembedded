import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { AthleteAvatar } from "@/components/ui/athlete-avatar";
import { getCountryCode } from "@/lib/country-codes";
import { Medal } from "lucide-react";

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
  isSelected?: boolean;
  onSelect?: () => void;
}

// Map division names to badge variants
const getDivisionVariant = (division: string): "lightweight" | "welterweight" | "middleweight" | "lightHeavyweight" | "heavyweight" | "featherweight" | "bantamweight" | "flyweight" | "womenFeatherweight" | "womenBantamweight" | "womenFlyweight" | "womenStrawweight" | "default" => {
  // Remove gender prefix if present
  const divisionName = division.replace(/^(Men's|Women's)\s+/, '');
  
  // Men's divisions
  const menDivisions: Record<string, "lightweight" | "welterweight" | "middleweight" | "lightHeavyweight" | "heavyweight" | "featherweight" | "bantamweight" | "flyweight"> = {
    "Heavyweight": "heavyweight",
    "Light Heavyweight": "lightHeavyweight",
    "Middleweight": "middleweight",
    "Welterweight": "welterweight",
    "Lightweight": "lightweight",
    "Featherweight": "featherweight",
    "Bantamweight": "bantamweight",
    "Flyweight": "flyweight",
  };

  // Women's divisions
  const womenDivisions: Record<string, "womenFeatherweight" | "womenBantamweight" | "womenFlyweight" | "womenStrawweight"> = {
    "Featherweight": "womenFeatherweight",
    "Bantamweight": "womenBantamweight",
    "Flyweight": "womenFlyweight",
    "Strawweight": "womenStrawweight",
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

export function AthleteListCard({
  name,
  imageUrl = "/default-avatar.png",
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
}: AthleteListCardProps) {
  const record = `${wins}-${losses}${draws > 0 ? `-${draws}` : ""}`;
  const totalFights = wins + losses + draws;
  const winRate = totalFights > 0 ? (wins / totalFights) * 100 : 0;
  const koRate = wins > 0 ? (winsByKo / wins) * 100 : 0;
  const submissionRate = wins > 0 ? (winsBySubmission / wins) * 100 : 0;

  // Determine if this athlete's image should be prioritized
  const isPriorityImage = rank === 1 || rank === 2 || rank === 3 || rank === 4 || rank === 5;

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
        isSelected && "ring-1 ring-primary"
      )}
      onClick={onSelect}
    >
      {/* Background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/[0.02] group-hover:to-primary/[0.03] transition-all duration-300" />
      
      <CardContent className="p-0 relative z-10">
        {/* Top Badge - Division and Rank/Champion Status */}
        <div className="flex justify-between items-center mb-3">
          {retired ? (
            <div className="flex items-center gap-1.5">
              <Badge variant="retired" className="text-[10px] py-0 px-2">
                Retired
              </Badge>
            </div>
          ) : rank === 1 ? (
            <div className="flex items-center gap-1.5">
              <Medal className="h-3.5 w-3.5 text-yellow-500" />
              <Badge variant="champion" className="text-[10px] py-0 px-2">
                Champion
              </Badge>
            </div>
          ) : rank ? (
            <Badge variant="secondary" className="text-[10px] py-0 px-2 font-medium bg-primary/10 text-primary hover:bg-primary/20">
              #{rank}
            </Badge>
          ) : (
            <Badge variant="secondary" className="text-[10px] py-0 px-2 font-medium bg-muted text-muted-foreground hover:bg-muted/80">
              Not Ranked
            </Badge>
          )}
          {age && (
            <Badge variant="secondary" className="text-[10px] py-0 px-2 font-medium bg-muted text-muted-foreground hover:bg-muted/80">
              Age: {age}
            </Badge>
          )}
        </div>

        {/* Avatar and Name section */}
        <div className="flex flex-col items-center mb-3">
          <AthleteAvatar
            imageUrl={imageUrl}
            countryCode={getCountryCode(country)}
            size="sm"
            className={cn(
              "ring-primary/20 dark:ring-primary/30 group-hover:ring-primary/30 dark:group-hover:ring-primary/40 transition-all duration-300"
            )}
            priority={isPriorityImage}
          />

          <div className="text-center mt-2">
            <h3 className="font-semibold text-sm text-foreground leading-tight">
              {name}
            </h3>
            <h4 className="text-[10px] font-medium text-muted-foreground leading-tight">
              {record}
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
              {weightDivision}
            </Badge>
          </div>
        )}

        {/* Stats with Progress Bars */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-[10px] text-muted-foreground">
            <span>Win Rate</span>
            <span className="font-medium text-foreground">{winRate.toFixed(1)}%</span>
          </div>
          <Progress
            value={winRate}
            className="h-1.5 bg-primary/10 dark:bg-primary/20 [&>div]:bg-primary [&>div]:group-hover:bg-primary/90 transition-colors duration-300"
          />

          <div className="flex justify-between items-center text-[10px] text-muted-foreground">
            <span>KO/TKO</span>
            <span className="font-medium text-foreground">{koRate.toFixed(1)}%</span>
          </div>
          <Progress
            value={koRate}
            className="h-1.5 bg-primary/10 dark:bg-primary/20 [&>div]:bg-primary [&>div]:group-hover:bg-primary/90 transition-colors duration-300"
          />

          <div className="flex justify-between items-center text-[10px] text-muted-foreground">
            <span>Submission</span>
            <span className="font-medium text-foreground">{submissionRate.toFixed(1)}%</span>
          </div>
          <Progress
            value={submissionRate}
            className="h-1.5 bg-primary/10 dark:bg-primary/20 [&>div]:bg-primary [&>div]:group-hover:bg-primary/90 transition-colors duration-300"
          />
        </div>
      </CardContent>

      <CardFooter className="px-0 pt-3 pb-0 border-t border-border/40 dark:border-border/40 relative z-10">
        <div className="flex items-center justify-between w-full text-[10px]">
          <div className="flex items-center gap-1">
            <span className="font-medium text-foreground">{country}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">Followers:</span>
            <span className="font-medium text-foreground">
              {followers.toLocaleString()}
            </span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
