import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Medal, Flag } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface AthleteCardProps {
  name: string;
  division: string;
  gender: "MALE" | "FEMALE";
  imageUrl?: string;
  country: string;
  wins?: number;
  losses?: number;
  draws?: number;
  winsByKo?: number;
  winsBySubmission?: number;
  rank?: number;
  poundForPoundRank?: number;
  isChampion?: boolean;
  retired?: boolean;
  age?: number;
}

export function AthleteCard({
  name,
  division,
  imageUrl = "/default-avatar.png",
  country,
  wins = 0,
  losses = 0,
  draws = 0,
  winsByKo = 0,
  winsBySubmission = 0,
  poundForPoundRank = 0,
  isChampion = false,
  retired = false,
}: AthleteCardProps) {
  const record = `${wins}-${losses}${draws > 0 ? `-${draws}` : ""}`;
  const totalFights = wins + losses + draws;
  const winRate = totalFights > 0 ? (wins / totalFights) * 100 : 0;
  const koRate = wins > 0 ? (winsByKo / wins) * 100 : 0;
  const submissionRate = wins > 0 ? (winsBySubmission / wins) * 100 : 0;

  return (
    <Card
      className={cn(
        "h-full relative overflow-hidden",
        "border-red-600/20 dark:border-red-600/20",
        "bg-gray-50 dark:bg-zinc-950",
        "bg-gradient-to-r from-transparent via-red-600/[0.03] to-transparent",
        "dark:bg-gradient-to-r dark:from-transparent dark:via-red-400/[0.02] dark:to-transparent"
      )}
    >
      <CardContent className="p-2 sm:p-4 relative z-10">
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <Badge
            variant="outline"
            className="text-[10px] sm:text-xs bg-red-600/10 dark:bg-red-500/30 text-red-700 dark:text-red-300 border-red-600/20 dark:border-red-500/30"
          >
            {division}
          </Badge>
          {isChampion ? (
            <Medal className="h-3 w-3 sm:h-4 sm:w-4 text-amber-500" />
          ) : poundForPoundRank ? (
            <span className="text-[10px] sm:text-xs font-medium text-gray-900 dark:text-white">
              P4P #{poundForPoundRank}
            </span>
          ) : !retired ? (
            <span className="text-[10px] sm:text-xs font-medium text-gray-600 dark:text-gray-400">
              NR
            </span>
          ) : null}
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4 mb-2 sm:mb-3">
          <Avatar className="h-10 w-10 sm:h-14 sm:w-14 rounded-full ring-1 ring-red-600/20 dark:ring-red-500/30">
            <Image
              src={imageUrl}
              alt={name}
              className="object-cover w-full h-full"
              width={100}
              height={100}
              quality={100}
              priority={true}
            />
          </Avatar>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-xs sm:text-sm text-gray-900 dark:text-white">
              {name}
            </h3>
            <div className="flex flex-col gap-0.5 sm:gap-1">
              <div className="flex items-center gap-1">
                <span className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-300 font-medium">
                  {record}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-1 text-[10px] sm:text-xs">
          <div className="flex justify-between items-center text-gray-700 dark:text-gray-200">
            <span>Win Rate</span>
            <span className="font-medium">{winRate.toFixed(1)}%</span>
          </div>
          <Progress
            value={winRate}
            className="h-1 bg-red-600/10 dark:bg-red-500/20"
          />

          <div className="flex justify-between items-center text-gray-700 dark:text-gray-200">
            <span>KO/TKO</span>
            <span className="font-medium">{koRate.toFixed(1)}%</span>
          </div>
          <Progress
            value={koRate}
            className="h-1 bg-red-600/10 dark:bg-red-500/20"
          />

          <div className="flex justify-between items-center text-gray-700 dark:text-gray-200">
            <span>Submission</span>
            <span className="font-medium">{submissionRate.toFixed(1)}%</span>
          </div>
          <Progress
            value={submissionRate}
            className="h-1 bg-red-600/10 dark:bg-red-500/20"
          />
          <div className="flex items-center gap-1 py-1">
            <Flag className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-red-600 dark:text-red-400" />
            <span className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-300">
              {country}
            </span>
          </div>
        </div>
        {retired && (
          <Badge variant="destructive" className="absolute top-2 right-2">
            Retired
          </Badge>
        )}
      </CardContent>
      <CardFooter className="p-0" />
    </Card>
  );
}
