"use client";

import dynamic from "next/dynamic";
import { Card, CardAction, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const barHeights = [85, 70, 60, 75, 90, 55, 45, 65];

// Dynamic import for heavy chart component (~500KB recharts)
// Must be in a Client Component to use ssr: false
const ChartAreaInteractive = dynamic(
  () =>
    import("@/components/chart-area-interactive").then(
      (mod) => mod.ChartAreaInteractive
    ),
  {
    ssr: false,
    loading: () => (
      <Card className="@container/card data-[slot=card]:shadow-xs">
        <CardHeader>
          <Skeleton className="h-6 w-44" />
          <Skeleton className="h-4 w-56 mt-1" />
          <CardAction>
            <div className="hidden @[767px]/card:flex gap-1">
              <Skeleton className="h-8 w-16 rounded-md" />
              <Skeleton className="h-8 w-20 rounded-md" />
            </div>
          </CardAction>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <div className="flex h-[350px] items-end gap-4 pb-10 pl-10">
            {barHeights.map((h, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <Skeleton
                  className="w-8 rounded-t-sm"
                  style={{ height: `${h}%` }}
                />
                <Skeleton className="h-3 w-12" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    ),
  }
);

interface ChartAreaInteractiveWrapperProps {
  data: {
    name: string;
    slug: string;
    data: {
      date: string;
      count: number;
    }[];
  }[];
}

export function ChartAreaInteractiveWrapper({
  data,
}: ChartAreaInteractiveWrapperProps) {
  return <ChartAreaInteractive data={data} />;
}
