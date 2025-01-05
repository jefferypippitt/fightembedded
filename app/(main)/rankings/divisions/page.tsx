import { getTop5Athletes } from "@/server/actions/get-top-5-athletes";
import { DivisionChart } from "./division-chart";
import { Metadata } from "next";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Rankings",
  description: "Top 5 Ranked Athletes By Division",
};

export default async function DivisionRankingsPage() {
  const divisionRankings = await getTop5Athletes();

  return (
    <main className="max-w-7xl mx-auto px-2 py-4 space-y-2">
      <div className="flex justify-center">
        <Badge
          variant="outline"
          className="px-3 py-0.5 text-base sm:text-lg bg-red-500/10 text-red-600 dark:text-red-400 border-red-600/20 dark:border-red-500/30 capitalize font-medium"
        >
          Ranked Athletes By Division
        </Badge>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {divisionRankings.map((division) => (
          <DivisionChart key={division.division} division={division} />
        ))}
      </div>
    </main>
  );
}
