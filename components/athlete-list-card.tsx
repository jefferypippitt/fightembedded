import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Flag} from "lucide-react";
import { Progress } from "@/components/ui/progress";

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
}

export function AthleteListCard({
  name,
  weightDivision,
  imageUrl = "/default-avatar.png",
  country,
  wins = 0,
  losses = 0,
  draws = 0,
  winsByKo = 0,
  winsBySubmission = 0,
  rank,
  followers = 0,
}: AthleteListCardProps) {
  const record = `${wins}-${losses}${draws > 0 ? `-${draws}` : ""}`;
  const totalFights = wins + losses + draws;
  const winRate = totalFights > 0 ? (wins / totalFights) * 100 : 0;
  const koRate = wins > 0 ? (winsByKo / wins) * 100 : 0;
  const submissionRate = wins > 0 ? (winsBySubmission / wins) * 100 : 0;

  return (
    <Card className="hover:bg-accent/50 transition-colors">
      <CardContent className="p-3">
        {/* Top Badges */}
        <div className="flex justify-between items-center mb-3">
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
            {weightDivision}
          </Badge>
          {rank && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
              #{rank}
            </Badge>
          )}
        </div>

        {/* Avatar and Name Section */}
        <div className="flex flex-col items-center mb-3">
          <Avatar className="h-16 w-16 rounded-full ring-1 ring-gray-300">
            <AvatarImage
              src={imageUrl}
              alt={name}
              className="object-cover"
            />
          </Avatar>
          
          <div className="text-center">
            <h3 className="font-semibold text-sm">{name}</h3>
            <h4 className="text-xs font-medium text-muted-foreground">{record}</h4>
          </div>
        </div>
        
        {/* Stats with Progress Bars */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-muted-foreground">Win Rate</span>
            <span className="font-medium">{winRate.toFixed(1)}%</span>
          </div>
          <Progress value={winRate} className="h-1" />

          <div className="flex justify-between items-center text-[10px]">
            <span className="text-muted-foreground">KO/TKO</span>
            <span className="font-medium">{koRate.toFixed(1)}%</span>
          </div>
          <Progress value={koRate} className="h-1" />

          <div className="flex justify-between items-center text-[10px]">
            <span className="text-muted-foreground">Submission</span>
            <span className="font-medium">{submissionRate.toFixed(1)}%</span>
          </div>
          <Progress value={submissionRate} className="h-1" />
        </div>
      </CardContent>

      <CardFooter className="px-3 py-2 border-t">
        <div className="flex items-center justify-between w-full text-[10px]">
          <div className="flex items-center gap-1">
            <Flag className="h-3 w-3" />
            <span className="text-muted-foreground">{country}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">Followers:</span>
            <span className="font-medium">{followers.toLocaleString()}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}