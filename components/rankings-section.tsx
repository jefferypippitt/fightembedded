import { getLiveP4PRankings } from "@/server/actions/athlete";
import { P4PRankings } from "@/components/p4p-rankings";

export default async function RankingsSectionWrapper() {
  "use cache";
  const { maleP4PRankings, femaleP4PRankings } = await getLiveP4PRankings();

  return (
    <P4PRankings
      maleP4PRankings={maleP4PRankings}
      femaleP4PRankings={femaleP4PRankings}
    />
  );
}
