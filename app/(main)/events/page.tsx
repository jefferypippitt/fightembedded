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
          UFC Fight Schedule
        </h1>
      </div>
      {events.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No upcoming events scheduled</p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          <Table>
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
                  <TableCell className="font-medium">
                    <Badge variant="eventDate">{event.name}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="coMainEvent">
                      {format(new Date(event.date), "MMM d, yyyy")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span>
                        <Badge variant="outline">{event.venue}, {event.location}</Badge>
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
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
      )}
    </div>
  );
} 