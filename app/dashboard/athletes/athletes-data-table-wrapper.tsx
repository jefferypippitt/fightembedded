"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import type { getPaginatedAthletes } from "@/server/actions/get-paginated-athletes";

// Dynamic import for heavy data table component (~50KB @tanstack/react-table + ~40KB @dnd-kit)
const AthletesDataTable = dynamic(
  () =>
    import("./athletes-data-table").then((mod) => mod.AthletesDataTable),
  {
    ssr: false,
    loading: () => (
      <div className="flex flex-col gap-4 px-4 lg:px-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-32" />
        </div>
        <div className="flex items-center gap-4 py-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-44" />
        </div>
        <div className="rounded-lg border">
          <div className="h-[500px] w-full animate-pulse bg-muted/40" />
        </div>
      </div>
    ),
  }
);

interface AthletesDataTableWrapperProps {
  initialData: Awaited<ReturnType<typeof getPaginatedAthletes>>;
}

export function AthletesDataTableWrapper({
  initialData,
}: AthletesDataTableWrapperProps) {
  return <AthletesDataTable initialData={initialData} />;
}
