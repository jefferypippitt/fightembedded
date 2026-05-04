import { RankingsPageHeader } from "@/components/rankings-page-header";
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
      <RankingsPageHeader>
        <h1 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl tracking-tighter">
          Top 20 Athletes By <span className="text-primary">Popularity</span>
        </h1>
      </RankingsPageHeader>
      <FighterPopularityChart
        maleAthletes={maleChartData}
        femaleAthletes={femaleChartData}
      />
    </section>
  );
}
