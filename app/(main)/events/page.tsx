import { Metadata } from "next";
import { getAllUpcomingEvents } from "@/server/actions/get-all-events";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { unstable_noStore as noStore } from "next/cache";

export const metadata: Metadata = {
  title: "Upcoming Events | Fight Embedded",
  description: "View all upcoming UFC events",
};

export default async function EventsPage() {
  // Disable caching for this page
  noStore();

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
          <div className="bg-background overflow-hidden rounded-md border">
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
                    className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r"
                  >
                    <TableCell className="py-2 font-medium">
                      <Badge variant="eventDate">{event.name}</Badge>
                    </TableCell>
                    <TableCell className="py-2">
                      <Badge variant="coMainEvent">
                        {format(new Date(event.date), "MMM d, yyyy")}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-2">
                      <div className="flex items-center">
                        <span>
                          <Badge variant="outline">
                            {event.venue}, {event.location}
                          </Badge>
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-2">
                      <div className="flex items-center gap-2">
                        <p className="text-gray-700 dark:text-gray-100">
                          <Badge variant="mainEvent">{event.mainEvent}</Badge>
                        </p>
                      </div>
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
