import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Flag } from "lucide-react"

interface AthleteListCardProps {
  name: string
  weightDivision: string
  imageUrl?: string
  country: string
  wins?: number
  losses?: number
  draws?: number
  winsByKo?: number
  winsBySubmission?: number
  rank?: number
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
}: AthleteListCardProps) {
  const record = `${wins}-${losses}${draws > 0 ? `-${draws}` : ""}`
  const totalFights = wins + losses + draws
  const winRate = totalFights > 0 ? (wins / totalFights) * 100 : 0

  return (
    <Card className="hover:bg-accent/50 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage
              src={imageUrl}
              alt={name}
              className="object-cover"
            />
            <AvatarFallback>
              {name.split(" ").map((n) => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-2 flex-1">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{name}</h3>
                {rank && <span className="text-sm font-medium">#{rank}</span>}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="secondary" className="text-xs">
                  {weightDivision}
                </Badge>
                <div className="flex items-center gap-1">
                  <Flag className="h-3 w-3" />
                  <span className="text-xs">{country}</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Record</p>
                <p className="font-medium">{record}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Win Rate</p>
                <div className="flex items-center gap-2">
                  <Progress value={winRate} className="h-2 w-16" />
                  <span className="font-medium">{winRate.toFixed(0)}%</span>
                </div>
              </div>
              <div>
                <p className="text-muted-foreground">Finishes</p>
                <p className="font-medium">{winsByKo + winsBySubmission}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 