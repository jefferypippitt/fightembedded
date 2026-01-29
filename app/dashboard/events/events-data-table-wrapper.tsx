"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import type { getPaginatedEvents } from "@/server/actions/get-paginated-events";

// Dynamic import for heavy data table component (~50KB @tanstack/react-table)
const EventsDataTable = dynamic(
  () => import("./events-data-table").then((mod) => mod.EventsDataTable),
  {
    ssr: false,
    loading: () => (
      <div className="flex flex-col gap-4 px-4 lg:px-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-32" />
        </div>
        <div className="flex items-center gap-4 py-4">
          <Skeleton className="h-10 w-96" />
        </div>
        <div className="rounded-lg border">
          <div className="h-[500px] w-full animate-pulse bg-muted/40" />
        </div>
      </div>
    ),
  }
);

interface EventsDataTableWrapperProps {
  initialData: Awaited<ReturnType<typeof getPaginatedEvents>>;
}

export function EventsDataTableWrapper({
  initialData,
}: EventsDataTableWrapperProps) {
  return <EventsDataTable initialData={initialData} />;
}
