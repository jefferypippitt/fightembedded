import { Metadata } from "next";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getUpcomingEvents } from "@/server/actions/events";

export const metadata: Metadata = {
  title: "Upcoming Events",
  description: "View all upcoming UFC events",
};

export default async function EventsPage() {
  const events = await getUpcomingEvents();

  return (
    <section className="container space-y-10 py-6">
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
      {events.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">No upcoming events scheduled</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-primary">Event</TableHead>
              <TableHead className="text-primary">Date</TableHead>
              <TableHead className="text-primary">Venue</TableHead>
              <TableHead className="text-primary">Location</TableHead>
              <TableHead className="text-right text-primary">
                Main Event
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((event) => {
              const eventDate = new Date(event.date);

              return (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">{event.name}</TableCell>
                  <TableCell>{format(eventDate, "MMM d, yyyy")}</TableCell>
                  <TableCell>{event.venue}</TableCell>
                  <TableCell>{event.location}</TableCell>
                  <TableCell className="text-right">
                    {event.mainEvent}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </section>
  );
}
