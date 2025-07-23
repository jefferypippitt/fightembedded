import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { format } from "date-fns";
import { Event } from "@/types/event";

type EventCardProps = Pick<
  Event,
  "name" | "date" | "venue" | "location" | "mainEvent"
>;

export default function EventCard({
  name,
  date,
  venue,
  location,
  mainEvent,
}: EventCardProps) {
  return (
    <Card className="@container/card w-[340px] h-32 px-2 py-2">
      <CardHeader className="p-0 pb-1">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-base font-medium line-clamp-1">
              {name}
            </CardTitle>
            <span className="text-xs font-mono text-zinc-600 dark:text-zinc-400">
              {format(date, "MMM d, yyyy")}
            </span>
          </div>
          <div className="flex items-center gap-2 text-stone-600 dark:text-stone-400 text-xs mt-4">
            <MapPin className="h-4 w-4" />
            <span className="truncate leading-tight">
              {venue}, {location}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-medium text-gray-700 dark:text-gray-300 shrink-0">
            Main Event:
          </span>
          <span className="text-[12px] text-orange-500 dark:text-yellow-400 truncate">
            {mainEvent}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
