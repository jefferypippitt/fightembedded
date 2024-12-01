import { Card, CardContent } from "@/components/ui/card";

import { CalendarDays, MapPin } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface EventCardProps {
  name: string;
  date: Date;
  venue: string;
  location: string;
  mainEvent: string;
}

export function EventCard({
  name,
  date,
  venue,
  location,
  mainEvent,
}: EventCardProps) {
  return (
    <Card className="hover:bg-accent/50 transition-colors">
      <CardContent className="p-3">
        {/* Event Name */}
        <div className="flex justify-between items-start mb-2">
          <p className="text-xs">{name}</p>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <CalendarDays className="h-3 w-3" />
            <span>{formatDate(date)}</span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground mb-3">
          <MapPin className="h-3 w-3" />
          <span>{`${venue}, ${location}`}</span>
        </div>

        {/* Main Event */}
        <div className="space-y-1.5">
          <div className="flex flex-col">
            <h4 className="text-xs font-medium">Main Event</h4>
            <p className="text-[10px] text-muted-foreground">{mainEvent}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
