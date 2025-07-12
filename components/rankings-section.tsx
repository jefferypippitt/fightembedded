import { getP4PRankings } from "@/server/actions/get-p4p";
import { P4PRankings } from "@/components/p4p-rankings";

export default async function RankingsSectionWrapper() {
  const { maleP4PRankings, femaleP4PRankings } = await getP4PRankings();

  return (
    <P4PRankings
      maleP4PRankings={maleP4PRankings}
      femaleP4PRankings={femaleP4PRankings}
    />
  );
} 