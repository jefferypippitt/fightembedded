import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar,  AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Flag } from "lucide-react";

interface AthleteCardProps {
  name: string;
  division: string;
  gender: string;
  imageUrl?: string;
  country: string;
  wins?: number;
  losses?: number;
  draws?: number;
  winsByKo?: number;
  winsBySubmission?: number;
  followers?: number;
  rank?: number;
  poundForPoundRank?: number;
  isChampion?: boolean;
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
}: AthleteCardProps) {
  const record = `${wins}-${losses}${draws > 0 ? `-${draws}` : ""}`;
  const totalFights = wins + losses + draws;
  const winRate = totalFights > 0 ? (wins / totalFights) * 100 : 0;
  const koRate = wins > 0 ? (winsByKo / wins) * 100 : 0;
  const submissionRate = wins > 0 ? (winsBySubmission / wins) * 100 : 0;

  return (
    <Card className="overflow-hidden h-64">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <Badge variant="secondary" className="text-xs">
            {division}
          </Badge>
          {isChampion ? (
            <Trophy className="h-4 w-4 text-yellow-500" />
          ) : (
            poundForPoundRank > 0 && (
              <span className="text-xs font-medium">
                P4P #{poundForPoundRank}
              </span>
            )
          )}
        </div>
        <div className="flex items-center space-x-4 mb-3">
          <Avatar className="h-16 w-16 rounded-full">
            <AvatarImage
              src={imageUrl}
              alt={name}
              className="object-cover aspect-square"
            />
           
          </Avatar>
          <div>
            <h3 className="font-semibold text-sm">{name}</h3>
            <div className="flex items-center gap-2">
              <p className="text-xs text-muted-foreground">{record}</p>
              <div className="flex items-center gap-1">
                <Flag className="h-3 w-3" />
                <span className="text-xs text-muted-foreground">{country}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between items-center">
            <span>Win Rate</span>
            <span className="font-medium">{winRate.toFixed(1)}%</span>
          </div>
          <Progress value={winRate} className="h-1" />

          <div className="flex justify-between items-center">
            <span>KO/TKO</span>
            <span className="font-medium">{koRate.toFixed(1)}%</span>
          </div>
          <Progress value={koRate} className="h-1" />

          <div className="flex justify-between items-center">
            <span>Submission</span>
            <span className="font-medium">{submissionRate.toFixed(1)}%</span>
          </div>
          <Progress value={submissionRate} className="h-1" />
        </div>
      </CardContent>
      <CardFooter />
    </Card>
  );
}
