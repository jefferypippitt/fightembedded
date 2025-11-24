import { EventsDataTable } from "./events-data-table";
import { getPaginatedEvents } from "@/server/actions/get-paginated-events";

export default async function EventsPage() {
  const initialData = await getPaginatedEvents({
    page: 1,
    pageSize: 10,
    q: "",
    view: "events",
    sort: "date.desc",
    columnFilters: [],
  });

  return (
    <div className="flex flex-col gap-6 py-4">
      <EventsDataTable initialData={initialData} />
    </div>
  );
}
