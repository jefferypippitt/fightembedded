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
    // Age score: peaks around 30-35, then declines (realistic for MMA)
    let ageScore = 0;
    if (age < 20) ageScore = age * 2; // 0-40 points for 18-20
    else if (age <= 35)
      ageScore = 40 + (age - 20) * 2; // 40-70 points for 20-35
    else ageScore = Math.max(70 - (age - 35) * 2, 20); // Decline after 35, min 20

    // Fight score: more fights = more experience, but diminishing returns
    let fightScore = 0;
    if (totalFights <= 10) fightScore = totalFights * 3; // 0-30 points
    else if (totalFights <= 25)
      fightScore = 30 + (totalFights - 10) * 1.5; // 30-52.5 points
    else fightScore = Math.min(52.5 + (totalFights - 25) * 0.5, 70); // Diminishing returns, max 70

    return Math.round(Math.min(ageScore + fightScore, 100));
  };

  // Calculate activity level (fights per year on average)
  const getActivityLevel = (totalFights: number, age: number) => {
    // More realistic career start age and activity estimation
    const careerStartAge = Math.min(age - 3, 20); // Assume 3 years of career, min start at 17
    const yearsActive = Math.max(age - careerStartAge, 1);
    const fightsPerYear = totalFights / yearsActive;

    // More nuanced scoring based on real MMA activity patterns
    if (fightsPerYear <= 1)
      return Math.round(fightsPerYear * 30); // 0-30 points for 0-1 fights/year
    else if (fightsPerYear <= 2)
      return Math.round(30 + (fightsPerYear - 1) * 20); // 30-50 points
    else if (fightsPerYear <= 3)
      return Math.round(50 + (fightsPerYear - 2) * 15); // 50-65 points
    else if (fightsPerYear <= 4)
      return Math.round(65 + (fightsPerYear - 3) * 10); // 65-75 points
    else return Math.round(Math.min(75 + (fightsPerYear - 4) * 5, 100)); // 75-100 points for 4+ fights/year
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
    losses: number,
    draws: number,
    winsByKo: number,
    winsBySubmission: number
  ) => {
    const totalFights = wins + losses + draws;
    if (totalFights === 0) return 0;

    // Calculate decision wins (wins that went to decision)
    const decisionWins = wins - winsByKo - winsBySubmission;

    // Calculate decision losses (losses that went to decision)
    // We need to estimate decision losses since we don't have that data
    // Assume a reasonable ratio of decision losses to total losses
    const estimatedDecisionLosses = Math.round(losses * 0.6); // 60% of losses go to decision

    // Total decisions (wins + losses that went the distance)
    const totalDecisions = decisionWins + estimatedDecisionLosses;

    // Durability is the percentage of fights that went to decision
    const durabilityRate = (totalDecisions / totalFights) * 100;

    // Higher decision rate = more durable (can go the distance)
    return Math.round(Math.min(durabilityRate, 100));
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
        athlete1.losses,
        athlete1.draws,
        athlete1.winsByKo,
        athlete1.winsBySubmission
      ),
      athlete2: getDurability(
        athlete2.wins,
        athlete2.losses,
        athlete2.draws,
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
