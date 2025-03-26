import { getAthletes } from "@/server/actions/athlete"
import { getUndefeatedAthletes } from "@/server/actions/athlete"
import { getRetiredAthletes } from "@/server/actions/athlete"
import { AthletesDataTable } from "./athletes-data-table"
import { SiteHeader } from "@/components/site-header"

export default async function DashboardAthletesPage() {
  const athletes = await getAthletes()
  const undefeatedAthletes = await getUndefeatedAthletes()
  const retiredAthletes = await getRetiredAthletes()
  
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
