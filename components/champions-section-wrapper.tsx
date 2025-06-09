import { getChampions } from "@/server/actions/get-champion";
import ChampionsSection from "@/components/champions-section";

interface Champion {
  id: string;
  name: string;
  gender: "MALE" | "FEMALE";
  weightDivision: string;
  country: string;
  imageUrl: string | null;
  wins: number;
  losses: number;
  draws: number;
  winsByKo: number;
  winsBySubmission: number;
  followers: number;
  rank: number;
  age: number;
  retired: boolean | null;
}

export default async function ChampionsSectionWrapper() {
  const { maleChampions, femaleChampions } = await getChampions();

  return (
    <ChampionsSection
      maleChampions={maleChampions as Champion[]}
      femaleChampions={femaleChampions as Champion[]}
    />
  );
} 