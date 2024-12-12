import { Athlete } from "@prisma/client";
import { AthleteCard } from "@/components/athlete-card";

interface ChampionsSectionProps {
  maleChampions: Athlete[];
  femaleChampions: Athlete[];
}

const MALE_WEIGHT_ORDER = [
  "Men's Heavyweight",
  "Men's Light Heavyweight",
  "Men's Middleweight",
  "Men's Welterweight",
  "Men's Lightweight",
  "Men's Featherweight",
  "Men's Bantamweight",
  "Men's Flyweight",
] as const;

const FEMALE_WEIGHT_ORDER = [
  "Women's Bantamweight",
  "Women's Flyweight",
  "Women's Strawweight",
] as const;

// Helper function to sort by weight class order
function sortByDivisionOrder(champions: Athlete[], isWomen: boolean) {
  const order = isWomen ? FEMALE_WEIGHT_ORDER : MALE_WEIGHT_ORDER;

  return [...champions].sort((a, b) => {
    const indexA = order.indexOf(a.weightDivision as never);
    const indexB = order.indexOf(b.weightDivision as never);
    return indexA - indexB; // Lower index = heavier weight
  });
}

export function ChampionsSection({
  maleChampions,
  femaleChampions,
}: ChampionsSectionProps) {
  // Sort champions by weight class (heaviest to lightest)
  const sortedMaleChampions = sortByDivisionOrder(maleChampions, false);
  const sortedFemaleChampions = sortByDivisionOrder(femaleChampions, true);

  return (
    <div className="space-y-8">
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {sortedMaleChampions.map((champion) => (
            <AthleteCard
              key={champion.id}
              {...champion}
              division={champion.weightDivision}
              isChampion={true}
              imageUrl={champion.imageUrl || "/default-avatar.png"}
            />
          ))}
        </div>
      </section>

      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedFemaleChampions.map((champion) => (
            <AthleteCard
              key={champion.id}
              {...champion}
              division={champion.weightDivision}
              isChampion={true}
              imageUrl={champion.imageUrl || "/default-avatar.png"}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
