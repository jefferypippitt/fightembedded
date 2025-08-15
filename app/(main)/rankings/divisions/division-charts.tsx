"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Rectangle,
  CartesianGrid,
} from "recharts";
import { DivisionRankings } from "@/server/actions/get-top-5-athletes";
import { weightClasses } from "@/data/weight-class";

const getRankColor = (rank: number): string => {
  const colors = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
  ];
  return colors[rank - 1] || colors[4];
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

const transformAthleteData = (athletes: DivisionRankings["athletes"]) => {
  const data = athletes.map((athlete) => ({
    name: athlete.name,
    followers: athlete.followers,
    rank: athlete.rank,
    fill: getRankColor(athlete.rank),
  }));

  // Sort by rank to ensure consistent ordering (rank 1 first)
  data.sort((a, b) => a.rank - b.rank);

  // Find the athlete with most followers (deterministic calculation)
  const maxFollowers = Math.max(...data.map((d) => d.followers));
  const activeIndex = data.findIndex((d) => d.followers === maxFollowers);

  return { data, activeIndex };
};

const chartConfig = {
  followers: {
    label: "Followers",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function DivisionCharts({
  divisions,
  divisionRankings,
}: {
  divisions: string[];
  divisionRankings: DivisionRankings[];
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
      {divisions.map((division) => {
        const divisionData = divisionRankings.find(
          (d) => d.division === division
        );
        return (
          <Card key={division}>
            <CardHeader>
              <CardTitle>{division}</CardTitle>
              <CardDescription>{getDivisionWeight(division)}</CardDescription>
            </CardHeader>
            <CardContent>
              <DivisionChartData divisionData={divisionData} />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function DivisionChartData({
  divisionData,
}: {
  divisionData?: DivisionRankings;
}) {
  if (!divisionData) {
    return (
      <div className="text-muted-foreground text-sm">No data available</div>
    );
  }

  const { data: chartData, activeIndex } = transformAthleteData(
    divisionData.athletes
  );

  return (
    <ChartContainer
      config={chartConfig}
      className="aspect-auto h-[300px] w-full"
    >
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{
          left: 1,
          right: 5,
          top: 1,
          bottom: 1,
        }}
      >
        <CartesianGrid horizontal={false} vertical={true} />
        <XAxis
          type="number"
          axisLine={false}
          tickLine={false}
          tickFormatter={(value) => value.toLocaleString()}
        />
        <YAxis
          dataKey="name"
          type="category"
          tickLine={false}
          tickMargin={15}
          axisLine={false}
          width={140}
          interval={0}
          tickFormatter={(value, index) => `${chartData[index].rank}. ${value}`}
        />
        <ChartTooltip
          cursor={{ fill: "hsl(var(--muted))" }}
          content={
            <ChartTooltipContent
              className="w-[150px] bg-background border text-[10px]"
              nameKey="followers"
            />
          }
        />
        <Bar
          dataKey="followers"
          fill="var(--chart-1)"
          radius={[0, 4, 4, 0]}
          activeIndex={activeIndex}
          activeBar={({ ...props }) => (
            <Rectangle
              {...props}
              fillOpacity={0.8}
              stroke={props.payload.fill}
              strokeDasharray={4}
              strokeDashoffset={4}
            />
          )}
        />
      </BarChart>
    </ChartContainer>
  );
}
