"use client";
import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DivisionChartSkeleton } from "./division-chart-skeleton";
import {
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

// Helper functions
const getRankColor = (rank: number): string => {
  const colors = [
    "var(--chart-1)", // 1st place
    "var(--chart-2)", // 2nd place
    "var(--chart-3)", // 3rd place
    "var(--chart-4)", // 4th place
    "var(--chart-5)", // 5th place
  ];
  return colors[rank - 1] || colors[4];
};

type ChartDataItem = {
  name: string;
  followers: number;
  rank: number;
  fill: string;
};

const formatAthleteLabel = (
  value: string,
  index: number,
  chartData: ChartDataItem[]
) => {
  const athlete = chartData[index];
  return `${athlete.rank}. ${value}`;
};

const transformAthleteData = (athletes: DivisionRankings["athletes"]) => {
  const transformedData = athletes.map((athlete) => ({
    name: athlete.name,
    followers: athlete.followers,
    rank: athlete.rank,
    fill: getRankColor(athlete.rank),
  }));

  // Find the index of the athlete with the most followers
  const maxFollowersIndex = transformedData.reduce(
    (maxIndex, current, currentIndex) =>
      current.followers > transformedData[maxIndex].followers
        ? currentIndex
        : maxIndex,
    0
  );

  return { data: transformedData, activeIndex: maxFollowersIndex };
};

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
              <CardDescription>Top 5 Ranked Athletes</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<DivisionChartSkeleton />}>
                <DivisionChartData divisionData={divisionData} />
              </Suspense>
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

  const chartConfig = {
    followers: {
      label: "Followers",
      color: "var(--chart-1)",
    },
    label: {
      color: "var(--background)",
    },
  };

  const yAxisConfig = {
    dataKey: "name" as const,
    type: "category" as const,
    tickLine: false,
    tickMargin: 10,
    axisLine: false,
    width: 140,
    tick: {
      fill: "var(--color-foreground)",
      fontSize: "11px",
      fontWeight: 500,
      x: 0,
    },
  };

  return (
    <ChartContainer config={chartConfig}>
      <BarChart
        accessibilityLayer
        data={chartData}
        layout="vertical"
        margin={{ right: 16 }}
      >
        <CartesianGrid horizontal={false} vertical={true} />
        <YAxis
          {...yAxisConfig}
          tickFormatter={(value, index) =>
            formatAthleteLabel(value, index, chartData)
          }
        />
        <XAxis dataKey="followers" type="number" hide />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" />}
        />
        <Bar
          dataKey="followers"
          layout="vertical"
          radius={4}
          activeIndex={activeIndex} // Highlight the athlete with most followers
          activeBar={({ ...props }) => {
            return (
              <Rectangle
                {...props}
                fillOpacity={0.8}
                stroke={props.payload.fill}
                strokeDasharray={4}
                strokeDashoffset={4}
              />
            );
          }}
        />
      </BarChart>
    </ChartContainer>
  );
}
