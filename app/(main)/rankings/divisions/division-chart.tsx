"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
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
import { cn } from "@/lib/utils";

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
    <Card
      className={cn(
        "h-full group relative overflow-hidden transition-all duration-300",
        "border-red-600/20 dark:border-red-600/20",
        "bg-white dark:bg-zinc-950",
        "before:absolute before:inset-0 before:bg-gradient-to-r",
        "before:from-transparent before:via-red-600/5 before:to-transparent",
        "dark:before:from-transparent dark:before:via-red-600/10 dark:before:to-transparent",
        "hover:before:opacity-100 before:transition-opacity",
        "hover:bg-gray-50 dark:hover:bg-black"
      )}
    >
      <CardHeader className="relative z-10 space-y-1.5 text-center">
        <CardTitle className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
          {division.division}
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-medium">
          Top 5 Ranked Athletes
        </CardDescription>
      </CardHeader>
      <CardContent className="relative z-10">
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
            <CartesianGrid
              vertical={true}
              stroke="hsl(var(--border))"
              strokeDasharray="4"
            />
            <XAxis
              type="number"
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => value.toLocaleString()}
              fontSize={10}
              tickMargin={10}
              tick={{
                fill: "hsl(var(--foreground))",
                fontSize: "10px",
                fontWeight: 500,
              }}
            />
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              axisLine={false}
              width={150}
              interval={0}
              tick={{
                fill: "hsl(var(--foreground))",
                fontSize: "11px",
                fontWeight: 500,
              }}
            />
            <ChartTooltip
              cursor={{ fill: "hsl(var(--muted))" }}
              content={
                <ChartTooltipContent
                  className="w-[250px] bg-white dark:bg-zinc-950 border border-red-600/20 dark:border-red-600/20 shadow-lg text-xs font-medium"
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
