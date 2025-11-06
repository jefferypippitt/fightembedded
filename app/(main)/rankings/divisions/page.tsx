import { Metadata } from "next";
import { getTop5Athletes } from "@/server/actions/get-top-5-athletes";
import { DivisionRankingsGrid } from "./division-charts";

export const metadata: Metadata = {
  title: "Division Rankings",
  description: "Top 5 Ranked Athletes by Division",
};

export default async function DivisionRankingsPage() {
  "use cache";
  const divisionRankings = await getTop5Athletes();

  // Separate male and female divisions
  const maleDivisions = divisionRankings.filter(
    (division) => !division.division.startsWith("Women's")
  );
  const femaleDivisions = divisionRankings.filter((division) =>
    division.division.startsWith("Women's")
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Top 5 Ranked Athletes
        </h1>
      </div>
      <DivisionRankingsGrid
        maleDivisions={maleDivisions}
        femaleDivisions={femaleDivisions}
      />
    </div>
  );
}
