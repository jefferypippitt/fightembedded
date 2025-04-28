import { IconTrendingUp, IconCalendarEvent, IconChartBar } from "@tabler/icons-react"
import { getAllUpcomingEvents } from "@/server/actions/get-all-events"
import { format } from "date-fns"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { HeartCrack } from "lucide-react"

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

export async function SectionCards({ stats }: SectionCardsProps) {
  const events = await getAllUpcomingEvents()
  const nextEvent = events[0]
  const totalEvents = events.length

  // Calculate month-over-month growth
  const totalAthletes = stats.totalAthletes.value
  const recentAthletesCount = stats.recentAthletes.length
  const recentlyRetiredCount = stats.recentlyRetiredAthletes.length
  const { male, female } = stats.poundForPoundRankings

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 px-4 lg:px-6">
      <Card className="flex flex-col justify-between min-h-[170px] p-3 rounded-lg shadow-sm bg-card @container/card">
        <CardHeader className="space-y-1.5">
          <CardDescription>Upcoming Events</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalEvents}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1.5">
              <IconCalendarEvent className="size-3.5" />
              <span className="truncate max-w-[120px]">Next: {nextEvent ? format(new Date(nextEvent.date), "MMM d") : "None"}</span>
            </Badge>
          </div>
          <div className="line-clamp-1 flex gap-2 font-medium">
            {nextEvent?.name || 'No upcoming events'}
          </div>
          <div className="text-muted-foreground">
            {nextEvent ? `${nextEvent.venue} • ${nextEvent.location}` : 'Check back soon'}
          </div>
        </CardFooter>
      </Card>
      <Card className="flex flex-col justify-between min-h-[170px] p-3 rounded-lg shadow-sm bg-card @container/card">
        <CardHeader className="space-y-1.5">
          <CardDescription>Total Athletes</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalAthletes}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1.5">
              <IconTrendingUp className="size-3.5" />
              <span className="truncate max-w-[120px]">{recentAthletesCount} new this period</span>
            </Badge>
          </div>
          <div className="line-clamp-1 flex gap-2 font-medium">
            Latest: {stats.recentAthletes[0]?.name}
          </div>
          <div className="text-muted-foreground">
            Growing athlete roster
          </div>
        </CardFooter>
      </Card>
      <Card className="flex flex-col justify-between min-h-[170px] p-3 rounded-lg shadow-sm bg-card @container/card">
        <CardHeader className="space-y-1.5">
          <CardDescription>Men&apos;s P4P #1</CardDescription>
          <CardTitle className="text-xl font-semibold @[250px]/card:text-2xl">
            {male?.name || 'No #1 Ranked'}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1.5">
              <IconChartBar className="size-3.5" />
              <span className="truncate max-w-[80px]">{male?.winRate || '0'}% WR</span>
            </Badge>
          </div>
          <div className="line-clamp-1 flex gap-2 font-medium">
            {male ? `${male.wins} wins, ${male.losses} losses` : 'No data'}
          </div>
          <div className="text-muted-foreground">
            {male?.weightDivision || 'No division'} division
          </div>
        </CardFooter>
      </Card>
      <Card className="flex flex-col justify-between min-h-[170px] p-3 rounded-lg shadow-sm bg-card @container/card">
        <CardHeader className="space-y-1.5">
          <CardDescription>Women&apos;s P4P #1</CardDescription>
          <CardTitle className="text-xl font-semibold @[250px]/card:text-2xl">
            {female?.name || 'No #1 Ranked'}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1.5">
              <IconChartBar className="size-3.5" />
              <span className="truncate max-w-[80px]">{female?.winRate || '0'}% WR</span>
            </Badge>
          </div>
          <div className="line-clamp-1 flex gap-2 font-medium">
            {female ? `${female.wins} wins, ${female.losses} losses` : 'No data'}
          </div>
          <div className="text-muted-foreground">
            {female?.weightDivision || 'No division'} division
          </div>
        </CardFooter>
      </Card>
      <Card className="flex flex-col justify-between min-h-[170px] p-3 rounded-lg shadow-sm bg-card @container/card">
        <CardHeader className="space-y-1.5">
          <CardDescription>Recent Activity</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {recentAthletesCount}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1.5">
              <IconTrendingUp className="size-3.5" />
              <span className="truncate max-w-[60px]">New</span>
            </Badge>
          </div>
          <div className="line-clamp-1 flex gap-2 font-medium">
            Latest: {stats.recentAthletes[0]?.name}
          </div>
          <div className="text-muted-foreground">
            Recent athlete additions
          </div>
        </CardFooter>
      </Card>
      <Card className="flex flex-col justify-between min-h-[170px] p-3 rounded-lg shadow-sm bg-card @container/card">
        <CardHeader className="space-y-1.5">
          <CardDescription>Recently Retired</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {recentlyRetiredCount}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1.5">
            <HeartCrack className="size-3.5" />
              <span className="truncate max-w-[80px]">Retired</span>
            </Badge>
          </div>
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
