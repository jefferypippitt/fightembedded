import { getTop5Athletes } from "@/server/actions/get-top-5-athletes";
import { DivisionChart } from "./division-chart";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rankings",
  description: "Top 5 Ranked Athletes By Division",
};


export default async function DivisionRankingsPage() {
  const divisionRankings = await getTop5Athletes();

  return (
    <main className="max-w-7xl mx-auto px-2 py-4 space-y-2">
      <h1 className="text-xl font-bold text-center mb-4">Ranked Athletes By Division</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {divisionRankings.map((division) => (
          <DivisionChart key={division.division} division={division} />
        ))}
      </div>
    </main>
  );
}
