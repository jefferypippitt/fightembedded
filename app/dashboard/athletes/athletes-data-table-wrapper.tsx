import type { getPaginatedAthletes } from "@/server/actions/get-paginated-athletes";
import { AthletesDataTable } from "./athletes-data-table";

interface AthletesDataTableWrapperProps {
  initialData: Awaited<ReturnType<typeof getPaginatedAthletes>>;
}

export function AthletesDataTableWrapper({
  initialData,
}: AthletesDataTableWrapperProps) {
  return <AthletesDataTable initialData={initialData} />;
}
