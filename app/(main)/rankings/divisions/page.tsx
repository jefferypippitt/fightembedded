import { RankingsPageHeader } from "@/components/rankings-page-header";
import { Metadata } from "next";
import { getTop5Athletes } from "@/server/actions/get-top-5-athletes";
import { DivisionRankingsGrid } from "./division-charts";

export const metadata: Metadata = {
  title: "Division Popularity",
  description: "Top 5 Most Popular Athletes by Division",
};

export default async function DivisionRankingsPage() {
  const divisionRankings = await getTop5Athletes();

  // Separate male and female divisions
  const maleDivisions = divisionRankings.filter(
    (division) => !division.division.startsWith("Women's")
  );
  const femaleDivisions = divisionRankings.filter((division) =>
    division.division.startsWith("Women's")
  );

  return (
    <section className="container space-y-6 pt-4 pb-6">
      <RankingsPageHeader>
        <h1 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl tracking-tighter">
          Top 5 Ranked <span className="text-primary">Athletes</span>
        </h1>
      </RankingsPageHeader>
      <DivisionRankingsGrid
        maleDivisions={maleDivisions}
        femaleDivisions={femaleDivisions}
      />
    </section>
  );
}
