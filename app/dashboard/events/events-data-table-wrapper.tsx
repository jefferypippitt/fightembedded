import type { getPaginatedEvents } from "@/server/actions/get-paginated-events";
import { EventsDataTable } from "./events-data-table";

interface EventsDataTableWrapperProps {
  initialData: Awaited<ReturnType<typeof getPaginatedEvents>>;
}

export function EventsDataTableWrapper({
  initialData,
}: EventsDataTableWrapperProps) {
  return <EventsDataTable initialData={initialData} />;
}
