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
    <Card>
      <CardContent className="p-4 space-y-4">
        <div>
          <h3 className="font-semibold text-lg">{name}</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <CalendarDays className="h-4 w-4" />
            <span>{formatDate(date)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{venue}, {location}</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div>
            <p className="font-medium text-sm">Main Event:</p>
            <p className="text-sm text-muted-foreground">{mainEvent}</p>
          </div>
          {coMainEvent && (
            <div>
              <p className="font-medium text-sm">Co-Main Event:</p>
              <p className="text-sm text-muted-foreground">{coMainEvent}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 