import { SectionCards } from "@/components/section-cards";
import { getDashboardStats } from "@/server/actions/get-dashboard-stats";
import { getDivisionStats } from "@/server/actions/get-division-stats";
import { ChartAreaInteractiveWrapper } from "@/components/chart-area-interactive-wrapper";

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

export default function DashboardOverviewPage() {
  // Start both data fetches early to ensure parallel execution
  const dashboardStatsPromise = getDashboardStats();
  const divisionStatsPromise = getDivisionStats();

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <DashboardStatsSection dashboardStatsPromise={dashboardStatsPromise} />
          <DivisionStatsSection divisionStatsPromise={divisionStatsPromise} />
        </div>
      </div>
    </div>
  );
}
