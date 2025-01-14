import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { formatDate, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

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
        "bg-gradient-to-r from-transparent via-red-600/[0.03] to-transparent",
        "dark:bg-gradient-to-r dark:from-transparent dark:via-red-400/[0.02] dark:to-transparent"
      )}
    >
      <CardContent className="p-2.5 h-full flex flex-col justify-between relative z-10">
        <div className="flex items-center justify-between gap-2">
          <h1 className="font-bold text-md text-gray-900 dark:text-white flex-1">
            {name}
          </h1>
          <Badge
            variant="secondary"
            className="bg-red-600/10 dark:bg-red-500/30 text-red-700 dark:text-red-300 hover:bg-red-600/10 dark:hover:bg-red-500/30"
          >
            {formatDate(date)}
          </Badge>
        </div>

        <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-200">
          <MapPin className="h-3 w-3 flex-shrink-0 text-red-600 dark:text-red-400" />
          <span>
            {venue}, {location}
          </span>
        </div>

        <div className="flex items-center gap-2 bg-black/5 dark:bg-black/40 p-2 rounded-lg">
          <span className="text-xs bg-red-600 dark:bg-red-500 text-white font-medium px-2 py-0.5 rounded shrink-0">
            Main Event
          </span>
          <div className="h-3 w-px bg-red-600/20 dark:bg-red-500/30 shrink-0" />
          <p className="text-xs text-gray-700 dark:text-gray-100">
            {mainEvent}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
