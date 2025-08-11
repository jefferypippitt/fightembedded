import { Metadata } from "next";
import { AthletesSearchContainer } from "@/components/athletes-search";
import { getAthletes } from "@/server/actions/athlete";

export const metadata: Metadata = {
  title: "All UFC Athletes",
  description: "Search and compare UFC athletes by name, country, or division.",
};

export default async function AthletesPage() {
  const athletes = await getAthletes();

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center space-y-2">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
          All UFC Athletes
        </h1>
      </div>

      <AthletesSearchContainer
        athletes={athletes}
        placeholder="Search athletes by name, country, or division..."
      />
    </div>
  );
}
