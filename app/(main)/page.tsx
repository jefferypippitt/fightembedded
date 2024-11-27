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
    <main>
      <h1 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4 text-center">UFC Champions</h1>
      <div className="flex flex-col lg:flex-row gap-2 sm:gap-4 p-1 sm:p-2">
        <div className="w-full lg:w-4/5">
          <div className="mb-4 md:mb-6">
            <h2 className="text-xl font-semibold mb-2 md:mb-4">Male Champions</h2>
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3">
              {champions
                .filter((champion) => champion.gender === "MALE")
                .map((champion) => (
                  <div key={champion.id} className="w-full">
                    <AthleteCard 
                      {...champion}
                      division={champion.weightDivision}
                      isChampion={true}
                      imageUrl={champion.imageUrl || "/default-avatar.png"}
                    />
                  </div>
                ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2 md:mb-4">Female Champions</h2>
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2 md:gap-3">
              {champions
                .filter((champion) => champion.gender === "FEMALE")
                .map((champion) => (
                  <div key={champion.id} className="w-full">
                    <AthleteCard 
                      {...champion}
                      division={champion.weightDivision}
                      isChampion={true}
                      imageUrl={champion.imageUrl || "/default-avatar.png"}
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/5 mt-4 lg:mt-0">
          <P4PSidebar />
        </div>
      </div>
    </main>
  );
}
