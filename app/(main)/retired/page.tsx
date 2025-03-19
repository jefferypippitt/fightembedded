import { getRetiredAthletes } from '@/server/actions/get-retired-athletes'
import { RetiredContent } from './retired-content'
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Retired Athletes",
  description: "Browse retired UFC fighters and their career statistics",
}

export default async function RetiredAthletesPage() {
  const retiredAthletes = await getRetiredAthletes()
  return <RetiredContent athletes={retiredAthletes} />
}
