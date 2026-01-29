"use client";

import * as React from "react";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  Column,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  Filter,
  MoreHorizontal,
  PlusCircle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { toast } from "sonner";

import { Event } from "@/types/event";
import { deleteEvent } from "@/server/actions/events";
import { getPaginatedEvents } from "@/server/actions/get-paginated-events";
import { usePaginatedData } from "@/lib/swr";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useQueryState, parseAsString, parseAsInteger } from "nuqs";

// Helper component for the actions cell
const ActionsCell = ({
  event,
  onDelete,
}: {
  event: Event;
  onDelete: () => void;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
          size="icon"
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32">
        <DropdownMenuItem asChild>
          <Link href={`/dashboard/events/${event.id}/edit`}>Edit</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onDelete} className="text-red-600">
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Helper component for the status filter
const StatusFilter = ({ column }: { column: Column<Event, unknown> }) => {
  const statuses = ["UPCOMING", "COMPLETED", "CANCELLED"];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Filter status</span>
          <Filter className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Status</DropdownMenuLabel>
        {statuses.map((status) => (
          <DropdownMenuCheckboxItem
            key={status}
            checked={(column.getFilterValue() as string[])?.includes(status)}
            onCheckedChange={(checked) => {
              const currentFilter = (column.getFilterValue() as string[]) ?? [];
              if (checked) {
                column.setFilterValue([...currentFilter, status]);
              } else {
                column.setFilterValue(
                  currentFilter.filter((item) => item !== status)
                );
              }
            }}
          >
            {status}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

interface EventsDataTableProps {
  initialData?: {
    events: Event[];
    total: number;
  };
}

export function EventsDataTable({ initialData }: EventsDataTableProps) {
  return <EventsDataTableClient initialData={initialData} />;
}

function EventsDataTableClient({ initialData }: EventsDataTableProps) {
  const router = useRouter();
  const [q, setQ] = useQueryState("q", parseAsString.withDefault(""));
  const [view, setView] = useQueryState(
    "view",
    parseAsString.withDefault("events")
  );
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [size, setSize] = useQueryState("size", parseAsInteger.withDefault(10));
  const [sort, setSort] = useQueryState(
    "sort",
    parseAsString.withDefault("date.desc")
  );

  const [sorting, setSorting] = React.useState<SortingState>([
    {
      id: "date",
      desc: true,
    },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  // Transform column filters to the expected format (memoized)
  const transformedFilters = React.useMemo(() => {
    return columnFilters.map((filter) => ({
      id: filter.id,
      value: (() => {
        if (Array.isArray(filter.value)) {
          return filter.value.filter(
            (v): v is string => typeof v === "string"
          );
        }
        if (typeof filter.value === "string") {
          return [filter.value];
        }
        return [];
      })(),
    }));
  }, [columnFilters]);

  // Use SWR for data fetching with automatic deduplication and caching
  const { data, isLoading, error, mutate } = usePaginatedData(
    getPaginatedEvents,
    {
      page,
      pageSize: size,
      q,
      view,
      sort,
      columnFilters: transformedFilters,
    },
    {
      // Use initial data on first render to prevent flash
      fallbackData: initialData,
    }
  );

  // Use data from SWR (falls back to initialData) - type assertion for events
  const currentData: { events: Event[]; total: number } =
    (data && 'events' in data)
      ? data as { events: Event[]; total: number }
      : initialData || { events: [], total: 0 };

  // Handle delete event
  const handleDeleteEvent = async (eventId: string) => {
    try {
      const result = await deleteEvent(eventId);
      if (result.status === "success") {
        toast.success("Event deleted successfully");
        // Revalidate SWR cache to show updated data
        await mutate();
        router.refresh();
      } else {
        toast.error(result.message || "Failed to delete event");
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? `Error: ${error.message}`
          : "An unexpected error occurred. Please try again."
      );
    }
  };

  // Move the columns definition inside the component
  const createColumns = (): ColumnDef<Event>[] => [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Event Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <span>{row.getValue("name")}</span>;
      },
      filterFn: (row, id, filterValue: string) => {
        return row.original.name
          .toLowerCase()
          .includes(filterValue.toLowerCase());
      },
    },
    {
      accessorKey: "date",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const date = row.getValue("date") as Date;
        return format(date, "MMM d, yyyy");
      },
      sortingFn: (rowA, rowB) => {
        const dateA = rowA.original.date;
        const dateB = rowB.original.date;
        return dateA.getTime() - dateB.getTime();
      },
    },
    {
      accessorKey: "venue",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Venue
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <span>{row.getValue("venue")}</span>;
      },
      filterFn: (row, id, filterValue: string) => {
        return row.original.venue
          .toLowerCase()
          .includes(filterValue.toLowerCase());
      },
    },
    {
      accessorKey: "location",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Location
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <span>{row.getValue("location")}</span>;
      },
      filterFn: (row, id, filterValue: string) => {
        return row.original.location
          .toLowerCase()
          .includes(filterValue.toLowerCase());
      },
    },
    {
      accessorKey: "mainEvent",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Main Event
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <span>{row.getValue("mainEvent")}</span>;
      },
      filterFn: (row, id, filterValue: string) => {
        return row.original.mainEvent
          .toLowerCase()
          .includes(filterValue.toLowerCase());
      },
    },
    {
      accessorKey: "coMainEvent",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Co-Main Event
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const value = row.getValue("coMainEvent") as string | null;
        return <span>{value || "-"}</span>;
      },
      filterFn: (row, id, filterValue: string) => {
        const value = row.original.coMainEvent || "";
        return value.toLowerCase().includes(filterValue.toLowerCase());
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => {
        return (
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Status
              <ArrowUpDown className="ml-2 h-4" />
            </Button>
            <StatusFilter column={column} />
          </div>
        );
      },
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const colorClass =
          status === "UPCOMING"
            ? "bg-green-500 dark:bg-green-400"
            : status === "COMPLETED"
              ? "bg-blue-500 dark:bg-blue-400"
              : status === "CANCELLED"
                ? "bg-red-500 dark:bg-red-400"
                : "bg-gray-500 dark:bg-gray-400";
        return (
          <Badge variant="outline" className="text-muted-foreground px-1.5">
            <span className="relative flex items-center gap-1.5">
              <span className="relative flex size-2">
                <span
                  className={
                    `animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ` +
                    colorClass
                  }
                />
                <span
                  className={
                    `relative inline-flex size-2 rounded-full ` + colorClass
                  }
                />
              </span>
              {status}
            </span>
          </Badge>
        );
      },
      sortingFn: (rowA, rowB) => {
        const statusA = rowA.original.status;
        const statusB = rowB.original.status;

        // Custom sorting: UPCOMING first, then COMPLETED, then CANCELLED
        const statusOrder: Record<string, number> = {
          UPCOMING: 1,
          COMPLETED: 2,
          CANCELLED: 3,
        };
        return statusOrder[statusA] - statusOrder[statusB];
      },
      filterFn: (row, id, filterValues: string[]) => {
        if (!filterValues.length) return true;
        const status = row.getValue(id) as string;
        return filterValues.includes(status);
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <ActionsCell
          event={row.original}
          onDelete={() => handleDeleteEvent(row.original.id)}
        />
      ),
    },
  ];

  // Initialize sorting state when component mounts
  React.useEffect(() => {
    if (sort && !sorting.length) {
      const sortParts = sort.split(".");
      if (sortParts.length === 2) {
        setSorting([
          {
            id: sortParts[0],
            desc: sortParts[1] === "desc",
          },
        ]);
      }
    }
  }, [sort, sorting.length]);

  // Reset sorting when view changes to ensure proper default sorting
  React.useEffect(() => {
    if (view === "events" && !sort) {
      setSort("date.desc");
      setSorting([
        {
          id: "date",
          desc: true,
        },
      ]);
    } else if (view === "upcoming") {
      setSort("date.asc");
      setSorting([
        {
          id: "date",
          desc: false,
        },
      ]);
    } else if (view === "completed") {
      setSort("date.desc");
      setSorting([
        {
          id: "date",
          desc: true,
        },
      ]);
    } else if (view === "cancelled") {
      setSort("date.desc");
      setSorting([
        {
          id: "date",
          desc: true,
        },
      ]);
    }
  }, [view, sort, setSort]);


  const columns = createColumns();

  const table = useReactTable({
    data: currentData.events,
    columns,
    pageCount: Math.ceil(currentData.total / size),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination: {
        pageIndex: page - 1,
        pageSize: size,
      },
    },
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const newPagination = updater({
          pageIndex: page - 1,
          pageSize: size,
        });
        setPage(newPagination.pageIndex + 1);
        setSize(newPagination.pageSize);
      }
    },
    onSortingChange: (updater) => {
      const next = typeof updater === "function" ? updater(sorting) : updater;
      setSorting(next);

      // Create multi-column sort string
      if (next.length > 0) {
        const sortString = next
          .map((s) => `${s.id}.${s.desc ? "desc" : "asc"}`)
          .join(",");
        setSort(sortString);
      } else {
        setSort(null);
      }
    },
    onColumnFiltersChange: (updater) => {
      const next =
        typeof updater === "function" ? updater(columnFilters) : updater;
      setColumnFilters(next);
      setPage(1); // Reset to first page when changing filters
    },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    // Remove getSortedRowModel since we're using manual sorting
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
  });

  return (
    <Tabs
      defaultValue="events"
      value={view}
      onValueChange={setView}
      className="w-full flex-col justify-start gap-6"
    >
      <div className="flex items-center justify-between px-4 lg:px-6">
        <Label htmlFor="view-selector" className="sr-only">
          View
        </Label>
        <Select
          value={view}
          onValueChange={(newView) => {
            setView(newView);
            setPage(1); // Reset to first page when changing view
          }}
        >
          <SelectTrigger className="flex w-fit" size="sm" id="view-selector">
            <SelectValue placeholder="Select a view" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="events">All Events</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2">
          <Button variant="default" size="sm" asChild>
            <Link href="/dashboard/events/new">
              <PlusCircle className="h-4 w-4" />
              <span className="hidden lg:inline">Add Event</span>
            </Link>
          </Button>
        </div>
      </div>

      <TabsContent
        value={view}
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <div className="flex items-center gap-4 py-4">
          <Input
            placeholder="Filter by name, venue, location, main event, or co-main event..."
            value={q}
            onChange={(event) => {
              setQ(event.target.value || null);
              setPage(1); // Reset to first page when searching
            }}
            className="max-w-lg"
          />
        </div>

        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="bg-muted sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={table.getAllColumns().length}
                    className="h-24 text-center"
                  >
                    No events found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between px-4">
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Rows per page
              </Label>
              <Select
                value={`${size}`}
                onValueChange={(value) => {
                  setSize(Number(value));
                }}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue placeholder={size} />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page {page} of {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => setPage(1)}
                disabled={page === 1}
              >
                <span className="sr-only">Go to first page</span>
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => setPage(page + 1)}
                disabled={page === table.getPageCount()}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => setPage(table.getPageCount())}
                disabled={page === table.getPageCount()}
              >
                <span className="sr-only">Go to last page</span>
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
