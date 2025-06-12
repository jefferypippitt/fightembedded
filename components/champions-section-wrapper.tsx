import { getChampions } from "@/server/actions/athlete";
import ChampionsSection from "@/components/champions-section";

export default async function ChampionsSectionWrapper() {
  const champions = await getChampions();
  
  // Split champions by gender
  const maleChampions = champions.filter(champion => champion.gender === "MALE");
  const femaleChampions = champions.filter(champion => champion.gender === "FEMALE");

  return (
    <ChampionsSection
      maleChampions={maleChampions}
      femaleChampions={femaleChampions}
    />
  );
} 