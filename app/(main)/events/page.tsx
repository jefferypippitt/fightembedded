import { Metadata } from "next";
import { getAllUpcomingEvents } from "@/server/actions/get-event";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const metadata: Metadata = {
  title: "Upcoming Events",
  description: "View all upcoming UFC events",
};

export default async function EventsPage() {
  const events = await getAllUpcomingEvents();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-center">
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
          UFC Fight Schedule
        </h1>
      </div>
      {events.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No upcoming events scheduled</p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          <div className="overflow-hidden rounded-md border shadow-xs">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 *:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
                  <TableHead className="h-9 py-2">Event Name</TableHead>
                  <TableHead className="h-9 py-2">Date</TableHead>
                  <TableHead className="h-9 py-2">Location</TableHead>
                  <TableHead className="h-9 py-2">Main Event</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow
                    key={event.id}
                    className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r odd:bg-muted/30"
                  >
                    <TableCell className="py-2">
                      <span className="font-semibold text-primary">
                        {event.name}
                      </span>
                    </TableCell>
                    <TableCell className="py-2">
                      <span className="text-sm font-mono text-zinc-600 dark:text-zinc-400">
                        {format(new Date(event.date), "MMM d, yyyy")}
                      </span>
                    </TableCell>
                    <TableCell className="py-2">
                      <span className="text-sm text-stone-600 dark:text-stone-400">
                        {event.venue}, {event.location}
                      </span>
                    </TableCell>
                    <TableCell className="py-2">
                      <span className="text-sm font-medium text-red-600 dark:text-red-400">
                        {event.mainEvent}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
