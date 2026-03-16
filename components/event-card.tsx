import { Card, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
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
    <Card className="@container/card flex h-32 w-[300px] sm:w-[340px] min-w-0 flex-col justify-between gap-0 p-2">
      <CardHeader className="p-0">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="line-clamp-1 text-base font-semibold text-foreground">
              {name}
            </CardTitle>
            <span className="shrink-0 text-[11px] font-medium text-foreground/70">
              {format(date, "MMM d, yyyy")}
            </span>
          </div>
          <div className="mt-2 flex min-w-0 gap-2 text-xs">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary/70" />
            <div className="min-w-0 leading-tight">
              <div className="truncate font-medium text-foreground/90">{venue}</div>
              <div className="truncate text-muted-foreground">{location}</div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardFooter className="p-0 pb-1">
        <div className="flex min-w-0 items-center gap-2">
          <span className="shrink-0 text-[12px] font-semibold text-foreground">
            Main Event:
          </span>
          <span className="min-w-0 truncate text-[12px] font-semibold text-primary">
            {mainEvent}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
