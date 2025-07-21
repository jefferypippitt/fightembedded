import { getAthletesForDashboard } from "@/server/actions/athlete";
import { getUndefeatedAthletesForDashboard } from "@/server/actions/athlete";
import { getRetiredAthletesForDashboard } from "@/server/actions/athlete";
import { getChampionsForDashboard } from "@/server/actions/athlete";
import { getP4PForDashboard } from "@/server/actions/athlete";
import { AthletesDataTable } from "./athletes-data-table";
import { SiteHeader } from "@/components/site-header";

export default async function DashboardAthletesPage() {
  const athletes = await getAthletesForDashboard();
  const undefeatedAthletes = await getUndefeatedAthletesForDashboard();
  const retiredAthletes = await getRetiredAthletesForDashboard();
  const champions = await getChampionsForDashboard();
  const p4pAthletes = await getP4PForDashboard();

  return (
    <div className="flex flex-col gap-6">
      <SiteHeader title="Athletes" />
      <AthletesDataTable
        athletes={athletes}
        undefeatedAthletes={undefeatedAthletes}
        retiredAthletes={retiredAthletes}
        champions={champions}
        p4pAthletes={p4pAthletes}
      />
    </div>
  );
}
