"use client";

import * as React from "react";
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
  CartesianGrid,
  Rectangle,
} from "recharts";
import { DivisionRankings } from "@/server/actions/get-top-5-athletes";
import { weightClasses } from "@/data/weight-class";

interface DivisionRankingsGridProps {
  maleDivisions: DivisionRankings[];
  femaleDivisions: DivisionRankings[];
}

const chartConfig = {
  followers: {
    label: "Followers",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

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

export function DivisionRankingsGrid({
  maleDivisions,
  femaleDivisions,
}: DivisionRankingsGridProps) {
  return (
    <div className="space-y-8">
      {/* Male Divisions Section */}
      {maleDivisions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {maleDivisions.map((divisionData) => (
            <Card key={divisionData.division}>
              <CardHeader>
                <CardTitle>{divisionData.division}</CardTitle>
                <CardDescription>
                  {getDivisionWeight(divisionData.division)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DivisionChartData divisionData={divisionData} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Female Divisions Section */}
      {femaleDivisions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {femaleDivisions.map((divisionData) => (
            <Card key={divisionData.division}>
              <CardHeader>
                <CardTitle>{divisionData.division}</CardTitle>
                <CardDescription>
                  {getDivisionWeight(divisionData.division)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DivisionChartData divisionData={divisionData} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export function DivisionChartData({
  divisionData,
}: {
  divisionData?: DivisionRankings;
}) {
  const chartData = React.useMemo(() => {
    if (!divisionData) return [];

    const data = divisionData.athletes.map((athlete) => ({
      name: athlete.name,
      followers: athlete.followers,
      rank: athlete.rank,
      fill: getRankColor(athlete.rank),
    }));

    // Sort by rank to ensure consistent ordering
    data.sort((a, b) => a.rank - b.rank);
    return data;
  }, [divisionData]);

  const activeIndex = React.useMemo(() => {
    if (chartData.length === 0) return 0;
    // Find the athlete with most followers
    const maxFollowers = Math.max(...chartData.map((d) => d.followers));
    return chartData.findIndex((d) => d.followers === maxFollowers);
  }, [chartData]);

  // Calculate responsive width based on longest athlete name
  const yAxisWidth = React.useMemo(() => {
    if (chartData.length === 0) return 140;
    const maxNameLength = Math.max(
      ...chartData.map((athlete) => athlete.name.length)
    );
    return Math.min(Math.max(140, maxNameLength * 5 + 40), 200);
  }, [chartData]);

  if (!divisionData || chartData.length === 0) {
    return (
      <div className="text-muted-foreground text-sm">No data available</div>
    );
  }

  return (
    <ChartContainer
      config={chartConfig}
      className="aspect-auto h-[300px] w-full overflow-x-auto"
    >
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{
          left: 0,
          right: 12,
          top: 5,
          bottom: 5,
        }}
      >
        <CartesianGrid horizontal={false} vertical={true} />
        <XAxis
          type="number"
          tickMargin={8}
          axisLine={false}
          tickLine={false}
          tickFormatter={(value) => value.toLocaleString()}
          tick={{ fontSize: 9 }}
          className="text-[9px] sm:text-[10px]"
        />
        <YAxis
          dataKey="name"
          type="category"
          tickLine={false}
          tickMargin={8}
          axisLine={false}
          width={yAxisWidth}
          interval={0}
          tickFormatter={(value, index) => `${chartData[index].rank}. ${value}`}
          tick={{ fontSize: 9 }}
          className="text-[9px] sm:text-[10px]"
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
