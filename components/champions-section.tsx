import { AthleteListCard } from "@/components/athlete-list-card";
import { ChampionsSectionProps } from "@/types/rankings";
import { sortChampionsByDivision } from "@/lib/utils";

export default function ChampionsSection({
  maleChampions,
  femaleChampions,
}: ChampionsSectionProps) {
  // Sort champions by weight division (heaviest to lightest)
  const sortedMaleChampions = sortChampionsByDivision(maleChampions, "MALE");
  const sortedFemaleChampions = sortChampionsByDivision(
    femaleChampions,
    "FEMALE"
  );

  return (
    <div className="space-y-8">
      {/* Men's Champions Section */}
      {/* Champions load with priority=true for instant display, images cached for 1 year */}
      <section>
        <div className="*:data-[slot=card]:bg-card grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 *:data-[slot=card]:shadow-xs">
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
              draws={champion.draws ?? undefined}
              winsByKo={champion.winsByKo}
              winsBySubmission={champion.winsBySubmission}
              rank={champion.rank ?? undefined}
              poundForPoundRank={champion.poundForPoundRank ?? undefined}
              followers={champion.followers}
              age={champion.age}
              retired={champion.retired ?? false}
              priority={true}
              disableCursor={true}
            />
          ))}
        </div>
      </section>

      {/* Women's Champions Section */}
      {/* Champions load with priority=true for instant display, images cached for 1 year */}
      <section>
        <div className="*:data-[slot=card]:bg-card grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 *:data-[slot=card]:shadow-xs">
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
              draws={champion.draws ?? undefined}
              winsByKo={champion.winsByKo}
              winsBySubmission={champion.winsBySubmission}
              rank={champion.rank ?? undefined}
              poundForPoundRank={champion.poundForPoundRank ?? undefined}
              followers={champion.followers}
              age={champion.age}
              retired={champion.retired ?? false}
              priority={true}
              disableCursor={true}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
