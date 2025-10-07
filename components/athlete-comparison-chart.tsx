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

    // Ensure values are non-negative
    const koWins = Math.max(winsByKo, 0);
    const submissionWins = Math.max(winsBySubmission, 0);
    const totalWins = Math.max(wins, 0);

    const totalFinishes = koWins + submissionWins;
    return Math.round((totalFinishes / totalWins) * 100);
  };

  // Calculate versatility (how well-rounded a fighter is based on win methods)
  const getVersatility = (
    wins: number,
    winsByKo: number,
    winsBySubmission: number
  ) => {
    if (wins === 0) return 0;

    // Calculate decision wins
    const decisionWins = wins - winsByKo - winsBySubmission;

    // Calculate percentages of each win method
    const koPercentage = (winsByKo / wins) * 100;
    const submissionPercentage = (winsBySubmission / wins) * 100;
    const decisionPercentage = (decisionWins / wins) * 100;

    // Calculate versatility based on how balanced the fighter is
    // A perfectly balanced fighter (33.3% each) would get 100
    // A fighter with 100% in one method would get 0
    const balanceScore =
      100 - Math.max(koPercentage, submissionPercentage, decisionPercentage);

    return Math.round(Math.max(Math.min(balanceScore, 100), 0));
  };

  // Calculate activity level (fights per year on average)
  const getActivityLevel = (totalFights: number, age: number) => {
    // Calculate years active (assuming career started at age 18)
    const careerStartAge = 18;
    const yearsActive = Math.max(age - careerStartAge, 1);
    const fightsPerYear = totalFights / yearsActive;

    // Scale: 0-2 fights/year = 0-40, 2-4 fights/year = 40-80, 4+ fights/year = 80-100
    const scaledActivity = Math.min(fightsPerYear * 25, 100);

    return Math.round(Math.max(Math.min(scaledActivity, 100), 0));
  };

  // Calculate decision wins percentage
  const getDecision = (
    wins: number,
    winsByKo: number,
    winsBySubmission: number
  ) => {
    if (wins === 0) return 0;

    // Ensure values are non-negative
    const totalWins = Math.max(wins, 0);
    const koWins = Math.max(winsByKo, 0);
    const submissionWins = Math.max(winsBySubmission, 0);

    // Calculate decision wins (wins that went to decision)
    const decisionWins = Math.max(totalWins - koWins - submissionWins, 0);

    // Calculate decision win percentage
    const decisionPercentage = (decisionWins / totalWins) * 100;

    return Math.round(Math.max(Math.min(decisionPercentage, 100), 0));
  };

  // Calculate experience (total fights)
  const getExperience = (wins: number, losses: number, draws: number) => {
    // Ensure values are non-negative
    const totalWins = Math.max(wins, 0);
    const totalLosses = Math.max(losses, 0);
    const totalDraws = Math.max(draws, 0);

    const totalFights = totalWins + totalLosses + totalDraws;

    // Return total fights (capped at 100 for display)
    return Math.round(Math.max(Math.min(totalFights, 100), 0));
  };

  // Create chart data with normalized values
  const chartData = [
    {
      stat: "Decision",
      athlete1: getDecision(
        athlete1.wins,
        athlete1.winsByKo,
        athlete1.winsBySubmission
      ),
      athlete2: getDecision(
        athlete2.wins,
        athlete2.winsByKo,
        athlete2.winsBySubmission
      ),
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
      stat: "Experience",
      athlete1: getExperience(
        athlete1.wins,
        athlete1.losses,
        athlete1.draws ?? 0
      ),
      athlete2: getExperience(
        athlete2.wins,
        athlete2.losses,
        athlete2.draws ?? 0
      ),
    },
    {
      stat: "Versatility",
      athlete1: getVersatility(
        athlete1.wins,
        athlete1.winsByKo,
        athlete1.winsBySubmission
      ),
      athlete2: getVersatility(
        athlete2.wins,
        athlete2.winsByKo,
        athlete2.winsBySubmission
      ),
    },
    {
      stat: "Activity",
      athlete1: getActivityLevel(
        athlete1.wins + athlete1.losses + (athlete1.draws ?? 0),
        athlete1.age
      ),
      athlete2: getActivityLevel(
        athlete2.wins + athlete2.losses + (athlete2.draws ?? 0),
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
    <Card className="h-full">
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
                fontSize: "clamp(12px, 1.5vw, 12px)",
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
