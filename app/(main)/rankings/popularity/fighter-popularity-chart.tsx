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
  const [activeChart, setActiveChart] = React.useState<"male" | "female">(
    "male"
  );

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
    <Card className="@container/card h-full relative overflow-hidden py-0">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:!py-0">
          <CardTitle className="text-center text-base sm:text-2xl font-bold">
            X and Instagram Followers
          </CardTitle>
        </div>
        <div className="flex">
          {(["male", "female"] as const).map((key) => (
            <button
              key={key}
              data-active={activeChart === key}
              className="data-[active=true]:bg-muted/50 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6 cursor-pointer"
              onClick={() => setActiveChart(key)}
            >
              <div className="flex items-center mb-1">
                <span className="text-xs text-muted-foreground">
                  {key === "male" ? "Male" : "Female"} {chartConfig[key].label}
                </span>
              </div>
              <span className="text-lg leading-none font-bold sm:text-3xl font-mono">
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
            <CartesianGrid horizontal={false} vertical={true} />
            <XAxis
              type="number"
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => value.toLocaleString()}
              tick={{
                fill: "hsl(var(--foreground))",
                fontSize: "9px",
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
                  className="w-[150px] bg-background border shadow-lg text-[10px]"
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
