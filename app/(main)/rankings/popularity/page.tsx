import { getTop20Athletes } from "@/server/actions/get-top-20-athletes";
import { FighterPopularityChart } from "./fighter-popularity-chart";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Popularity",
  description: "Top 20 Athletes by Popularity",
};

export const dynamic = "force-static";
export const revalidate = 604800;

export default async function DivisionRankingsPage() {
  const top20Athletes = await getTop20Athletes();

  const maleChartData = top20Athletes.maleAthletes.map((athlete) => ({
    name: athlete.name,
    male: athlete.followers,
    female: 0,
    gender: "MALE" as const,
    index: 0,
  }));

  const femaleChartData = top20Athletes.femaleAthletes.map((athlete) => ({
    name: athlete.name,
    male: 0,
    female: athlete.followers,
    gender: "FEMALE" as const,
    index: 0,
  }));

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
          Top 20 Athletes by Popularity
        </h1>
      </div>
      <FighterPopularityChart
        maleAthletes={maleChartData}
        femaleAthletes={femaleChartData}
      />
    </div>
  );
}
