"use client";

import { Bar, BarChart, CartesianGrid, Rectangle, XAxis, YAxis } from "recharts";
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
import { Skeleton } from "@/components/ui/skeleton";
import { DivisionRankings } from "@/server/actions/get-top-5-athletes";
import { useMemo } from "react";
import { Suspense } from "react";

interface DivisionChartProps {
  division: DivisionRankings;
}

function DivisionChartVisualization({ division }: DivisionChartProps) {
  const chartData = useMemo(() => {
    const sortedAthletes = [...division.athletes].sort((a, b) => a.rank - b.rank);
    
    return sortedAthletes.map((athlete) => ({
      name: athlete.name,
      followers: athlete.followers,
      rank: athlete.rank,
      fill: athlete.rank === 1 ? 'var(--chart-1)' :
            athlete.rank === 2 ? 'var(--chart-2)' :
            athlete.rank === 3 ? 'var(--chart-3)' :
            athlete.rank === 4 ? 'var(--chart-4)' :
            'var(--chart-5)'
    }));
  }, [division.athletes]);

  // Find the athlete with the highest follower count
  const maxFollowers = Math.max(...chartData.map(athlete => athlete.followers));
  const activeIndex = chartData.findIndex(athlete => athlete.followers === maxFollowers);

  // Configure chart colors based on rank
  const chartConfig = {
    followers: {
      label: "Followers",
      color: "var(--chart-1)",
    },
    rank1: {
      label: "Rank 1",
      color: "var(--chart-1)",
    },
    rank2: {
      label: "Rank 2", 
      color: "var(--chart-3)",
    },
    rank3: {
      label: "Rank 3",
      color: "var(--chart-6)",
    },
    rank4: {
      label: "Rank 4",
      color: "var(--chart-12)",
    },
    rank5: {
      label: "Rank 5",
      color: "var(--chart-9)",
    },
    label: {
      color: "var(--background)",
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={chartConfig}>
      <BarChart
        accessibilityLayer
        data={chartData}
        layout="vertical"
        margin={{
          right: 16,
        }}
      >
        <CartesianGrid horizontal={false} />
        <YAxis
          dataKey="name"
          type="category"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value, index) => {
            const athlete = chartData[index];
            return `${athlete.rank}. ${value}`;
          }}
          width={140}
          tick={{
            fill: "var(--color-foreground)",
            fontSize: "11px",
            fontWeight: 500,
            x: 0,
          }}
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
          activeIndex={activeIndex}
          activeBar={({ ...props }) => {
            return (
              <Rectangle
                {...props}
                fillOpacity={0.8}
                stroke={props.payload.fill}
                strokeDasharray={4}
                strokeDashoffset={4}
              />
            )
          }}
        />
      </BarChart>
    </ChartContainer>
  );
}

function ChartLoading() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, athleteIndex) => (
        <div key={athleteIndex} className="flex items-center space-x-3">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16 ml-auto" />
        </div>
      ))}
    </div>
  );
}

export function DivisionChart({ division }: DivisionChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{division.division}</CardTitle>
        <CardDescription>Top 5 Ranked Athletes</CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<ChartLoading />}>
          <DivisionChartVisualization division={division} />
        </Suspense>
      </CardContent>
    </Card>
  );
}
