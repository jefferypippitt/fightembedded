"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { getAllDivisions } from "@/data/weight-class"

interface ChartAreaInteractiveProps {
  data: {
    name: string
    slug: string
    data: {
      date: string
      count: number
    }[]
  }[]
}

export function ChartAreaInteractive({ data }: ChartAreaInteractiveProps) {
  const [gender, setGender] = React.useState<"male" | "female">("male")

  // Transform data to show divisions with counts
  const transformedData = React.useMemo(() => {
    const divisions = getAllDivisions()
    return divisions
      .filter(div => {
        const isWomen = div.slug.startsWith('women-')
        return (gender === 'female') === isWomen
      })
      .map(division => {
        const divisionData = data.find(d => d.slug === division.slug)
        // Get the latest count from the data
        const latestData = divisionData?.data[divisionData.data.length - 1]
        return {
          name: division.name.replace(`${gender === "male" ? "Men's" : "Women's"} `, ""),
          count: latestData?.count || 0,
        }
      })
      .sort((a, b) => {
        // Sort by weight class order
        const weightOrder = gender === "male" 
          ? ["Heavyweight", "Light Heavyweight", "Middleweight", "Welterweight", "Lightweight", "Featherweight", "Bantamweight", "Flyweight"]
          : ["Bantamweight", "Flyweight", "Strawweight"]
        return weightOrder.indexOf(a.name) - weightOrder.indexOf(b.name)
      })
  }, [data, gender])

  const chartConfig = {
    count: {
      label: "Athletes",
      color: "var(--primary)",
    },
  } satisfies ChartConfig

  return (
    <Card className="@container/card data-[slot=card]:from-primary/5 data-[slot=card]:to-card dark:data-[slot=card]:bg-card data-[slot=card]:bg-gradient-to-t data-[slot=card]:shadow-xs">
      <CardHeader>
        <CardTitle>Athletes by Division</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total athletes per weight division
          </span>
          <span className="@[540px]/card:hidden">Division totals</span>
        </CardDescription>
        <CardAction className="flex gap-2">
          <ToggleGroup
            type="single"
            value={gender}
            onValueChange={(value) => value && setGender(value as "male" | "female")}
            variant="outline"
            className="flex"
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
              cursor={{ fill: "var(--primary)", opacity: 0.1 }}
              content={
                <ChartTooltipContent
                  labelFormatter={(value: string) => value}
                  indicator="dot"
                />
              }
            />
            <Bar
              dataKey="count"
              fill="var(--primary)"
              radius={[4, 4, 0, 0]}
              barSize={32}
              label={{
                position: 'top',
                formatter: (value: number) => value.toLocaleString(),
                fill: 'var(--foreground)',
                fontSize: 12,
                fontWeight: 500,
                offset: 5
              }}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
