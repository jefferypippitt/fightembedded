import { Metadata } from "next";
import { format } from "date-fns";
import {
  Table,
  TableCaption,
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
  "use cache";
  const events = await getUpcomingEvents();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-center">
        <h1 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
          UFC Fight Schedule
        </h1>
      </div>
      {events.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">No upcoming events scheduled</p>
        </div>
      ) : (
        <div className="container mx-auto max-w-5xl border">
          <Table>
            <TableCaption className="bg-muted/40 p-2 text-center">
              A list of upcoming events
            </TableCaption>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="sm:w-72">Event</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-right">Main Event</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event) => {
                const eventDate = new Date(event.date);

                return (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium leading-tight">
                      {event.name}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium tabular-nums">
                          {format(eventDate, "MMM d, yyyy")}
                        </span>
                        <span className="text-xs text-muted-foreground tabular-nums">
                          {format(eventDate, "EEEE")}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {event.venue}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {event.location}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-sm font-medium leading-tight text-red-500">
                      {event.mainEvent}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
