import { getPaginatedAthletes } from "@/server/actions/get-paginated-athletes";
import { AthletesDataTableWrapper } from "./athletes-data-table-wrapper";

async function AthletesDataTableWithData() {
  const initialData = await getPaginatedAthletes({
    page: 1,
    pageSize: 10,
    q: "",
    view: "athletes",
    gender: "ALL",
    sort: "rank.asc",
    columnFilters: [],
  });

  return <AthletesDataTableWrapper initialData={initialData} />;
}

export default function DashboardAthletesPage() {
  return (
    <div className="flex flex-col gap-6 py-4">
      <AthletesDataTableWithData />
    </div>
  );
}
