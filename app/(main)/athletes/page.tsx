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
      <AthletesSearchContainer
        athletes={athletes}
        placeholder="Search athletes by name, country, or division..."
      />
    </div>
  );
}
