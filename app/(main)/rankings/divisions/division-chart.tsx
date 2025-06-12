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
    fill: athlete.rank === 1 ? 'var(--chart-1)' :
          athlete.rank === 2 ? 'var(--chart-3)' :
          athlete.rank === 3 ? 'var(--chart-6)' :
          athlete.rank === 4 ? 'var(--chart-12)' :
          'var(--chart-9)'
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
              radius={2} 
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
