"use client";

import * as React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  LabelList,
} from "recharts";
import {
  Card,
  CardAction,
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { getAllDivisions } from "@/data/weight-class";

interface ChartAreaInteractiveProps {
  data: {
    name: string;
    slug: string;
    data: {
      date: string;
      count: number;
    }[];
  }[];
}

export function ChartAreaInteractive({ data }: ChartAreaInteractiveProps) {
  const [gender, setGender] = React.useState<"male" | "female">("male");

  // Transform data to show divisions with counts
  const transformedData = React.useMemo(() => {
    const divisions = getAllDivisions();
    return divisions
      .filter((div) => {
        const isWomen = div.slug.startsWith("women-");
        return (gender === "female") === isWomen;
      })
      .map((division, index) => {
        // Find matching data by slug
        const divisionData = data.find((d) => d.slug === division.slug);

        // Get the latest count from the data
        const latestData = divisionData?.data[divisionData.data.length - 1];

        // Extract division name without gender prefix
        const divisionName = division.name.replace(
          `${gender === "male" ? "Men's" : "Women's"} `,
          ""
        );

        // Map each division to its specific chart color
        const colorMap = [
          "var(--chart-1)", // Heavyweight
          "var(--chart-2)", // Light Heavyweight
          "var(--chart-3)", // Middleweight
          "var(--chart-4)", // Welterweight
          "var(--chart-5)", // Lightweight
          "var(--chart-6)", // Featherweight
          "var(--chart-7)", // Bantamweight
          "var(--chart-8)", // Flyweight
          "var(--chart-9)", // Women's Bantamweight
          "var(--chart-10)", // Women's Flyweight
          "var(--chart-11)", // Women's Strawweight
        ];

        return {
          name: divisionName,
          count: latestData?.count || 0,
          fill: colorMap[index] || "var(--primary)",
        };
      })
      .sort((a, b) => {
        // Sort by weight class order
        const weightOrder =
          gender === "male"
            ? [
                "Heavyweight",
                "Light Heavyweight",
                "Middleweight",
                "Welterweight",
                "Lightweight",
                "Featherweight",
                "Bantamweight",
                "Flyweight",
              ]
            : ["Bantamweight", "Flyweight", "Strawweight"];
        return weightOrder.indexOf(a.name) - weightOrder.indexOf(b.name);
      });
  }, [data, gender]);

  // Create chart config with individual entries for each division
  const chartConfig = React.useMemo(() => {
    const config: ChartConfig = {
      count: {
        label: "Athletes",
      },
    };

    transformedData.forEach((item) => {
      config[item.name] = {
        label: item.name,
        color: item.fill,
      };
    });

    return config;
  }, [transformedData]);

  return (
    <Card className="@container/card data-[slot=card]:shadow-xs">
      <CardHeader>
        <CardTitle>Athletes by Division</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total athletes per weight division
          </span>
          <span className="@[540px]/card:hidden">Division totals</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={gender}
            onValueChange={(value) =>
              value && setGender(value as "male" | "female")
            }
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="male">Male</ToggleGroupItem>
            <ToggleGroupItem value="female">Female</ToggleGroupItem>
          </ToggleGroup>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[350px] w-full"
        >
          <BarChart data={transformedData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              textAnchor="middle"
              height={60}
              interval={0}
              fontSize={12}
              width={100}
              padding={{ left: 20, right: 20 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={40}
              tickFormatter={(value: number) => value.toLocaleString()}
              fontSize={12}
              allowDataOverflow={true}
              padding={{ top: 10, bottom: 10 }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="count"
              fill="var(--color-count)"
              radius={[4, 4, 0, 0]}
              barSize={32}
            >
              <LabelList
                position="top"
                offset={5}
                className="fill-foreground"
                fontSize={12}
                formatter={(value: number) => value.toLocaleString()}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
