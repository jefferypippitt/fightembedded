import { Metadata } from "next";
import { getUpcomingEvents } from "@/server/actions/events";
import { EventsTable } from "@/components/events-table";

export const metadata: Metadata = {
  title: "Upcoming Events",
  description: "View all upcoming UFC events",
};

export default async function EventsPage() {
  const events = await getUpcomingEvents();

  return (
    <section className="container space-y-6 pt-4 pb-6">
      <header className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Event Schedule
          </p>
          <h1 className="text-balance text-2xl font-semibold text-gray-900 dark:text-white sm:text-3xl">
            UFC Fight Schedule
          </h1>
          <p className="text-balance text-sm text-muted-foreground sm:text-base">
            View all upcoming events, dates, locations, and main event matchups.
          </p>
        </div>
      </header>
      <EventsTable events={events} />
    </section>
  );
}
