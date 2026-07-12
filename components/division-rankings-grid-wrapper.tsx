"use client";

import dynamic from "next/dynamic";
import type { DivisionRankings } from "@/server/actions/get-top-5-athletes";

const DivisionRankingsGrid = dynamic(
  () =>
    import("@/app/(main)/rankings/divisions/division-charts").then(
      (mod) => mod.DivisionRankingsGrid
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-[500px] animate-pulse rounded-md bg-muted" />
    ),
  }
);

interface DivisionRankingsGridWrapperProps {
  maleDivisions: DivisionRankings[];
  femaleDivisions: DivisionRankings[];
}

export function DivisionRankingsGridWrapper(
  props: DivisionRankingsGridWrapperProps
) {
  return <DivisionRankingsGrid {...props} />;
}
