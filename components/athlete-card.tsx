import { Card, CardContent} from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Medal } from "lucide-react";
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
  followers?: number;
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
  age,
  followers = 0,
}: AthleteCardProps) {
  const record = `${wins}-${losses}${draws > 0 ? `-${draws}` : ""}`;
  const totalFights = wins + losses + draws;
  const winRate = totalFights > 0 ? (wins / totalFights) * 100 : 0;
  const koRate = wins > 0 ? (winsByKo / wins) * 100 : 0;
  const submissionRate = wins > 0 ? (winsBySubmission / wins) * 100 : 0;

  return (
    <Card
      className="h-full relative overflow-hidden group border-red-600/10 dark:border-red-600/10 bg-white dark:bg-neutral-950 shadow-xs hover:shadow-md transition-all duration-200 hover:border-red-600/20 dark:hover:border-red-600/20 p-2"
    >
      {/* Background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-600/0 to-red-600/0 group-hover:from-red-600/[0.02] group-hover:to-red-600/[0.03] transition-all duration-200" />
      
      <CardContent className="p-2 pt-0 relative z-10">
        {/* Top Badge - Division and Rank/Champion Status */}
        <div className="flex justify-between items-center mb-2">
          <Badge
            variant="outline"
            className="text-xs font-medium text-red-600 dark:text-red-400 border-red-600/20 dark:border-red-400/20 bg-red-50 dark:bg-red-900/10 group-hover:bg-red-100 dark:group-hover:bg-red-900/20 transition-colors duration-200"
          >
            {division}
          </Badge>
          {retired ? (
            <Badge variant="outline" className="text-xs font-medium text-red-600 dark:text-red-400 border-red-600/20 dark:border-red-400/20">
              Retired
            </Badge>
          ) : isChampion ? (
            <Medal className="h-4 w-4 text-amber-500 group-hover:scale-105 transition-transform duration-200" />
          ) : poundForPoundRank > 0 ? (
            <Badge variant="outline" className="text-xs font-medium text-muted-foreground">
              P4P #{poundForPoundRank}
            </Badge>
          ) : (
            <Badge variant="outline" className="text-xs font-medium text-muted-foreground">
              Not Ranked
            </Badge>
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
            {age && (
              <span className="text-xs text-muted-foreground">
                {age} years
              </span>
            )}
          </div>
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

      <div className="px-2 py-1 border-t border-red-600/10 dark:border-red-500/20 relative z-10">
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
      </div>
    </Card>
  );
}
