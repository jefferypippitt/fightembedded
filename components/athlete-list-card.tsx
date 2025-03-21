import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
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
  isSelected?: boolean;
  onSelect?: () => void;
}

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

  return (
    <Card
      className={cn(
        "h-full relative overflow-hidden group",
        "border-red-600/10 dark:border-red-600/10",
        "bg-white dark:bg-neutral-950",
        "shadow-xs hover:shadow-md",
        "transition-all duration-200",
        "hover:border-red-600/20 dark:hover:border-red-600/20",
        isSelected && "ring-2 ring-primary"
      )}
      onClick={onSelect}
    >
      {/* Background gradient on hover */}
      <div className="absolute inset-0 bg-linear-to-br from-red-600/0 to-red-600/0 group-hover:from-red-600/[0.02] group-hover:to-red-600/[0.03] transition-all duration-200" />
      
      <CardContent className="p-3 relative z-10">
        {/* Top Badge - Ranking and Age */}
        <div className="flex justify-between items-center mb-3">
          {retired ? (
            <Badge variant="outline" className="text-xs font-medium text-red-600 dark:text-red-400 border-red-600/20 dark:border-red-400/20">
              Retired
            </Badge>
          ) : rank ? (
            <Badge variant="outline" className="text-xs font-medium text-muted-foreground">
              #{rank}
            </Badge>
          ) : (
            <Badge variant="outline" className="text-xs font-medium text-muted-foreground">
              Not Ranked
            </Badge>
          )}
          {age && (
            <span className="text-xs text-muted-foreground">
              {age} years
            </span>
          )}
        </div>

        {/* Avatar and Name section */}
        <div className="flex flex-col items-center mb-3">
          <Avatar className="h-16 w-16 rounded-full ring-1 ring-red-600/20 dark:ring-red-500/30 group-hover:ring-red-600/30 dark:group-hover:ring-red-500/40 transition-all duration-200">
            <Image
              src={imageUrl}
              alt={name}
              className="object-cover w-full h-full transition-transform duration-200"
              width={100}
              height={100}
              quality={100}
              priority={true}
            />
          </Avatar>

          <div className="text-center">
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
              {name}
            </h3>
            <h4 className="text-xs font-medium text-gray-600 dark:text-gray-300">
              {record}
            </h4>
          </div>
        </div>

        {/* Division */}
        <div className="flex items-center justify-center gap-2 mb-3">
          {weightDivision && (
            <Badge
              variant="outline"
              className="text-[10px] sm:text-xs bg-red-600/10 dark:bg-red-500/30 text-red-700 dark:text-red-300 border-red-600/20 dark:border-red-500/30 group-hover:bg-red-100 dark:group-hover:bg-red-900/20 transition-colors duration-200"
            >
              {weightDivision}
            </Badge>
          )}
        </div>

        {/* Stats with Progress Bars */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-[10px] text-gray-700 dark:text-gray-200">
            <span>Win Rate</span>
            <span className="font-medium">{winRate.toFixed(1)}%</span>
          </div>
          <Progress
            value={winRate}
            className="h-1 bg-red-600/10 dark:bg-red-500/20 [&>div]:bg-red-600 dark:[&>div]:bg-red-500 [&>div]:group-hover:bg-red-600/90 dark:[&>div]:group-hover:bg-red-500/90 transition-colors duration-200"
          />

          <div className="flex justify-between items-center text-[10px] text-gray-700 dark:text-gray-200">
            <span>KO/TKO</span>
            <span className="font-medium">{koRate.toFixed(1)}%</span>
          </div>
          <Progress
            value={koRate}
            className="h-1 bg-red-600/10 dark:bg-red-500/20 [&>div]:bg-red-600 dark:[&>div]:bg-red-500 [&>div]:group-hover:bg-red-600/90 dark:[&>div]:group-hover:bg-red-500/90 transition-colors duration-200"
          />

          <div className="flex justify-between items-center text-[10px] text-gray-700 dark:text-gray-200">
            <span>Submission</span>
            <span className="font-medium">{submissionRate.toFixed(1)}%</span>
          </div>
          <Progress
            value={submissionRate}
            className="h-1 bg-red-600/10 dark:bg-red-500/20 [&>div]:bg-red-600 dark:[&>div]:bg-red-500 [&>div]:group-hover:bg-red-600/90 dark:[&>div]:group-hover:bg-red-500/90 transition-colors duration-200"
          />
        </div>
      </CardContent>

      <CardFooter className="px-3 py-2 border-t border-red-600/10 dark:border-red-500/20 relative z-10">
        <div className="flex items-center justify-between w-full text-[10px]">
          <div className="flex items-center gap-1">
            <span className="font-medium">{country}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gray-600 dark:text-gray-300">Followers:</span>
            <span className="font-medium text-gray-700 dark:text-gray-200">
              {followers.toLocaleString()}
            </span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
