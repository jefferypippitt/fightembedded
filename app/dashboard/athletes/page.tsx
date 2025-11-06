import { AthletesDataTable } from "./athletes-data-table";
import { SiteHeader } from "@/components/site-header";
import { getPaginatedAthletes } from "@/server/actions/get-paginated-athletes";

export default async function DashboardAthletesPage() {
  "use cache";
  const initialData = await getPaginatedAthletes({
    page: 1,
    pageSize: 10,
    q: "",
    view: "athletes",
    gender: "ALL",
    sort: "rank.asc",
    columnFilters: [],
  });

  return (
    <div className="flex flex-col gap-6">
      <SiteHeader title="Athletes" />
      <AthletesDataTable initialData={initialData} />
    </div>
  );
}
