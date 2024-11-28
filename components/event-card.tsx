import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, MapPin } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface EventCardProps {
  name: string;
  date: Date;
  venue: string;
  location: string;
  mainEvent: string;
  coMainEvent?: string;
}

export function EventCard({
  name,
  date,
  venue,
  location,
  mainEvent,
  coMainEvent,
}: EventCardProps) {
  return (
    <Card className="hover:bg-accent/50 transition-colors shadow-sm">
      <CardContent className="p-2">
        <div className="space-y-1">
          <h3 className="font-semibold text-sm truncate">{name}</h3>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <CalendarDays className="h-3 w-3" />
            <span>{formatDate(date)}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span>{`${venue}, ${location}`}</span>
          </div>
          <div className="border-t pt-1 mt-1">
            <p className="text-xs">{mainEvent}</p>
            {coMainEvent && (
              <p className="text-xs text-muted-foreground mt-1">
                {coMainEvent}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 