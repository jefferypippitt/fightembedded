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
      <header className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Popularity Rankings
          </p>
          <h1 className="text-balance text-2xl font-semibold text-gray-900 dark:text-white sm:text-3xl">
            Top 5 Most Popular Athletes by Division
          </h1>
        </div>
      </header>
      <DivisionRankingsGrid
        maleDivisions={maleDivisions}
        femaleDivisions={femaleDivisions}
      />
    </section>
  );
}
