import { AthletesDataTable } from "./athletes-data-table";
import { SiteHeader } from "@/components/site-header";

export default async function DashboardAthletesPage() {
  return (
    <div className="flex flex-col gap-6">
      <SiteHeader title="Athletes" />
      <AthletesDataTable />
    </div>
  );
}
