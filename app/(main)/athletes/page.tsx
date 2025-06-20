import { Suspense } from 'react'
import { AthletesGridSkeleton } from '@/components/athlete-skeleton'
import { getAthletes } from '@/server/actions/get-athlete'
import { Metadata } from "next"
import { AthletesContent } from './athletes-content'

export const metadata: Metadata = {
  title: "Athletes | Fight Embedded",
  description: "View all active athletes in the Fight Embedded database.",
}

// Use static rendering with shorter revalidation for athletes page
export const dynamic = 'force-static'
export const revalidate = 604800 // Cache for 1 week

export default async function AthletesPage() {
  const athletes = await getAthletes()

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
          All UFC Athletes
        </h1>
      </div>

      <Suspense fallback={<AthletesGridSkeleton count={12} />}>
        <AthletesContent athletes={athletes} />
      </Suspense>
    </div>
  );
}
