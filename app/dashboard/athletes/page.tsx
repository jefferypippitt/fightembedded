import { getAthletesForDashboard } from "@/server/actions/athlete"
import { getUndefeatedAthletesForDashboard } from "@/server/actions/athlete"
import { getRetiredAthletesForDashboard } from "@/server/actions/athlete"
import { AthletesDataTable } from "./athletes-data-table"
import { SiteHeader } from "@/components/site-header"

export default async function DashboardAthletesPage() {
  const athletes = await getAthletesForDashboard()
  const undefeatedAthletes = await getUndefeatedAthletesForDashboard()
  const retiredAthletes = await getRetiredAthletesForDashboard()
  
  return (
    <div className="flex flex-col gap-6">
      <SiteHeader title="Athletes" />
      <AthletesDataTable 
        athletes={athletes} 
        undefeatedAthletes={undefeatedAthletes}
        retiredAthletes={retiredAthletes}
      />
    </div>
  )
}
