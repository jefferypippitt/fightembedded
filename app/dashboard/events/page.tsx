import { getAllUpcomingEvents } from "@/server/actions/get-all-events";
import { UFCEvent } from "@/types/event";
import { EventsDataTable } from "./events-data-table";
import { SiteHeader } from "@/components/site-header";
import { unstable_noStore as noStore } from "next/cache";
import prisma from "@/lib/prisma";

export default async function EventsPage() {
  // Disable caching for dashboard
  noStore();

  // Get all events for the dashboard
  const allEvents = await prisma.event.findMany({
    orderBy: {
      date: "desc",
    },
  });

  // Get upcoming events using our server action
  const upcomingEvents = await getAllUpcomingEvents();

  const typedEvents: UFCEvent[] = allEvents.map(event => ({
    ...event,
    status: event.status as "UPCOMING" | "COMPLETED" | "CANCELLED"
  }));

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