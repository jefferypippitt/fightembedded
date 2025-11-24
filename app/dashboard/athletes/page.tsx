import { AthletesDataTable } from "./athletes-data-table";
import { getPaginatedAthletes } from "@/server/actions/get-paginated-athletes";

export default async function DashboardAthletesPage() {
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
    <div className="flex flex-col gap-6 py-4">
      <AthletesDataTable initialData={initialData} />
    </div>
  );
}
