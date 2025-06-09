import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import { format } from "date-fns";
import { Event } from "@/types/event";

type EventCardProps = Pick<Event, "name" | "date" | "venue" | "location" | "mainEvent">;

export default function EventCard({
  name,
  date,
  venue,
  location,
  mainEvent,
}: EventCardProps) {
  return (
    <Card className="w-[340px] h-32 px-4 py-2">
      <CardHeader className="p-0 pb-1">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base font-medium line-clamp-1">{name}</CardTitle>
          <Badge variant="eventDate" className="text-[12px] px-1.5 py-0.5 font-medium shrink-0">
            {format(date, "MMM d, yyyy")}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex flex-col gap-1.5">
        <div className="flex items-center gap-1 text-[12px] text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span className="truncate">{venue}, {location}</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="mainEvent" className="text-[12px] px-1.5 py-0.5 font-medium shrink-0">
            Main Event
          </Badge>
          <span className="text-[12px] text-gray-700 dark:text-gray-100 truncate">{mainEvent}</span>
        </div>
      </CardContent>
    </Card>
  );
}
