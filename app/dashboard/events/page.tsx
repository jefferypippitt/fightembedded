import prisma from "@/lib/prisma";
import { UFCEvent } from "@/types/event";
import { EventsDataTable } from "./events-data-table";
import { SiteHeader } from "@/components/site-header";

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    orderBy: {
      date: "desc",
    },
  });

  const typedEvents: UFCEvent[] = events.map(event => ({
    ...event,
    status: event.status as "UPCOMING" | "COMPLETED" | "CANCELLED"
  }));

  const upcomingEvents = typedEvents.filter(event => 
    event.status === "UPCOMING" && new Date(event.date) > new Date()
  );

  const completedEvents = typedEvents.filter(event => 
    event.status === "COMPLETED"
  );

  return (
    <div className="flex flex-col gap-6">
      <SiteHeader title="Events" />
      <EventsDataTable 
        events={typedEvents}
        upcomingEvents={upcomingEvents}
        completedEvents={completedEvents}
      />
    </div>
  );
} 