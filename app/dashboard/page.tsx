import { Suspense } from "react";
import { SectionCards } from "@/components/section-cards";
import { getDashboardStats } from "@/server/actions/get-dashboard-stats";
import { getDivisionStats } from "@/server/actions/get-division-stats";
import { ChartAreaInteractiveWrapper } from "@/components/chart-area-interactive-wrapper";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
} from "@/components/ui/card";

// Separate component for fetching and rendering dashboard stats
async function DashboardStatsSection({
  dashboardStatsPromise,
}: {
  dashboardStatsPromise: Promise<Awaited<ReturnType<typeof getDashboardStats>>>;
}) {
  const dashboardStats = await dashboardStatsPromise;
  return <SectionCards stats={dashboardStats} />;
}

// Separate component for fetching and rendering division stats
async function DivisionStatsSection({
  divisionStatsPromise,
}: {
  divisionStatsPromise: Promise<Awaited<ReturnType<typeof getDivisionStats>>>;
}) {
  const divisionStats = await divisionStatsPromise;
  return (
    <div className="px-4 lg:px-6">
      <ChartAreaInteractiveWrapper data={divisionStats} />
    </div>
  );
}

// Fallback UI for dashboard stats
function DashboardStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-3 px-4 sm:gap-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <Card key={i} className="@container/card">
          <CardHeader>
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-32 mt-2" />
            <Skeleton className="h-6 w-20 mt-2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mt-2" />
            <Skeleton className="h-4 w-3/4 mt-2" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Fallback UI for division stats chart
function DivisionStatsSkeleton() {
  const barHeights = [85, 70, 60, 75, 90, 55, 45, 65];
  return (
    <div className="px-4 lg:px-6">
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
    </div>
  );
}

export default function DashboardOverviewPage() {
  // Start both data fetches early to ensure parallel execution
  const dashboardStatsPromise = getDashboardStats();
  const divisionStatsPromise = getDivisionStats();

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <Suspense fallback={<DashboardStatsSkeleton />}>
            <DashboardStatsSection dashboardStatsPromise={dashboardStatsPromise} />
          </Suspense>
          <Suspense fallback={<DivisionStatsSkeleton />}>
            <DivisionStatsSection divisionStatsPromise={divisionStatsPromise} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
