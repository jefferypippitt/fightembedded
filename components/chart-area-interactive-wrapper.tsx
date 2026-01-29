"use client";

import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

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
      <Card className="@container/card">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[350px] w-full" />
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
