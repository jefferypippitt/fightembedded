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
    color: "var(--color-chart-1)",
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
    fill: athlete.rank === 1 ? 'oklch(0.646 0.222 41.116)' :
          athlete.rank === 2 ? 'oklch(0.6 0.118 184.704)' :
          athlete.rank === 3 ? 'oklch(0.398 0.07 227.392)' :
          athlete.rank === 4 ? 'oklch(0.828 0.189 84.429)' :
          'oklch(0.769 0.188 70.08)'
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
                fill: "var(--color-foreground)",
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
              fill="fill"
              radius={3} 
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
