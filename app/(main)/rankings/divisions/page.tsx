import { Metadata } from "next";
import { getAllDivisions } from "@/data/weight-class";
import { getTop5Athletes } from "@/server/actions/get-top-5-athletes";
import { DivisionCharts } from "./division-charts";

export const metadata: Metadata = {
  title: "Division Rankings",
  description: "Top 5 Ranked Athletes by Follower Count",
};

export const dynamic = "force-static";
export const revalidate = 604800;

export default async function DivisionRankingsPage() {
  const divisions = getAllDivisions().map((division) => division.name);
  const divisionRankings = await getTop5Athletes();

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
          Top 5 Ranked Athletes
        </h1>
      </div>
      <DivisionCharts
        divisions={divisions}
        divisionRankings={divisionRankings}
      />
    </div>
  );
}
