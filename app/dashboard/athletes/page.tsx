import { getPaginatedAthletes } from "@/server/actions/get-paginated-athletes";
import { AthletesDataTableWrapper } from "./athletes-data-table-wrapper";
import { Suspense } from "react";

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

function AthletesPageFallback() {
  return (
    <div className="flex flex-col gap-4 px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="h-9 w-32 animate-pulse rounded-md bg-muted" />
        <div className="h-9 w-32 animate-pulse rounded-md bg-muted" />
      </div>
      <div className="flex items-center gap-4 py-4">
        <div className="h-10 w-64 animate-pulse rounded-md bg-muted" />
        <div className="h-10 w-44 animate-pulse rounded-md bg-muted" />
      </div>
      <div className="rounded-lg border">
        <div className="h-[500px] w-full animate-pulse bg-muted/40" />
      </div>
    </div>
  );
}

export default function DashboardAthletesPage() {
  return (
    <div className="flex flex-col gap-6 py-4">
      <Suspense fallback={<AthletesPageFallback />}>
        <AthletesDataTableWithData />
      </Suspense>
    </div>
  );
}
