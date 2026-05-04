import { Metadata } from "next";
import { getUpcomingEvents } from "@/server/actions/events";
import { EventsTable } from "@/components/events-table";
import { EventFighterImagePreloads } from "@/components/athlete-image-preloads";

export const metadata: Metadata = {
  title: "Upcoming Events",
  description: "View all upcoming UFC events",
};

export default async function EventsPage() {
  const events = await getUpcomingEvents();

  return (
    <section className="container space-y-6 pt-4 pb-6">
      <EventFighterImagePreloads events={events} />
      <header className="space-y-2">
        <h1 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl tracking-tighter">
          UFC Fight <span className="text-primary">Schedule</span>
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
          View all upcoming events, dates, locations, and main event matchups.
        </p>
      </header>
      <EventsTable events={events} />
    </section>
  );
}
