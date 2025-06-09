'use client';

import { AthleteCard } from "@/components/athlete-card";

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

interface ChampionsSectionProps {
  maleChampions: Champion[];
  femaleChampions: Champion[];
}

export default function ChampionsSection({ maleChampions, femaleChampions }: ChampionsSectionProps) {
  return (
    <div className="space-y-8">
      {/* Men's Champions Section */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {maleChampions.map((champion) => (
            <AthleteCard
              key={champion.id}
              name={champion.name}
              division={champion.weightDivision}
              gender={champion.gender}
              imageUrl={champion.imageUrl || undefined}
              country={champion.country}
              wins={champion.wins}
              losses={champion.losses}
              draws={champion.draws}
              winsByKo={champion.winsByKo}
              winsBySubmission={champion.winsBySubmission}
              rank={champion.rank}
              isChampion={champion.rank === 1}
              retired={champion.retired || false}
              age={champion.age}
              followers={champion.followers}
            />
          ))}
        </div>
      </section>

      {/* Women's Champions Section */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {femaleChampions.map((champion) => (
            <AthleteCard
              key={champion.id}
              name={champion.name}
              division={champion.weightDivision}
              gender={champion.gender}
              imageUrl={champion.imageUrl || undefined}
              country={champion.country}
              wins={champion.wins}
              losses={champion.losses}
              draws={champion.draws}
              winsByKo={champion.winsByKo}
              winsBySubmission={champion.winsBySubmission}
              rank={champion.rank}
              isChampion={champion.rank === 1}
              retired={champion.retired || false}
              age={champion.age}
              followers={champion.followers}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
