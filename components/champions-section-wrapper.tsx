import { getChampions } from "@/server/actions/athlete";
import ChampionsSection from "@/components/champions-section";

export default async function ChampionsSectionWrapper() {
  const { maleChampions, femaleChampions } = await getChampions();

  return (
    <ChampionsSection
      maleChampions={maleChampions}
      femaleChampions={femaleChampions}
    />
  );
} 