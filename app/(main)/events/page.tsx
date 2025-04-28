import { Metadata } from "next";
import { getAllUpcomingEvents } from "@/server/actions/get-all-events";
import { format } from "date-fns";

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
        <div className="border border-dashed p-4">
          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between border-b border-dashed pb-4 last:border-0"
              >
                <div className="space-y-1">
                  <h2 className="text-lg font-semibold">{event.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(event.date), "MMMM d, yyyy")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {event.venue} • {event.location}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">Main Event Fighters</p>
                  <p className="text-sm text-muted-foreground">{event.mainEvent}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 