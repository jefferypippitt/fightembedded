import { getP4PRankings } from "@/server/actions/athlete";
import { P4PRankings } from "@/components/p4p-rankings";

interface RankingsSectionProps {
  rankings?: Awaited<ReturnType<typeof getP4PRankings>>;
}

export default async function RankingsSection({
  rankings,
}: RankingsSectionProps = {}) {
  const { maleP4PRankings, femaleP4PRankings } =
    rankings ?? (await getP4PRankings());

  return (
    <P4PRankings
      maleP4PRankings={maleP4PRankings}
      femaleP4PRankings={femaleP4PRankings}
    />
  );
}
