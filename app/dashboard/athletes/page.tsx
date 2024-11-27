import { getAthletes } from "@/server/actions/athlete"
import AthletesTable from "./athletes-table"

export default async function DashboardAthletesPage() {
  const athletes = await getAthletes()
  
  return <AthletesTable athletes={athletes} />
}
