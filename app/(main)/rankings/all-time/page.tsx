import { RankingsPageHeader } from "@/components/rankings-page-header";
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
      <RankingsPageHeader>
        <h1 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl tracking-tighter">
          All-Time <span className="text-primary">Popularity</span>
        </h1>
      </RankingsPageHeader>
      <FighterPopularityChart
        maleAthletes={maleChartData}
        femaleAthletes={femaleChartData}
      />
    </section>
  );
}
