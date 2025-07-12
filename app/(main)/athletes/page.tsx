import { getAthletes } from "@/server/actions/get-athlete";
import { Metadata } from "next";
import { AthletesContent } from "./athletes-content";

export const metadata: Metadata = {
  title: "Athletes | Fight Embedded",
  description: "View all active athletes in the Fight Embedded database.",
};

// Use static rendering with weekly revalidation - following Next.js best practices
export const dynamic = "force-static";
export const revalidate = 604800; // Cache for 1 week

export default async function AthletesPage() {
  const athletes = await getAthletes();

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
          All UFC Athletes
        </h1>
      </div>

      <AthletesContent athletes={athletes} />
    </div>
  );
}
