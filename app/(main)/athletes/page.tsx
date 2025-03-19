import { AthletesClient } from "./athletes-client"
import { getAthletes } from "@/server/actions/athlete"

export const metadata = {
  title: "Athletes",
  description: "All UFC Athletes",
}

export default async function AthletesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const [athletes, params] = await Promise.all([
    getAthletes(),
    searchParams
  ])

  return (
    <div className="space-y-6">
      <div className="flex justify-center mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
          All UFC Athletes
        </h1>
      </div>

      <AthletesClient searchParams={params} athletes={athletes} />
    </div>
  )
}
