import { getTop20Athletes } from "@/server/actions/get-top-20-athletes";
import { FighterPopularityChart } from "./fighter-popularity-chart";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Popularity",
  description: "Top 20 Athletes by Popularity",
};

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
    <section className="container space-y-6 pt-4 pb-6">
      <header className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Popularity Rankings
          </p>
          <h1 className="text-balance text-2xl font-semibold text-gray-900 dark:text-white sm:text-3xl">
            Top 20 Athletes by Popularity
          </h1>
        </div>
      </header>
      <FighterPopularityChart
        maleAthletes={maleChartData}
        femaleAthletes={femaleChartData}
      />
    </section>
  );
}
