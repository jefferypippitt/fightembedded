import { SiteHeader } from "@/components/site-header";
import { EventsDataTable } from "./events-data-table";
import { getPaginatedEvents } from "@/server/actions/get-paginated-events";
export default async function EventsPage() {
  "use cache";
  const initialData = await getPaginatedEvents({
    page: 1,
    pageSize: 10,
    q: "",
    view: "events",
    sort: "date.desc",
    columnFilters: [],
  });

  return (
    <div className="flex flex-col gap-6">
      <SiteHeader title="Events" />
      <EventsDataTable initialData={initialData} />
    </div>
  );
}
