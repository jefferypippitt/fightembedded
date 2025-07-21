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
  getSortedRowModel,
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
  CircleCheck,
  CircleX,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Athlete } from "@/types/athlete";
import { deleteAthlete } from "@/server/actions/delete-athlete";
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

// Helper component for the rank and name cell
const RankAndNameCell = ({
  athlete,
  table,
  activeView,
}: {
  athlete: Athlete;
  table: ReturnType<typeof useReactTable<Athlete>>;
  activeView: string;
}) => {
  // Get the current filtered and sorted data
  const filteredRows = table.getFilteredRowModel().rows;

  // Find the athlete's position in the current filtered view
  const athleteIndex = filteredRows.findIndex(
    (filteredRow) => filteredRow.original.id === athlete.id
  );

  // Calculate the rank within the filtered view (1-based index)
  const rankInFilteredView = athleteIndex >= 0 ? athleteIndex + 1 : null;

  // Check if the athlete has a valid rank in the database
  const hasValidRank =
    athlete.rank !== null &&
    athlete.rank !== undefined &&
    athlete.rank > 0 &&
    !athlete.retired;

  // For champions, undefeated, retired views, show the actual rank
  // For other views, show the position in the filtered view
  const displayRank = (() => {
    return activeView === "champions" ||
      activeView === "undefeated" ||
      activeView === "retired"
      ? athlete.rank
      : rankInFilteredView;
  })();

  return (
    <div className="flex items-center gap-2">
      {activeView === "p4p" ? (
        // For P4P view, show the actual division rank, not P4P rank
        hasValidRank ? (
          <Badge
            variant="outline"
            className="min-w-8 h-6 flex items-center justify-center px-1"
          >
            #{athlete.rank}
          </Badge>
        ) : (
          <Badge
            variant="outline"
            className="w-8 h-6 flex items-center justify-center"
          >
            NR
          </Badge>
        )
      ) : // For other views, use regular rank validation
      hasValidRank ? (
        <Badge
          variant="outline"
          className="min-w-8 h-6 flex items-center justify-center px-1"
        >
          #{displayRank}
        </Badge>
      ) : (
        <Badge
          variant="outline"
          className="w-8 h-6 flex items-center justify-center"
        >
          NR
        </Badge>
      )}
      <span>{athlete.name}</span>
    </div>
  );
};

