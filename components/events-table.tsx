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
import { Event } from "@/types/event";

interface EventsTableProps {
  events: Event[];
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
          <TableHead className="text-primary">Event</TableHead>
          <TableHead className="text-primary">Date</TableHead>
          <TableHead className="text-primary">Venue</TableHead>
          <TableHead className="text-primary">Location</TableHead>
          <TableHead className="text-right text-primary">
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
                <TableCell className="font-medium">{event.name}</TableCell>
                <TableCell>{format(eventDate, "MMM d, yyyy")}</TableCell>
                <TableCell>{event.venue}</TableCell>
                <TableCell>{event.location}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <span>{event.mainEvent}</span>
                    {hasCoMainEvent && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
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
                <TableRow key={`${event.id}-expanded`}>
                  <TableCell colSpan={4}></TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-sm font-medium text-primary">
                        Co-Main Event
                      </span>
                      <span className="text-sm">{event.coMainEvent}</span>
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

