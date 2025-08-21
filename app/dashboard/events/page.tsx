import { SiteHeader } from "@/components/site-header";
import { EventsDataTable } from "./events-data-table";

export default async function EventsPage() {
  return (
    <div className="flex flex-col gap-6">
      <SiteHeader title="Events" />
      <EventsDataTable />
    </div>
  );
}
