import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Flag } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface AthleteListCardProps {
  name: string;
  weightDivision: string;
  imageUrl?: string;
  country: string;
  wins?: number;
  losses?: number;
  draws?: number;
  winsByKo?: number;
  winsBySubmission?: number;
  rank?: number;
  followers?: number;
  record?: string;
  age?: number;
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
}: AthleteListCardProps) {
  const record = `${wins}-${losses}${draws > 0 ? `-${draws}` : ""}`;
  const totalFights = wins + losses + draws;
  const winRate = totalFights > 0 ? (wins / totalFights) * 100 : 0;
  const koRate = wins > 0 ? (winsByKo / wins) * 100 : 0;
  const submissionRate = wins > 0 ? (winsBySubmission / wins) * 100 : 0;

  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all duration-300",
        "border-red-600/20 dark:border-red-500/30",
        "bg-gradient-to-br from-white via-gray-50 to-gray-100",
        "dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900",
        "before:absolute before:inset-0 before:bg-gradient-to-r",
        "before:from-red-600/0 before:via-red-600/5 before:to-red-600/0",
        "dark:before:from-red-500/0 dark:before:via-red-500/20 dark:before:to-red-500/0",
        "hover:before:opacity-100 before:transition-opacity",
        "after:absolute after:inset-0 after:bg-gradient-to-t",
        "after:from-black/5 after:to-transparent",
        "dark:after:from-black/40 dark:after:to-transparent"
      )}
    >
      <CardContent className="p-3 relative z-10">
        {/* Top Badge - Only Ranking */}
        <div className="flex justify-between items-center mb-3">
          {rank ? (
            <Badge
              variant="outline"
              className="text-[10px] px-2 py-0 bg-red-600/10 dark:bg-red-500/30 text-red-700 dark:text-red-300 border-red-600/20 dark:border-red-500/30"
            >
              #{rank}
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="text-[10px] px-2 py-0 bg-red-600/10 dark:bg-red-500/30 text-red-700 dark:text-red-300 border-red-600/20 dark:border-red-500/30"
            >
              NR
            </Badge>
          )}
          {age && (
            <Badge
              variant="secondary"
              className="text-[10px] px-2 py-0 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              Age: {age}
            </Badge>
          )}
        </div>

        {/* Avatar and Name Section */}
        <div className="flex flex-col items-center mb-3">
          <Avatar className="h-16 w-16 rounded-full ring-1 ring-red-600/20 dark:ring-red-500/30">
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

          <div className="text-center">
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
              {name}
            </h3>
            <h4 className="text-xs font-medium text-gray-600 dark:text-gray-300">
              {record}
            </h4>
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
            className="h-1 bg-red-600/10 dark:bg-red-500/20"
          />

          <div className="flex justify-between items-center text-[10px] text-gray-700 dark:text-gray-200">
            <span>KO/TKO</span>
            <span className="font-medium">{koRate.toFixed(1)}%</span>
          </div>
          <Progress
            value={koRate}
            className="h-1 bg-red-600/10 dark:bg-red-500/20"
          />

          <div className="flex justify-between items-center text-[10px] text-gray-700 dark:text-gray-200">
            <span>Submission</span>
            <span className="font-medium">{submissionRate.toFixed(1)}%</span>
          </div>
          <Progress
            value={submissionRate}
            className="h-1 bg-red-600/10 dark:bg-red-500/20"
          />
        </div>
      </CardContent>

      <CardFooter className="px-3 py-2 border-t border-red-600/10 dark:border-red-500/20 relative z-10">
        <div className="flex items-center justify-between w-full text-[10px]">
          <div className="flex items-center gap-1">
            <Flag className="h-3 w-3 text-red-600 dark:text-red-400" />
            <span className="text-gray-600 dark:text-gray-300">{country}</span>
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
