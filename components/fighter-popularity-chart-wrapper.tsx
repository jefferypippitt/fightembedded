"use client";

import dynamic from "next/dynamic";

const FighterPopularityChart = dynamic(
  () =>
    import("@/app/(main)/rankings/popularity/fighter-popularity-chart").then(
      (mod) => mod.FighterPopularityChart
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-[400px] animate-pulse rounded-md bg-muted" />
    ),
  }
);

interface FighterPopularityChartWrapperProps {
  maleAthletes: {
    name: string;
    male: number;
    female: number;
    gender: "MALE" | "FEMALE";
    index: number;
  }[];
  femaleAthletes: {
    name: string;
    male: number;
    female: number;
    gender: "MALE" | "FEMALE";
    index: number;
  }[];
}

export function FighterPopularityChartWrapper(
  props: FighterPopularityChartWrapperProps
) {
  return <FighterPopularityChart {...props} />;
}
