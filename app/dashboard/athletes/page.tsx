import { getAthletes } from "@/server/actions/athlete"
import AthletesTable from "./athletes-table"
import { Athlete } from "@/types/athlete"

export default async function DashboardAthletesPage() {
  const athletes = await getAthletes()
  
  return <AthletesTable athletes={athletes as Athlete[]} />
}
