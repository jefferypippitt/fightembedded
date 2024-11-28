import { AthleteCard } from "@/components/athlete-card";
import { P4PSidebar } from "@/components/p4p-sidebar";
import prisma from "@/lib/prisma";
import { getUpcomingEvents } from "@/server/actions/get-event";
import { EventCard } from "@/components/event-card";

export default async function Home() {
  const [champions, upcomingEvents] = await Promise.all([
    prisma.athlete.findMany({
      where: {
        rank: 1,
      },
    }),
    getUpcomingEvents(),
  ]);

  console.log("Upcoming events on homepage:", upcomingEvents);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-center">
        UFC Champions
      </h1>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-4 space-y-8">
          <section>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">
              Male Champions
            </h2>
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
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">
              Female Champions
            </h2>
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
          <section>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">
              Upcoming Events
            </h2>
            {upcomingEvents.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {upcomingEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    name={event.name}
                    date={event.date}
                    venue={event.venue}
                    location={event.location}
                    mainEvent={event.mainEvent}
                    coMainEvent={event.coMainEvent || undefined}
                    status={event.status}
                  />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No upcoming events scheduled
              </p>
            )}
          </section>
        </div>

        <aside className="lg:col-span-1">
          <P4PSidebar />
        </aside>
      </div>
    </div>
  );
}
