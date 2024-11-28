import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, MapPin, Trophy } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface EventCardProps {
  name: string;
  date: Date;
  venue: string;
  location: string;
  mainEvent: string;
  coMainEvent?: string;
  status?: "UPCOMING" | "COMPLETED" | "CANCELLED";
}

export function EventCard({
  name,
  date,
  venue,
  location,
  mainEvent,
  coMainEvent,
  status = "UPCOMING",
}: EventCardProps) {
  return (
    <Card className="hover:bg-accent/50 transition-colors">
      <CardContent className="p-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-semibold text-base truncate">{name}</h3>
            <Badge 
              variant={
                status === "UPCOMING" 
                  ? "default" 
                  : status === "COMPLETED" 
                    ? "secondary" 
                    : "destructive"
              }
              className="text-xs"
            >
              {status}
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <CalendarDays className="h-3.5 w-3.5" />
              <span className="truncate">{formatDate(date)}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              <span className="truncate">{`${venue}, ${location}`}</span>
            </div>
          </div>
          <div className="space-y-1 border-t pt-2 mt-2">
            <div className="flex items-center gap-1">
              <Trophy className="h-3.5 w-3.5 text-primary shrink-0" />
              <p className="text-xs truncate">{mainEvent}</p>
            </div>
            {coMainEvent && (
              <p className="text-xs text-muted-foreground truncate pl-5">
                {coMainEvent}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 