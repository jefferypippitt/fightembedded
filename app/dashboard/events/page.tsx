import { Suspense } from "react";
import { getPaginatedEvents } from "@/server/actions/get-paginated-events";
import { EventsDataTableWrapper } from "./events-data-table-wrapper";

async function EventsDataTableWithData() {
  const initialData = await getPaginatedEvents({
    page: 1,
    pageSize: 10,
    q: "",
    view: "events",
    sort: "date.desc",
    columnFilters: [],
  });

  return <EventsDataTableWrapper initialData={initialData} />;
}

function EventsPageFallback() {
  return (
    <div className="flex flex-col gap-4 px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="h-9 w-32 animate-pulse rounded-md bg-muted" />
        <div className="h-9 w-32 animate-pulse rounded-md bg-muted" />
      </div>
      <div className="flex items-center gap-4 py-4">
        <div className="h-10 w-96 animate-pulse rounded-md bg-muted" />
      </div>
      <div className="rounded-lg border">
        <div className="h-[500px] w-full animate-pulse bg-muted/40" />
      </div>
    </div>
  );
}

export default function EventsPage() {
  return (
    <div className="flex flex-col gap-6 py-4">
      <Suspense fallback={<EventsPageFallback />}>
        <EventsDataTableWithData />
      </Suspense>
    </div>
  );
}
