import { IconTrendingUp, IconCalendarEvent, IconChartBar, IconFlag, IconStar, IconUsers, IconTrendingDown } from "@tabler/icons-react"
import { getAllUpcomingEvents } from "@/server/actions/get-all-events"
import { format } from "date-fns"

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
    updatedAt: string
    wins: number
    losses: number
    winRate: string
  }[]
  totalEvents: number
  topCountries: {
    country: string
    count: number
  }[]
  totalChampions: number
  mostFollowedAthlete: {
    name: string
    weightDivision: string
    country: string
    followers: number
    wins: number
    losses: number
    winRate: string
  } | null
}

interface SectionCardsProps {
  stats: DashboardStats
}

export async function SectionCards({ stats }: SectionCardsProps) {
  const events = await getAllUpcomingEvents()
  const nextEvent = events[0]

  // Calculate month-over-month growth
  const totalAthletes = stats.totalAthletes.value
  const recentAthletesCount = stats.recentAthletes.length
  const recentlyRetiredCount = stats.recentlyRetiredAthletes.length
  const { male, female } = stats.poundForPoundRankings

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Events</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.totalEvents.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconCalendarEvent className="size-3.5" />
              All Time
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Total Events <IconCalendarEvent className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Historical event count
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Next Event</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {nextEvent ? format(new Date(nextEvent.date), "MMM d, yyyy") : 'No Events'}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconCalendarEvent className="size-3.5" />
              {nextEvent?.mainEvent || 'TBD'}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {nextEvent?.name || 'No upcoming events'} <IconCalendarEvent className="size-4" />
          </div>
          <div className="text-muted-foreground">
            {nextEvent ? `${nextEvent.venue || 'TBD'} • ${nextEvent.location}` : 'Check back soon'}
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>#1 Country</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.topCountries[0]?.country || 'N/A'}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconFlag className="size-3.5" />
              {stats.topCountries[0]?.count || 0} athletes
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Leading nation <IconFlag className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Most represented country
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>#2 Country</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.topCountries[1]?.country || 'N/A'}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconFlag className="size-3.5" />
              {stats.topCountries[1]?.count || 0} athletes
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Second place <IconFlag className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Strong representation
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>#3 Country</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.topCountries[2]?.country || 'N/A'}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconFlag className="size-3.5" />
              {stats.topCountries[2]?.count || 0} athletes
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Third place <IconFlag className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Growing presence
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Champions</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.totalChampions.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconStar className="size-3.5" />
              Active
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Division Champions <IconStar className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Across all weight classes
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Most Followed</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.mostFollowedAthlete?.name || 'N/A'}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconStar className="size-3.5" />
              {stats.mostFollowedAthlete?.followers.toLocaleString() || 0} followers
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {stats.mostFollowedAthlete ? `${stats.mostFollowedAthlete.wins} wins, ${stats.mostFollowedAthlete.losses} losses` : 'No data'} <IconStar className="size-4" />
          </div>
          <div className="text-muted-foreground">
            {stats.mostFollowedAthlete?.weightDivision || 'No division'} division
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Athletes</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalAthletes.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconUsers className="size-3.5" />
              {recentAthletesCount} new
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Latest: {stats.recentAthletes[0]?.name || 'No recent additions'} <IconUsers className="size-4" />
          </div>
          <div className="text-muted-foreground">
            All athletes (active & retired)
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
              <IconChartBar className="size-3.5" />
              {male?.winRate || '0'}% WR
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {male ? `${male.wins} wins, ${male.losses} losses` : 'No data'} <IconChartBar className="size-4" />
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
              <IconChartBar className="size-3.5" />
              {female?.winRate || '0'}% WR
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {female ? `${female.wins} wins, ${female.losses} losses` : 'No data'} <IconChartBar className="size-4" />
          </div>
          <div className="text-muted-foreground">
            {female?.weightDivision || 'No division'} division
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
              <IconTrendingDown className="size-3.5" />
              Retired
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Latest: {stats.recentlyRetiredAthletes[0]?.name || 'No recent retirements'} <IconTrendingDown className="size-4" />
          </div>
          <div className="text-muted-foreground">
            {stats.recentlyRetiredAthletes[0]?.winRate || '0'}% win rate
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
              <IconTrendingUp className="size-3.5" />
              New
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Latest: {stats.recentAthletes[0]?.name || 'No recent activity'} <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Recent athlete additions
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
