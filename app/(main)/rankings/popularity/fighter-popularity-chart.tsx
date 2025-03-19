"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";

interface ChartData {
  name: string;
  male: number;
  female: number;
  gender: "MALE" | "FEMALE";
  index: number;
}

interface FighterPopularityChartProps {
  maleAthletes: ChartData[];
  femaleAthletes: ChartData[];
}

const chartConfig = {
  followers: {
    label: "Followers",
  },
  male: {
    label: "Followers",
    color: "hsl(var(--chart-1))",
  },
  female: {
    label: "Followers",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function FighterPopularityChart({
  maleAthletes,
  femaleAthletes,
}: FighterPopularityChartProps) {
  const [activeChart, setActiveChart] = React.useState<"male" | "female">("male");

  const chartData = React.useMemo(() => {
    return activeChart === "male"
      ? maleAthletes.map((athlete, index) => ({ ...athlete, index }))
      : femaleAthletes.map((athlete, index) => ({ ...athlete, index }));
  }, [activeChart, maleAthletes, femaleAthletes]);

  const total = React.useMemo(
    () => ({
      male: maleAthletes.reduce((acc, curr) => acc + curr.male, 0),
      female: femaleAthletes.reduce((acc, curr) => acc + curr.female, 0),
    }),
    [maleAthletes, femaleAthletes]
  );

  return (
    <Card className="h-full relative overflow-hidden">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row relative z-10">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle className="text-gray-900 dark:text-white">
            Total Followers from X and Instagram
          </CardTitle>
        </div>
        <div className="flex">
          {(["male", "female"] as const).map((key) => (
            <button
              key={key}
              data-active={activeChart === key}
              className={cn(
                "relative z-30 flex flex-1 flex-col justify-center gap-1",
                "border-t px-6 py-4 text-left",
                "even:border-l sm:border-l sm:border-t-0 sm:px-8 sm:py-6",
                "bg-accent/5",
                "data-[active=true]:bg-accent/10"
              )}
              onClick={() => setActiveChart(key)}
            >
              <span className="text-xs text-muted-foreground">
                {chartConfig[key].label}
              </span>
              <span className="text-lg font-bold leading-none sm:text-3xl">
                {total[key].toLocaleString()}
              </span>
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="px-4 sm:p-6 relative z-10">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[500px] w-full"
        >
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
              horizontal={false}
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
                  className="w-[250px] bg-background border shadow-lg text-xs font-medium"
                  nameKey={activeChart}
                />
              }
            />
            <Bar
              dataKey={activeChart}
              fill={`var(--color-${activeChart})`}
              radius={[0, 4, 4, 0]}
              className="[&>path]:fill-[var(--chart-color)]"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
