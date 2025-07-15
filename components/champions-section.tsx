import { Athlete } from "@prisma/client";
import { AthleteListCard } from "@/components/athlete-list-card";

interface ChampionsSectionProps {
  maleChampions: Athlete[];
  femaleChampions: Athlete[];
}

// Define weight division order (heaviest to lightest)
const weightDivisionOrder = {
  MALE: [
    "Heavyweight",
    "Light Heavyweight",
    "Middleweight",
    "Welterweight",
    "Lightweight",
    "Featherweight",
    "Bantamweight",
    "Flyweight",
  ],
  FEMALE: ["Featherweight", "Bantamweight", "Flyweight", "Strawweight"],
};

// Helper function to get division weight for sorting
const getDivisionWeight = (division: string, gender: "MALE" | "FEMALE") => {
  const order = weightDivisionOrder[gender];
  const index = order.findIndex((d) =>
    division.toLowerCase().includes(d.toLowerCase())
  );
  return index === -1 ? order.length : index; // Put unknown divisions at the end
};

export default function ChampionsSection({
  maleChampions,
  femaleChampions,
}: ChampionsSectionProps) {
  // Sort champions by weight division
  const sortedMaleChampions = [...maleChampions].sort(
    (a, b) =>
      getDivisionWeight(a.weightDivision, "MALE") -
      getDivisionWeight(b.weightDivision, "MALE")
  );

  const sortedFemaleChampions = [...femaleChampions].sort(
    (a, b) =>
      getDivisionWeight(a.weightDivision, "FEMALE") -
      getDivisionWeight(b.weightDivision, "FEMALE")
  );

  return (
    <div className="space-y-8">
      {/* Men's Champions Section */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {sortedMaleChampions.map((champion) => (
            <AthleteListCard
              key={champion.id}
              id={champion.id}
              name={champion.name}
              weightDivision={champion.weightDivision}
              imageUrl={champion.imageUrl || undefined}
              country={champion.country}
              wins={champion.wins}
              losses={champion.losses}
              draws={champion.draws}
              winsByKo={champion.winsByKo}
              winsBySubmission={champion.winsBySubmission}
              rank={champion.rank}
              poundForPoundRank={champion.poundForPoundRank}
              followers={champion.followers}
              age={champion.age}
              retired={champion.retired ?? false}
              priority={true}
            />
          ))}
        </div>
      </section>

      {/* Women's Champions Section */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedFemaleChampions.map((champion) => (
            <AthleteListCard
              key={champion.id}
              id={champion.id}
              name={champion.name}
              weightDivision={champion.weightDivision}
              imageUrl={champion.imageUrl || undefined}
              country={champion.country}
              wins={champion.wins}
              losses={champion.losses}
              draws={champion.draws}
              winsByKo={champion.winsByKo}
              winsBySubmission={champion.winsBySubmission}
              rank={champion.rank}
              poundForPoundRank={champion.poundForPoundRank}
              followers={champion.followers}
              age={champion.age}
              retired={champion.retired ?? false}
              priority={true}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
