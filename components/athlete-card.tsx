import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trophy, Flag } from 'lucide-react'

interface AthleteCardProps {
  name: string
  division: string
  gender: string
  record: string
  imageUrl: string
  country: string
  winRate: number
  koTkoRate?: number
  submissionRate?: number
  isChampion?: boolean
  p4pRank?: number
  rank?: number
  wins?: number
  losses?: number
  draws?: number
}

export function AthleteCard({ 
  name, 
  division,
  imageUrl, 
  country, 
  winRate,
  koTkoRate,
  submissionRate,
  isChampion = false,
  p4pRank,
  wins = 0,
  losses = 0,
  draws = 0,
}: AthleteCardProps) {
  const record = `${wins}-${losses}${draws > 0 ? `-${draws}` : ''}`;

  return (
    <Card className="overflow-hidden h-64">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <Badge variant="secondary" className="text-xs">{division}</Badge>
          {isChampion ? (
            <Trophy className="h-4 w-4 text-yellow-500" />
          ) : (
            p4pRank && <span className="text-xs font-medium">P4P #{p4pRank}</span>
          )}
        </div>
        <div className="flex items-center space-x-4 mb-3">
          <Avatar className="h-16 w-16">
            <AvatarImage src={imageUrl} alt={name} />
            <AvatarFallback>{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
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
            <span className="font-medium">{winRate}%</span>
          </div>
          <Progress value={winRate} className="h-1" />
          
          {isChampion && (
            <>
              <div className="flex justify-between items-center">
                <span>KO/TKO</span>
                <span className="font-medium">{koTkoRate}%</span>
              </div>
              <Progress value={koTkoRate} className="h-1" />
              
              <div className="flex justify-between items-center">
                <span>Submission</span>
                <span className="font-medium">{submissionRate}%</span>
              </div>
              <Progress value={submissionRate} className="h-1" />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}