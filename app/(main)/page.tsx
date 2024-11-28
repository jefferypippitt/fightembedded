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
    <main className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="space-y-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-center">UFC Champions</h1>
        
        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-4 space-y-8">
            <section>
              <h2 className="text-xl sm:text-2xl font-semibold mb-4">Male Champions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {champions
                  .filter((champion) => champion.gender === "MALE")
                  .map((champion) => (
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
              <h2 className="text-xl sm:text-2xl font-semibold mb-4">Female Champions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {champions
                  .filter((champion) => champion.gender === "FEMALE")
                  .map((champion) => (
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

          <aside className="lg:col-span-1">
            <P4PSidebar />
          </aside>
        </div>
      </div>
    </main>
  );
}
