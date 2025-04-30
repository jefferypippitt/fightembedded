import { Metadata } from "next";
import { getAllUpcomingEvents } from "@/server/actions/get-all-events";
import { format } from "date-fns";
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
        <div className="border border-dashed p-4 rounded-lg">
          <div className="space-y-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between border-b border-dashed pb-6 last:border-0"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold">{event.name}</h2>
                  </div>
                  <p className="text-sm text-gray-400">
                    <span className="text-red-500">Date:</span> {format(new Date(event.date), "MMMM d, yyyy")}
                  </p>
                  <p className="text-sm text-gray-400">
                    <span className="text-red-500">Venue:</span> {event.venue}
                  </p>
                  <p className="text-sm text-gray-400">
                    <span className="text-red-500">Location:</span> {event.location}
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant="destructive" className="mb-2">Main Event</Badge>
                  <p className="text-sm text-gray-400">{event.mainEvent}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 