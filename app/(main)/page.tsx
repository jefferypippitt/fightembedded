import { AthleteCard } from "@/components/athlete-card";
import { P4PSidebar } from "@/components/p4p-sidebar";
import prisma from "@/lib/prisma";

export default async function Home() {
  const champions = await prisma.athlete.findMany({
    where: {
      rank: 1,
    },
  });

  return (
    <>
      <h1 className="text-3xl font-bold mb-6 text-center">UFC Champions</h1>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-3/4">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Male Champions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {champions.filter(champion => champion.gender === 'MALE').map((champion) => {
                const winRate = Math.round((champion.wins / (champion.wins + champion.losses)) * 100);
                return (
                  <AthleteCard 
                    key={champion.id}
                    {...champion}
                    division={champion.weightDivision}
                    isChampion={true}
                    koTkoRate={champion.koRate}
                    submissionRate={champion.submissionRate}
                    record={`${champion.wins}-${champion.losses}`}
                    winRate={winRate || 0}
                    imageUrl={champion.imageUrl || '/default-avatar.png'}
                  />
                );
              })}
            </div>
          </div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Female Champions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {champions.filter(champion => champion.gender === 'FEMALE').map((champion) => {
                const winRate = Math.round((champion.wins / (champion.wins + champion.losses)) * 100);
                return (
                  <AthleteCard 
                    key={champion.id}
                    {...champion}
                    division={champion.weightDivision}
                    isChampion={true}
                    koTkoRate={champion.koRate}
                    submissionRate={champion.submissionRate}
                    record={`${champion.wins}-${champion.losses}`}
                    winRate={winRate || 0}
                    imageUrl={champion.imageUrl || '/default-avatar.png'}
                  />
                );
              })}
            </div>
          </div>
        </div>
        <div className="lg:w-1/4">
          <P4PSidebar />
        </div>
      </div>
    </>
  );
}