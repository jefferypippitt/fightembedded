import { Metadata } from "next";
import { Suspense } from "react";
import { getAllDivisions, weightClasses } from "@/data/weight-class";
import { getTop5Athletes } from "@/server/actions/get-top-5-athletes";
import { DivisionChartData } from "./division-charts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Division Rankings",
  description: "Top 5 Ranked Athletes by Follower Count",
};

const getDivisionWeight = (divisionName: string): string => {
  const baseDivisionName = divisionName.replace(/^(Men's|Women's)\s+/, "");

  const menDivision = weightClasses.men.find(
    (d) => d.name === baseDivisionName
  );
  if (menDivision?.weight) return `${menDivision.weight} lbs`;

  const womenDivision = weightClasses.women.find(
    (d) => d.name === baseDivisionName
  );
  if (womenDivision?.weight) return `${womenDivision.weight} lbs`;

  return "";
};

export default function DivisionRankingsPage() {
  const divisions = getAllDivisions();

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
          Top 5 Ranked Athletes
        </h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {divisions.map((division) => (
          <Card key={division.name}>
            <CardHeader>
              <CardTitle>{division.name}</CardTitle>
              <CardDescription>
                {getDivisionWeight(division.name)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div className="h-[300px] w-full" />}>
                <DivisionChartDataWrapper divisionName={division.name} />
              </Suspense>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

async function DivisionChartDataWrapper({
  divisionName,
}: {
  divisionName: string;
}) {
  const divisionRankings = await getTop5Athletes();
  const divisionData = divisionRankings.find(
    (d) => d.division === divisionName
  );

  return <DivisionChartData divisionData={divisionData} />;
}
