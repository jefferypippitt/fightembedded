"use client";

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { Athlete } from "@/types/athlete";

interface AthleteComparisonChartProps {
  athlete1: Athlete;
  athlete2: Athlete;
}

export function AthleteComparisonChart({
  athlete1,
  athlete2,
}: AthleteComparisonChartProps) {
  // Calculate derived stats for comparison
  // Calculate finishing ability (KO + Submission rate)
  const getFinishingAbility = (
    winsByKo: number,
    winsBySubmission: number,
    wins: number
  ) => {
    if (wins === 0) return 0;
    const totalFinishes = winsByKo + winsBySubmission;
    return Math.round((totalFinishes / wins) * 100);
  };

  // Calculate experience factor (age + total fights)
  const getExperienceFactor = (age: number, totalFights: number) => {
    const ageScore = Math.min(age / 40, 1) * 50; // Max 50 points for age
    const fightScore = Math.min(totalFights / 30, 1) * 50; // Max 50 points for fights
    return Math.round(ageScore + fightScore);
  };

  // Calculate activity level (fights per year on average)
  const getActivityLevel = (totalFights: number, age: number) => {
    // Estimate years active based on age (started around 18-20)
    const yearsActive = Math.max(age - 18, 1); // Minimum 1 year
    const fightsPerYear = totalFights / yearsActive;

    // Score based on activity: 0-2 fights/year = 0-40, 2-4 = 40-70, 4+ = 70-100
    if (fightsPerYear <= 2) return Math.round(Math.min(fightsPerYear * 20, 40));
    if (fightsPerYear <= 4) return Math.round(40 + (fightsPerYear - 2) * 15);
    return Math.round(Math.min(70 + (fightsPerYear - 4) * 10, 100));
  };

  // Calculate win rate (overall success percentage)
  const getWinRate = (wins: number, losses: number, draws: number) => {
    const totalFights = wins + losses + draws;
    if (totalFights === 0) return 0;
    return Math.round((wins / totalFights) * 100);
  };

  // Calculate durability (ability to go the distance)
  const getDurability = (
    wins: number,
    winsByKo: number,
    winsBySubmission: number
  ) => {
    if (wins === 0) return 0;
    const decisionWins = wins - winsByKo - winsBySubmission;
    const decisionRate = (decisionWins / wins) * 100;
    // Higher decision rate = more durable (can go the distance)
    return Math.round(Math.min(decisionRate, 100));
  };

  // Calculate ranking score (based on division rank)
  const getRankingScore = (rank?: number) => {
    if (!rank || rank === 0) return 0;
    // Invert the rank so #1 = 100, #2 = 95, #3 = 90, etc.
    // Top 20 get scores, others get 0
    if (rank <= 20) {
      return Math.round(100 - (rank - 1) * 5);
    }
    return 0;
  };

  // Create chart data with normalized values
  const chartData = [
    {
      stat: "Win Rate",
      athlete1: getWinRate(athlete1.wins, athlete1.losses, athlete1.draws),
      athlete2: getWinRate(athlete2.wins, athlete2.losses, athlete2.draws),
    },
    {
      stat: "Finishing",
      athlete1: getFinishingAbility(
        athlete1.winsByKo,
        athlete1.winsBySubmission,
        athlete1.wins
      ),
      athlete2: getFinishingAbility(
        athlete2.winsByKo,
        athlete2.winsBySubmission,
        athlete2.wins
      ),
    },
    {
      stat: "Durability",
      athlete1: getDurability(
        athlete1.wins,
        athlete1.winsByKo,
        athlete1.winsBySubmission
      ),
      athlete2: getDurability(
        athlete2.wins,
        athlete2.winsByKo,
        athlete2.winsBySubmission
      ),
    },
    {
      stat: "Ranking",
      athlete1: getRankingScore(athlete1.rank),
      athlete2: getRankingScore(athlete2.rank),
    },
    {
      stat: "Experience",
      athlete1: getExperienceFactor(
        athlete1.age,
        athlete1.wins + athlete1.losses + athlete1.draws
      ),
      athlete2: getExperienceFactor(
        athlete2.age,
        athlete2.wins + athlete2.losses + athlete2.draws
      ),
    },
    {
      stat: "Activity",
      athlete1: getActivityLevel(
        athlete1.wins + athlete1.losses + athlete1.draws,
        athlete1.age
      ),
      athlete2: getActivityLevel(
        athlete2.wins + athlete2.losses + athlete2.draws,
        athlete2.age
      ),
    },
  ];

  const chartConfig = {
    athlete1: {
      label: athlete1.name,
      color: "var(--chart-1)",
    },
    athlete2: {
      label: athlete2.name,
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;

  return (
    <Card className="bg-gradient-to-t from-primary/5 to-card dark:bg-card h-full">
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px] sm:max-h-[400px] lg:max-h-[400px]"
        >
          <RadarChart
            data={chartData}
            margin={{
              top: 10,
              bottom: 10,
              left: 10,
              right: 10,
            }}
          >
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  className="w-[150px] bg-background border text-[10px] sm:text-xs"
                  indicator="line"
                />
              }
            />
            <PolarAngleAxis
              dataKey="stat"
              tick={{
                fontSize: "clamp(8px, 1.5vw, 12px)",
                fill: "currentColor",
              }}
            />
            <PolarGrid />
            <Radar
              dataKey="athlete1"
              fill="var(--color-athlete1)"
              fillOpacity={0.6}
            />
            <Radar
              dataKey="athlete2"
              fill="var(--color-athlete2)"
              fillOpacity={0.6}
            />
            <ChartLegend
              className="mt-2 sm:mt-4"
              content={<ChartLegendContent />}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
