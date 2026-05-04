"use client";

import { useState, Fragment } from "react";
import { format } from "date-fns";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { EnrichedEvent, EventFighter } from "@/types/event";
import { AthleteAvatar } from "@/components/ui/athlete-avatar";
import { getCountryCode } from "@/lib/country-codes";

interface EventsTableProps {
  events: EnrichedEvent[];
}

function FighterMatchup({ fighters }: { fighters: [EventFighter, EventFighter] }) {
  const [f1, f2] = fighters;
  return (
    <div className="flex items-center justify-end gap-3">
      <div className="flex -space-x-2 shrink-0">
        <span
          title={f1.name}
          className="inline-flex shrink-0 rounded-full ring-2 ring-background"
        >
          <AthleteAvatar
            imageUrl={f1.imageUrl ?? undefined}
            updatedAt={f1.updatedAt ?? undefined}
            countryCode={
              f1.country ? getCountryCode(f1.country) : undefined
            }
            size="xs"
            className="rounded-full"
            priority
          />
        </span>
        <span
          title={f2.name}
          className="inline-flex shrink-0 rounded-full ring-2 ring-background"
        >
          <AthleteAvatar
            imageUrl={f2.imageUrl ?? undefined}
            updatedAt={f2.updatedAt ?? undefined}
            countryCode={
              f2.country ? getCountryCode(f2.country) : undefined
            }
            size="xs"
            className="rounded-full"
            priority
          />
        </span>
      </div>
      <div className="flex flex-col text-right leading-tight">
        <span className="text-xs font-medium text-foreground">{f1.name}</span>
        <span className="text-xs font-medium text-foreground">{f2.name}</span>
      </div>
    </div>
  );
}

export function EventsTable({ events }: EventsTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (eventId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(eventId)) {
      newExpanded.delete(eventId);
    } else {
      newExpanded.add(eventId);
    }
    setExpandedRows(newExpanded);
  };

  if (events.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">No upcoming events scheduled</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-xs font-semibold uppercase text-primary">
            Event
          </TableHead>
          <TableHead className="text-xs font-semibold uppercase text-primary">
            Date
          </TableHead>
          <TableHead className="text-xs font-semibold uppercase text-primary">
            Venue
          </TableHead>
          <TableHead className="text-xs font-semibold uppercase text-primary">
            Location
          </TableHead>
          <TableHead className="text-right text-xs font-semibold uppercase text-primary">
            Main Event
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {events.map((event) => {
          const eventDate = new Date(event.date);
          const isExpanded = expandedRows.has(event.id);
          const hasCoMainEvent = !!event.coMainEvent;

          return (
            <Fragment key={event.id}>
              <TableRow
                className={hasCoMainEvent ? "cursor-pointer hover:bg-muted/50" : ""}
                onClick={hasCoMainEvent ? () => toggleRow(event.id) : undefined}
              >
                <TableCell className="font-medium text-foreground">
                  {event.name}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {format(eventDate, "MMM d, yyyy")}
                </TableCell>
                <TableCell className="text-muted-foreground">{event.venue}</TableCell>
                <TableCell className="text-muted-foreground">
                  {event.location}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {event.mainEventFighters ? (
                      <FighterMatchup fighters={event.mainEventFighters} />
                    ) : (
                      <span className="font-medium text-foreground">
                        {event.mainEvent}
                      </span>
                    )}
                    {hasCoMainEvent && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:bg-muted/60 hover:text-primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleRow(event.id);
                        }}
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
              {isExpanded && hasCoMainEvent && (
                <TableRow key={`${event.id}-expanded`} className="bg-muted/20">
                  <TableCell colSpan={4}></TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                        Co-Main Event
                      </span>
                      {event.coMainEventFighters ? (
                        <FighterMatchup fighters={event.coMainEventFighters} />
                      ) : (
                        <span className="text-sm font-medium text-foreground">
                          {event.coMainEvent}
                        </span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </Fragment>
          );
        })}
      </TableBody>
    </Table>
  );
}

