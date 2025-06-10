import { getRetiredAthletes } from '@/server/actions/athlete'
import { RetiredContent } from './retired-content'
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Retired Athletes",
  description: "Browse retired UFC fighters and their career statistics",
  openGraph: {
    title: "Retired Athletes | Fight Embedded",
    description: "View detailed statistics and career records of retired UFC fighters. Get comprehensive analytics and performance data.",
    type: "website",
    siteName: "Fight Embedded",
  },
  twitter: {
    card: "summary",
    title: "Retired Athletes | Fight Embedded",
    description: "Complete stats and career records of retired UFC athletes. Access detailed performance metrics and analytics.",
  },
};

export default async function RetiredPage() {
  const athletes = await getRetiredAthletes();

  return (
    <div className="space-y-6">
      <div className="flex justify-center mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white capitalize tracking-tight">
          Retired Athletes
        </h1>
      </div>
      <RetiredContent athletes={athletes} />
    </div>
  );
}

