import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
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
  followers?: number
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
  const record = `${wins}-${losses}${draws > 0 ? `-${draws}` : ""}`
  const totalFights = wins + losses + draws
  const winRate = totalFights > 0 ? (wins / totalFights) * 100 : 0

  return (
    <Card className="hover:bg-accent/50 transition-colors">
      <CardContent className="p-2.5">
        <div className="flex items-center gap-2.5">
          <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
            <AvatarImage
              src={imageUrl}
              alt={name}
              className="object-cover"
            />
            <AvatarFallback>
              {name.split(" ").map((n) => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold truncate text-sm">{name}</h3>
                  {rank && <span className="text-xs font-medium">#{rank}</span>}
                </div>
                <div className="flex items-center gap-1.5">
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                    {weightDivision}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Flag className="h-3 w-3" />
                    <span className="text-[10px] text-muted-foreground">{country}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Record:</span>
                <span className="font-medium">{record}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Followers:</span>
                <span className="font-medium">{followers.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Win Rate:</span>
                <span className="font-medium">{winRate.toFixed(0)}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Finishes:</span>
                <span className="font-medium">{winsByKo + winsBySubmission}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 