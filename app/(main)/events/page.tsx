import { Metadata } from "next";
import { getAllUpcomingEvents } from "@/server/actions/get-all-events";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Upcoming Events | Fight Embedded",
  description: "View all upcoming MMA events and fight cards",
};

export default async function EventsPage() {
  const events = await getAllUpcomingEvents();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-center">
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
          Upcoming Events
        </h1>
      </div>
      {events.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No upcoming events scheduled</p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          <Table>
            <TableCaption>A list of upcoming UFC events</TableCaption>
            <TableHeader>
              <TableRow className="hover:bg-red-50 dark:hover:bg-red-950/50">
                <TableHead className="w-[200px]">Event Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Main Event</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event) => (
                <TableRow 
                  key={event.id}
                  className="hover:bg-red-50 dark:hover:bg-red-950/50"
                >
                  <TableCell className="font-medium">{event.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-red-200 text-red-700 dark:border-red-800 dark:text-red-300">
                      {format(new Date(event.date), "MMM d, yyyy")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-200">
                      <span>
                        {event.venue}, {event.location}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-700 dark:text-gray-100">
                        {event.mainEvent}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
} 