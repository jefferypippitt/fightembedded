import { AthletesContent } from './athletes-content'
import { Suspense } from 'react'
import { AthletesGridSkeleton } from '@/components/athlete-skeleton'
import { getAthletes } from '@/server/actions/get-athlete'
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Athletes | Fight Embedded",
  description: "View all active athletes in the Fight Embedded database.",
}

export const dynamic = 'force-dynamic'

export default async function AthletesPage() {
 
  const athletes = await getAthletes()

  return (
    <Suspense fallback={<AthletesGridSkeleton count={12} />}>
      <AthletesContent athletes={athletes} />
    </Suspense>
  );
}
