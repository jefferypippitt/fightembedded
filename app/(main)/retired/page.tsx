import { getRetiredAthletes } from "@/server/actions/athlete";
import { Metadata } from "next";
import { AthletesList } from "@/components/athletes-list";

// Use static rendering with weekly revalidation - same as athletes page
export const dynamic = "force-static";
export const revalidate = 604800; // Cache for 1 week (same as athletes page)

export const metadata: Metadata = {
  title: "Retired Athletes",
  description: "Browse all retired UFC fighters and their career statistics",
  openGraph: {
    title: "Retired Athletes | Fight Embedded",
    description:
      "View detailed statistics and career records of retired UFC fighters. Get comprehensive analytics and performance data.",
    type: "website",
    siteName: "Fight Embedded",
  },
  twitter: {
    card: "summary",
    title: "Retired Athletes | Fight Embedded",
    description:
      "Complete stats and career records of retired UFC athletes. Access detailed performance metrics and analytics.",
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
      <AthletesList
        athletes={athletes}
        emptyMessage="No retired athletes found."
        disableCursor={true}
      />
    </div>
  );
}