// Helper component for the actions cell
const ActionsCell = ({ athlete }: { athlete: Athlete }) => {
  const router = useRouter();

  const handleDelete = async () => {
    try {
      const success = await deleteAthlete(athlete.id);
      if (success) {
        toast.success("Athlete deleted successfully");
        router.refresh();
      } else {
        toast.error("Failed to delete athlete");
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? `Error: ${error.message}`
          : "An unexpected error occurred. Please try again."
      );
    }
  };

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
          <Link href={`/dashboard/athletes/${athlete.id}/edit`}>Edit</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDelete} className="text-red-600">
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Helper component for the weight division filter
const WeightDivisionFilter = ({
  column,
}: {
  column: Column<Athlete, unknown>;
}) => {
  const maleDivisions = [
    "Flyweight",
    "Bantamweight",
    "Featherweight",
    "Lightweight",
    "Welterweight",
    "Middleweight",
    "Light Heavyweight",
    "Heavyweight",
  ];

  const femaleDivisions = [
    "Women's Strawweight",
    "Women's Flyweight",
    "Women's Bantamweight",
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Filter weight divisions</span>
          <Filter className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Male Divisions</DropdownMenuLabel>
        {maleDivisions.map((division) => (
          <DropdownMenuCheckboxItem
            key={division}
            checked={(column.getFilterValue() as string[])?.includes(division)}
            onCheckedChange={(checked) => {
              const currentFilter = (column.getFilterValue() as string[]) ?? [];
              if (checked) {
                column.setFilterValue([...currentFilter, division]);
              } else {
                column.setFilterValue(
                  currentFilter.filter((item) => item !== division)
                );
              }
            }}
          >
            {division}
          </DropdownMenuCheckboxItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Female Divisions</DropdownMenuLabel>
        {femaleDivisions.map((division) => (
          <DropdownMenuCheckboxItem
            key={division}
            checked={(column.getFilterValue() as string[])?.includes(division)}
            onCheckedChange={(checked) => {
              const currentFilter = (column.getFilterValue() as string[]) ?? [];
              if (checked) {
                column.setFilterValue([...currentFilter, division]);
              } else {
                column.setFilterValue(
                  currentFilter.filter((item) => item !== division)
                );
              }
            }}
          >
            {division}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Move the columns definition inside the component to access activeView
const createColumns = (activeView: string): ColumnDef<Athlete>[] => [
  {
    id: "rankAndName",
    accessorFn: (row) => ({
      rank: row.rank,
      name: row.name,
    }),
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Rank
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row, table }) => {
      return (
        <RankAndNameCell
          athlete={row.original}
          table={table}
          activeView={activeView}
        />
      );
    },
    sortingFn: (rowA, rowB) => {
      // Handle retired athletes - they should be at the bottom
      if (rowA.original.retired && !rowB.original.retired) return 1;
      if (!rowA.original.retired && rowB.original.retired) return -1;

      // Handle null/undefined ranks
      const rankA = rowA.original.rank ?? 0;
      const rankB = rowB.original.rank ?? 0;

      // If both are unranked (rank 0 or null), sort by name
      if (rankA === 0 && rankB === 0) {
        return rowA.original.name.localeCompare(rowB.original.name);
      }

      // If only one is unranked, put the ranked one first
      if (rankA === 0) return 1;
      if (rankB === 0) return -1;

      // Both are ranked, sort by rank
      return rankA - rankB;
    },
    filterFn: (row, id, filterValue: string) => {
      return row.original.name
        .toLowerCase()
        .includes(filterValue.toLowerCase());
    },
  },
  {
    accessorKey: "poundForPoundRank",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          P4P Rank
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const athlete = row.original;
      const p4pRank = row.getValue("poundForPoundRank") as
        | number
        | null
        | undefined;

      return p4pRank !== null &&
        p4pRank !== undefined &&
        p4pRank > 0 &&
        !athlete.retired ? (
        <Badge
          variant="outline"
          className="min-w-8 h-6 flex items-center justify-center px-1"
        >
          {`#${p4pRank}`}
        </Badge>
      ) : (
        <Badge
          variant="outline"
          className="w-8 h-6 flex items-center justify-center"
        >
          NR
        </Badge>
      );
    },
    sortingFn: (rowA, rowB) => {
      // Handle retired athletes - they should be at the bottom
      if (rowA.original.retired && !rowB.original.retired) return 1;
      if (!rowA.original.retired && rowB.original.retired) return -1;

      // Handle null/undefined P4P ranks
      const p4pRankA = rowA.original.poundForPoundRank ?? 0;
      const p4pRankB = rowB.original.poundForPoundRank ?? 0;

      // If both are unranked (rank 0 or null), sort by name
      if (p4pRankA === 0 && p4pRankB === 0) {
        return rowA.original.name.localeCompare(rowB.original.name);
      }

      // If only one is unranked, put the ranked one first
      if (p4pRankA === 0) return 1;
      if (p4pRankB === 0) return -1;

      // Both are ranked, sort by P4P rank
      return p4pRankA - p4pRankB;
    },
  },
  {
    accessorKey: "weightDivision",
    header: ({ column }) => {
      return (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Weight Division
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
          <WeightDivisionFilter column={column} />
        </div>
      );
    },
    cell: ({ row }) => (
      <Badge variant="outline" className="text-muted-foreground px-1.5">
        {row.getValue("weightDivision")}
      </Badge>
    ),
    filterFn: (row, id, filterValues: string[]) => {
      if (!filterValues.length) return true;
      const weightDivision = (row.getValue(id) as string).toLowerCase();
      return filterValues.some((filter) => {
        const normalizedFilter = filter.toLowerCase();

        // Direct match
        if (weightDivision === normalizedFilter) return true;

        // Handle different naming conventions
        const divisionWithoutPrefix = weightDivision.replace(
          /^(men's|women's|male|female)\s+/i,
          ""
        );
        const filterWithoutPrefix = normalizedFilter.replace(
          /^(men's|women's|male|female)\s+/i,
          ""
        );

        // Match without gender prefixes
        if (divisionWithoutPrefix === filterWithoutPrefix) return true;

        // Handle specific cases
        if (
          weightDivision.includes(normalizedFilter) ||
          normalizedFilter.includes(divisionWithoutPrefix)
        ) {
          return true;
        }

        return false;
      });
    },
  },
  {
    accessorKey: "gender",
    header: ({ column }) => {
      return (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Gender
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Filter gender</span>
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by Gender</DropdownMenuLabel>
              <DropdownMenuCheckboxItem
                checked={(column.getFilterValue() as string[])?.includes(
                  "MALE"
                )}
                onCheckedChange={(checked) => {
                  const currentFilter =
                    (column.getFilterValue() as string[]) ?? [];
                  if (checked) {
                    column.setFilterValue([...currentFilter, "MALE"]);
                  } else {
                    column.setFilterValue(
                      currentFilter.filter((item) => item !== "MALE")
                    );
                  }
                }}
              >
                Male
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={(column.getFilterValue() as string[])?.includes(
                  "FEMALE"
                )}
                onCheckedChange={(checked) => {
                  const currentFilter =
                    (column.getFilterValue() as string[]) ?? [];
                  if (checked) {
                    column.setFilterValue([...currentFilter, "FEMALE"]);
                  } else {
                    column.setFilterValue(
                      currentFilter.filter((item) => item !== "FEMALE")
                    );
                  }
                }}
              >
                Female
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
    cell: ({ row }) => (
      <Badge variant="outline" className="text-muted-foreground px-1.5">
        {row.getValue("gender") === "MALE" ? "Male" : "Female"}
      </Badge>
    ),
    filterFn: (row, id, filterValues: string[]) => {
      if (!filterValues.length) return true;
      const gender = row.getValue(id) as string;
      return filterValues.includes(gender);
    },
  },
  {
    accessorKey: "country",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Country
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "record",
    header: "Record",
    cell: ({ row }) => {
      const athlete = row.original;
      return `${athlete.wins}-${athlete.losses}-${athlete.draws}`;
    },
  },
  {
    accessorKey: "winsByKo",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          KO Wins
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "winsBySubmission",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Sub Wins
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "retired",
    header: "Status",
    cell: ({ row }) => {
      const retired = row.getValue("retired");
      return (
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {retired ? (
            <CircleX className="mr-1 h-3 w-3 text-red-500 dark:text-red-400" />
          ) : (
            <CircleCheck className="mr-1 h-3 w-3 text-green-500 dark:text-green-400" />
          )}
          {retired ? "Retired" : "Active"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell athlete={row.original} />,
  },
];

interface AthletesDataTableProps {
  athletes: Athlete[];
  undefeatedAthletes: Athlete[];
  retiredAthletes: Athlete[];
  champions: Athlete[];
  p4pAthletes: Athlete[];
}

export function AthletesDataTable({
  athletes,
  undefeatedAthletes,
  retiredAthletes,
  champions,
  p4pAthletes,
}: AthletesDataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([
    {
      id: "rankAndName",
      desc: false,
    },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [selectedGender, setSelectedGender] = React.useState<
    "ALL" | "MALE" | "FEMALE"
  >("ALL");

  const [activeView, setActiveView] = React.useState("athletes");

  const currentData = React.useMemo(() => {
    let data: Athlete[] = [];

    switch (activeView) {
      case "undefeated":
        data = undefeatedAthletes;
        break;
      case "retired":
        data = retiredAthletes;
        break;
      case "champions":
        data = champions;

        // Apply gender filtering for champions
        if (selectedGender !== "ALL") {
          data = data.filter((athlete) => athlete.gender === selectedGender);
        } else {
          // For ALL view, separate male and female champions
          const maleChampions = data.filter(
            (athlete) => athlete.gender === "MALE"
          );
          const femaleChampions = data.filter(
            (athlete) => athlete.gender === "FEMALE"
          );

          // Return combined array with male champions first, then female
          data = [...maleChampions, ...femaleChampions];
        }
        break;
      case "p4p":
        data = p4pAthletes;
        break;
      case "athletes":
      default:
        data = athletes;
        break;
    }

    // Apply gender filtering to all views (except Champions which handles it internally)
    if (activeView !== "champions" && selectedGender !== "ALL") {
      data = data.filter((athlete) => athlete.gender === selectedGender);
    }

    return data;
  }, [
    activeView,
    athletes,
    undefeatedAthletes,
    retiredAthletes,
    champions,
    p4pAthletes,
    selectedGender,
  ]);

  const columns = createColumns(activeView);

  const table = useReactTable({
    data: currentData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination,
    },
  });

  // Ensure proper sorting when filters are applied
  React.useEffect(() => {
    const weightDivisionFilter = columnFilters.find(
      (filter) => filter.id === "weightDivision"
    );
    if (weightDivisionFilter && weightDivisionFilter.value) {
      // Ensure the table is sorted by rank when a weight division filter is applied
      if (sorting.length === 0 || sorting[0].id !== "rankAndName") {
        setSorting([{ id: "rankAndName", desc: false }]);
      }
    }
  }, [columnFilters, sorting]);

  // Update sorting when active view changes
  React.useEffect(() => {
    if (activeView === "p4p") {
      // For P4P view, sort by P4P rank
      setSorting([{ id: "poundForPoundRank", desc: false }]);
    } else if (activeView === "champions") {
      // For champions view, sort by rank
      setSorting([{ id: "rankAndName", desc: false }]);
    } else if (activeView === "undefeated") {
      // For undefeated view, sort by rank
      setSorting([{ id: "rankAndName", desc: false }]);
    } else if (activeView === "retired") {
      // For retired view, sort by rank
      setSorting([{ id: "rankAndName", desc: false }]);
    } else {
      // For athletes view, sort by rank
      setSorting([{ id: "rankAndName", desc: false }]);
    }
  }, [activeView]);

  return (
    <Tabs
      defaultValue="athletes"
      value={activeView}
      onValueChange={setActiveView}
      className="w-full flex-col justify-start gap-6"
    >
      <div className="flex items-center justify-between px-4 lg:px-6">
        <Label htmlFor="view-selector" className="sr-only">
          View
        </Label>
        <Select value={activeView} onValueChange={setActiveView}>
          <SelectTrigger className="flex w-fit" size="sm" id="view-selector">
            <SelectValue placeholder="Select a view" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="athletes">All Athletes</SelectItem>
            <SelectItem value="champions">Champions</SelectItem>
            <SelectItem value="undefeated">Undefeated</SelectItem>
            <SelectItem value="retired">Retired</SelectItem>
            <SelectItem value="p4p">P4P Rankings</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/athletes/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              <span className="hidden lg:inline">Add Athlete</span>
            </Link>
          </Button>
        </div>
      </div>

      <TabsContent
        value="athletes"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <div className="flex items-center gap-4 py-4">
          <Input
            placeholder="Filter by name..."
            value={
              (table.getColumn("rankAndName")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("rankAndName")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <Select
            value={selectedGender}
            onValueChange={(value: "ALL" | "MALE" | "FEMALE") =>
              setSelectedGender(value)
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Genders</SelectItem>
              <SelectItem value="MALE">Male</SelectItem>
              <SelectItem value="FEMALE">Female</SelectItem>
            </SelectContent>
          </Select>
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
                    No athletes found.
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
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
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
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent
        value="champions"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <div className="flex items-center gap-4 py-4">
          <Input
            placeholder="Filter by name..."
            value={
              (table.getColumn("rankAndName")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("rankAndName")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <Select
            value={selectedGender}
            onValueChange={(value: "ALL" | "MALE" | "FEMALE") =>
              setSelectedGender(value)
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Genders</SelectItem>
              <SelectItem value="MALE">Male</SelectItem>
              <SelectItem value="FEMALE">Female</SelectItem>
            </SelectContent>
          </Select>
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
                    No champions found.
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
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
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
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent
        value="undefeated"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <div className="flex items-center gap-4 py-4">
          <Input
            placeholder="Filter by name..."
            value={
              (table.getColumn("rankAndName")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("rankAndName")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <Select
            value={selectedGender}
            onValueChange={(value: "ALL" | "MALE" | "FEMALE") =>
              setSelectedGender(value)
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Genders</SelectItem>
              <SelectItem value="MALE">Male</SelectItem>
              <SelectItem value="FEMALE">Female</SelectItem>
            </SelectContent>
          </Select>
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
                    No undefeated athletes found.
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
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
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
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent
        value="retired"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <div className="flex items-center gap-4 py-4">
          <Input
            placeholder="Filter by name..."
            value={
              (table.getColumn("rankAndName")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("rankAndName")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <Select
            value={selectedGender}
            onValueChange={(value: "ALL" | "MALE" | "FEMALE") =>
              setSelectedGender(value)
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Genders</SelectItem>
              <SelectItem value="MALE">Male</SelectItem>
              <SelectItem value="FEMALE">Female</SelectItem>
            </SelectContent>
          </Select>
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
                    No retired athletes found.
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
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
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
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent
        value="p4p"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <div className="flex items-center gap-4 py-4">
          <Input
            placeholder="Filter by name..."
            value={
              (table.getColumn("rankAndName")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("rankAndName")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <Select
            value={selectedGender}
            onValueChange={(value: "ALL" | "MALE" | "FEMALE") =>
              setSelectedGender(value)
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Genders</SelectItem>
              <SelectItem value="MALE">Male</SelectItem>
              <SelectItem value="FEMALE">Female</SelectItem>
            </SelectContent>
          </Select>
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
                    No P4P ranked athletes found (ranks 1-15).
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
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
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
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
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
