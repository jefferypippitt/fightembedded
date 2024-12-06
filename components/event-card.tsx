import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="border-b bg-muted/50 p-2">
        <CardTitle className="flex items-center justify-between">
          <span className="text-base font-semibold">{name}</span>
          <Badge variant="secondary" className="font-normal">
            <CalendarDays className="mr-1 h-3 w-3" />
            {formatDate(date)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <div className="mb-2 flex items-center text-sm text-muted-foreground">
          <MapPin className="mr-1 h-4 w-4" />
          <span>{`${venue}, ${location}`}</span>
        </div>
        <div className="space-y-1">
          <h1 className="flex items-center text-sm font-medium">Main Event</h1>
          <p className="text-sm text-muted-foreground">{mainEvent}</p>
        </div>
      </CardContent>
    </Card>
  );
}
