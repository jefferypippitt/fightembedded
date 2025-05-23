import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { getDashboardStats } from "@/server/actions/get-dashboard-stats"
import { getDivisionStats } from "@/server/actions/get-division-stats"


export default async function Page() {
  const [baseStats, rawDivisionStats] = await Promise.all([
    getDashboardStats(),
    getDivisionStats()
  ])

  // Transform division stats to match the expected format
  const divisionStats = rawDivisionStats.map(division => ({
    division: division.name,
    count: division.data[division.data.length - 1]?.count || 0,
    percentage: ((division.data[division.data.length - 1]?.count || 0) / baseStats.totalAthletes.value * 100).toFixed(1) + '%'
  }))

  const dashboardStats = {
    ...baseStats,
    divisionStats
  }

  return (
    <>
      <SiteHeader title="Dashboard Overview" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards stats={dashboardStats} />
            <div className="px-4 lg:px-6">
              <ChartAreaInteractive data={rawDivisionStats} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
