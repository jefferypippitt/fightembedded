import { getP4PRankings } from "@/server/actions/get-p4p";
import { P4PRankings } from "@/components/p4p-rankings";
import { P4PSidebarSkeleton } from "@/components/p4p-sidebar-skeleton";
import { Suspense } from "react";

export default async function RankingsSectionWrapper() {
  const { maleP4PRankings, femaleP4PRankings } = await getP4PRankings();

  return (
    <Suspense fallback={<P4PSidebarSkeleton />}>
      <P4PRankings
        maleP4PRankings={maleP4PRankings}
        femaleP4PRankings={femaleP4PRankings}
      />
    </Suspense>
  );
} 