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
    color: "var(--chart-1)",
  },
  female: {
    label: "Followers",
    color: "var(--chart-4)",
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
        <div className="flex flex-1 flex-col justify-center gap-1 px-4 py-3 sm:px-6 sm:py-5">
          <CardTitle className="text-base sm:text-lg font-medium">
            Total Followers from X and Instagram
          </CardTitle>
        </div>
        <div className="flex">
          {(["male", "female"] as const).map((key) => (
             <button
             key={key}
             data-active={activeChart === key}
             className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6 cursor-pointer"
              onClick={() => setActiveChart(key)}
            >
              <div className="flex items-center mb-1">
                <span className="text-xs text-muted-foreground">
                  {key === "male" ? "Male" : "Female"} {chartConfig[key].label}
                </span>
              </div>
              <span className="text-base sm:text-3xl font-bold leading-none">
                {total[key].toLocaleString()}
              </span>
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6 relative z-10">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[500px] sm:h-[500px] w-full"
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
              tickMargin={15}
              axisLine={false}
              width={140}
              interval={0}
              tick={{
                fill: "hsl(var(--foreground))",
                fontSize: "9px",
                fontWeight: 500,
                x: 0,
              }}
            />
            <ChartTooltip
              cursor={{ fill: "hsl(var(--muted))" }}
              content={
                <ChartTooltipContent
                  className="w-[150px] bg-background border shadow-lg text-[10px] font-medium"
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
