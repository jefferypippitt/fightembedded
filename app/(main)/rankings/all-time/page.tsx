import { Metadata } from "next";
import { getAllAthletesPopularity } from "@/server/actions/get-all-athletes-popularity";
import { FighterPopularityChart } from "../popularity/fighter-popularity-chart";

export const metadata: Metadata = {
  title: "All-Time Popularity",
  description: "All UFC athletes ranked by social media followers, including active and retired fighters.",
};

export default async function AllTimePopularityPage() {
  const { maleAthletes, femaleAthletes } = await getAllAthletesPopularity();

  const maleChartData = maleAthletes.map((athlete) => ({
    name: athlete.name,
    male: athlete.followers,
    female: 0,
    gender: "MALE" as const,
    index: 0,
  }));

  const femaleChartData = femaleAthletes.map((athlete) => ({
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
            All Time Popularity
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
