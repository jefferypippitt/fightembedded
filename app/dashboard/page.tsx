import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { getDashboardStats } from "@/server/actions/get-dashboard-stats";
import { getDivisionStats } from "@/server/actions/get-division-stats";

export default async function Page() {
  const [dashboardStats, divisionStats] = await Promise.all([
    getDashboardStats(),
    getDivisionStats(),
  ]);

  return (
    <>
      <SiteHeader title="Dashboard Overview" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards stats={dashboardStats} />
            <div className="px-4 lg:px-6">
              <ChartAreaInteractive data={divisionStats} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
