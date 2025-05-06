import { Metadata } from "next";
import { getAllUpcomingEvents } from "@/server/actions/get-all-events";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

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
        <div className="space-y-4 max-w-5xl mx-auto">
          {events.map((event) => (
            <Card
              key={event.id}
              className={cn(
                "relative overflow-hidden",
                "border-red-600/20 dark:border-red-600/20",
                "bg-gray-50 dark:bg-zinc-950",
                "bg-linear-to-r from-transparent via-red-600/[0.03] to-transparent",
                "dark:bg-linear-to-r dark:from-transparent dark:via-red-400/[0.02] dark:to-transparent",
                "p-4"
              )}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative z-10">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <h2 className="font-bold text-md text-gray-900 dark:text-white">
                      {event.name}
                    </h2>
                    <div className="text-xs text-red-700 dark:text-red-300 bg-red-600/5 dark:bg-red-500/10 rounded-md px-2 py-1 font-medium">
                      {format(new Date(event.date), "MMM d, yyyy")}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-200">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-red-600 dark:text-red-400" />
                    <span>
                      {event.venue}, {event.location}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-1.5 rounded-lg">
                  <div className="text-xs bg-red-600/10 dark:bg-red-500/20 text-red-700 dark:text-red-300 font-medium px-2 py-1 rounded-md shrink-0">
                    Main Event
                  </div>
                  <div className="h-3 w-px bg-red-600/20 dark:bg-red-500/30 shrink-0" />
                  <p className="text-xs text-gray-700 dark:text-gray-100">
                    {event.mainEvent}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 