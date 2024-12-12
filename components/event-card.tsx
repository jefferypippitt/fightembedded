import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { formatDate, cn } from "@/lib/utils";

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
    <Card className={cn(
      "group w-80 mx-3 hover:shadow-lg transition-all duration-300",
      "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
      "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
    )}>
      <CardContent className="p-2.5 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h1 className="font-semibold text-md truncate">{name}</h1>
          <span className="text-xs font-medium whitespace-nowrap">
            {formatDate(date)}
          </span>
        </div>

        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3 flex-shrink-0" />
          <span className="truncate">
            {venue}, {location}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-primary font-medium">Main Event</span>
          <div className="h-3 w-px bg-muted-foreground/30" />
          <p className="text-xs truncate">{mainEvent}</p>
        </div>
      </CardContent>
    </Card>
  );
}
