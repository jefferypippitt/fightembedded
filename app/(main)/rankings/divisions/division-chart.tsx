"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { DivisionRankings } from "@/server/actions/get-top-5-athletes";

const chartConfig = {
  followers: {
    label: "Followers",
  },
  athlete1: {
    label: "Rank #1",
    color: "hsl(var(--chart-1))",
  },
  athlete2: {
    label: "Rank #2",
    color: "hsl(var(--chart-2))",
  },
  athlete3: {
    label: "Rank #3",
    color: "hsl(var(--chart-3))",
  },
  athlete4: {
    label: "Rank #4",
    color: "hsl(var(--chart-4))",
  },
  athlete5: {
    label: "Rank #5",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

interface DivisionChartProps {
  division: DivisionRankings;
}

export function DivisionChart({ division }: DivisionChartProps) {
  const chartData = division.athletes.map((athlete) => ({
    name: `#${athlete.rank} ${athlete.name}`,
    followers: athlete.followers,
    rank: athlete.rank,
    fill: `hsl(var(--chart-${athlete.rank}))`,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">{division.division}</CardTitle>
        <CardDescription className="text-center">
          Top 5 Ranked Athletes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{
              left: 10,
              right: 10,
              top: 10,
              bottom: 10,
            }}
          >
            <CartesianGrid vertical={true} />
            <XAxis
              type="number"
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => value.toLocaleString()}
              fontSize={10}
              tickMargin={10}
            />
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              axisLine={false}
              width={150}
              interval={0}
            />
            <ChartTooltip
              cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
              content={
                <ChartTooltipContent
                  className="w-[250px]"
                  nameKey="followers"
                />
              }
            />
            <Bar
              dataKey="followers"
              radius={[0, 4, 4, 0]}
              fill="none"
              stroke="none"
              fillOpacity={0.9}
              className="[&>path]:fill-[var(--chart-color)]"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
