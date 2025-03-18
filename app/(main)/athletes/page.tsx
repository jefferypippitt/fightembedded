import { Badge } from "@/components/ui/badge"
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
    <main className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="space-y-6">
        <div className="flex justify-center mb-6">
          <Badge
            variant="outline"
            className="px-3 py-0.5 text-base sm:text-lg bg-red-500/10 text-red-600 dark:text-red-400 border-red-600/20 dark:border-red-500/30 capitalize font-medium"
          >
            All UFC Athletes
          </Badge>
        </div>

        <AthletesClient searchParams={params} athletes={athletes} />
      </div>
    </main>
  )
}
