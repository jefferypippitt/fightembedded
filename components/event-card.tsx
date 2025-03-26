import { Card } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface EventCardProps {
  name: string;
  date: Date;
  venue: string;
  location: string;
  mainEvent: string;
}

export default function EventCard({
  name,
  date,
  venue,
  location,
  mainEvent,
}: EventCardProps) {
  return (
    <Card
      className={cn(
        "w-[400px] h-32 mx-3",
        "relative overflow-hidden",
        "border-red-600/20 dark:border-red-600/20",
        "bg-gray-50 dark:bg-zinc-950",
        "bg-linear-to-r from-transparent via-red-600/[0.03] to-transparent",
        "dark:bg-linear-to-r dark:from-transparent dark:via-red-400/[0.02] dark:to-transparent",
        "p-2"
      )}
    >
      <div className="h-full flex flex-col justify-between relative z-10">
        <div className="flex items-center justify-between gap-2">
          <h1 className="font-bold text-md text-gray-900 dark:text-white flex-1">
            {name}
          </h1>
          <div className="text-[10px] text-red-700 dark:text-red-300 bg-red-600/5 dark:bg-red-500/10 rounded-md px-1.5 py-0.5 font-medium">
            {format(date, "MMM d, yyyy")}
          </div>
        </div>

        <div className="flex items-center gap-1 text-[10px] text-gray-600 dark:text-gray-200">
          <MapPin className="h-3 w-3 shrink-0 text-red-600 dark:text-red-400" />
          <span>
            {venue}, {location}
          </span>
        </div>

        <div className="flex items-center gap-2 p-1.5 rounded-lg">
          <div className="text-[10px] bg-red-600/10 dark:bg-red-500/20 text-red-700 dark:text-red-300 font-medium px-1.5 py-0.5 rounded-md shrink-0">
            Main Event
          </div>
          <div className="h-3 w-px bg-red-600/20 dark:bg-red-500/30 shrink-0" />
          <p className="text-[10px] text-gray-700 dark:text-gray-100">
            {mainEvent}
          </p>
        </div>
      </div>
    </Card>
  );
}
