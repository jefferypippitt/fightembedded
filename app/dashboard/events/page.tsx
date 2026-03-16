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

export default function EventsPage() {
  return (
    <div className="flex flex-col gap-6 py-4">
      <EventsDataTableWithData />
    </div>
  );
}
