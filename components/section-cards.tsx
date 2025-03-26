import { IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface DashboardStats {
  totalAthletes: {
    value: number
  }
  divisionStats: {
    division: string
    count: number
    percentage: string
  }[]
  poundForPoundRankings: {
    male: {
      name: string
      weightDivision: string
      country: string
      poundForPoundRank: number
      wins: number
      losses: number
      winRate: string
    } | null
    female: {
      name: string
      weightDivision: string
      country: string
      poundForPoundRank: number
      wins: number
      losses: number
      winRate: string
    } | null
  }
  recentAthletes: {
    name: string
    weightDivision: string
    country: string
    createdAt: string
  }[]
  recentlyRetiredAthletes: {
    name: string
    weightDivision: string
    country: string
    updatedAt: string
    wins: number
    losses: number
    winRate: string
  }[]
}

interface SectionCardsProps {
  stats: DashboardStats
}

export function SectionCards({ stats }: SectionCardsProps) {
  // Calculate month-over-month growth
  const totalAthletes = stats.totalAthletes.value
  const recentAthletesCount = stats.recentAthletes.length
  const recentlyRetiredCount = stats.recentlyRetiredAthletes.length
  const { male, female } = stats.poundForPoundRankings

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-3 @5xl/main:grid-cols-5">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Athletes</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalAthletes}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              {recentAthletesCount} new
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {recentAthletesCount} new athletes this period <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Growing athlete roster
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Men&apos;s P4P #1</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {male?.name || 'No #1 Ranked'}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              {male?.winRate || '0'}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {male ? `${male.wins} wins, ${male.losses} losses` : 'No data'} <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            {male?.weightDivision || 'No division'} division
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Women&apos;s P4P #1</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {female?.name || 'No #1 Ranked'}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              {female?.winRate || '0'}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {female ? `${female.wins} wins, ${female.losses} losses` : 'No data'} <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            {female?.weightDivision || 'No division'} division
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Recent Activity</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {recentAthletesCount}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              New
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Latest: {stats.recentAthletes[0]?.name} <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Recent athlete additions
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Recently Retired</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {recentlyRetiredCount}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              Retired
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Latest: {stats.recentlyRetiredAthletes[0]?.name}
          </div>
          <div className="text-muted-foreground">
            {stats.recentlyRetiredAthletes[0]?.winRate}% win rate
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
