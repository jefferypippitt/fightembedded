import { getLiveChampions } from "@/server/actions/athlete";
import ChampionsSection from "@/components/champions-section";

export default async function ChampionsSectionWrapper() {
  "use cache";
  const { maleChampions, femaleChampions } = await getLiveChampions();

  return (
    <ChampionsSection
      maleChampions={maleChampions}
      femaleChampions={femaleChampions}
    />
  );
}
