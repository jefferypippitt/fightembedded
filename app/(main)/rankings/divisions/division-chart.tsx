"use client";

import { Bar, BarChart, XAxis, YAxis } from "recharts";
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
import { DivisionRankings } from "@/server/actions/get-top-5-athletes";

const chartConfig = {
  followers: {
    label: "Followers",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

interface DivisionChartProps {
  division: DivisionRankings;
}

export function DivisionChart({ division }: DivisionChartProps) {
  const chartData = division.athletes.map((athlete) => ({
    name: `${athlete.rank}. ${athlete.name}`,
    followers: athlete.followers,
    rank: athlete.rank,
    fill: `hsl(var(--chart-${athlete.rank}))`,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{division.division}</CardTitle>
        <CardDescription>Top 5 Ranked Athletes</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: -20,
            }}
          >
            <XAxis 
              type="number" 
              dataKey="followers" 
              hide 
            />
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              tickMargin={15}
              axisLine={false}
              width={140}
              tick={{
                fill: "hsl(var(--foreground))",
                fontSize: "11px",
                fontWeight: 500,
                x: 0,
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  className="w-[250px] bg-background border shadow-lg text-xs font-medium"
                  nameKey="followers"
                  hideLabel
                />
              }
            />
            <Bar 
              dataKey="followers" 
              fill="var(--color-followers)" 
              radius={3} 
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
