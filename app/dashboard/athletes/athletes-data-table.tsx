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
import { toast } from "sonner";

import { Athlete } from "@/types/athlete";
import { deleteAthlete } from "@/server/actions/athlete";
import { getPaginatedAthletes } from "@/server/actions/get-paginated-athletes";
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
    "Men's Flyweight",
    "Men's Bantamweight",
    "Men's Featherweight",
    "Men's Lightweight",
    "Men's Welterweight",
    "Men's Middleweight",
    "Men's Light Heavyweight",
    "Men's Heavyweight",
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

// Move the columns definition inside the component
const createColumns = (): ColumnDef<Athlete>[] => [
  {
    id: "rank",
    accessorFn: (row) => {
      // Always return the actual rank value for proper sorting
      return row.rank ?? 0;
    },
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
    cell: ({ row }) => {
      const rank = row.original.rank;
      return (
        <Badge
          variant="outline"
          className="min-w-8 h-6 flex items-center justify-center px-1"
        >
          {rank ? `#${rank}` : "NR"}
        </Badge>
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

      // If only one is unranked, put the unranked one after the ranked one
      if (rankA === 0) return 1; // A is unranked, put after B
      if (rankB === 0) return -1; // B is unranked, put after A

      // Both are ranked, sort by rank (champions first)
      return rankA - rankB;
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
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

      // Show P4P rank only if it's between 1-15
      return p4pRank !== null &&
        p4pRank !== undefined &&
        p4pRank >= 1 &&
        p4pRank <= 15 &&
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

      // Check if athletes are P4P ranked (1-15)
      const isP4PRankedA = p4pRankA >= 1 && p4pRankA <= 15;
      const isP4PRankedB = p4pRankB >= 1 && p4pRankB <= 15;

      // If both are P4P ranked, sort by P4P rank (1-15 in ascending order)
      if (isP4PRankedA && isP4PRankedB) {
        return p4pRankA - p4pRankB; // This ensures 1, 2, 3... 15 order
      }

      // If only one is P4P ranked, put the P4P ranked one first
      if (isP4PRankedA && !isP4PRankedB) return -1;
      if (!isP4PRankedA && isP4PRankedB) return 1;

      // If neither is P4P ranked, check division ranks
      const rankA = rowA.original.rank ?? 0;
      const rankB = rowB.original.rank ?? 0;

      // If both have division ranks, sort by division rank
      if (rankA > 0 && rankB > 0) {
        return rankA - rankB;
      }

      // If only one has division rank, put the ranked one first
      if (rankA > 0 && rankB === 0) return -1;
      if (rankA === 0 && rankB > 0) return 1;

      // If both are unranked, sort by name
      if (rankA === 0 && rankB === 0) {
        return rowA.original.name.localeCompare(rowB.original.name);
      }

      return 0;
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
    sortingFn: (rowA, rowB) => {
      // Handle retired athletes - they should be at the bottom
      if (rowA.original.retired && !rowB.original.retired) return 1;
      if (!rowA.original.retired && rowB.original.retired) return -1;

      // Sort by weight division
      const divisionA = rowA.original.weightDivision ?? "";
      const divisionB = rowB.original.weightDivision ?? "";

      if (divisionA !== divisionB) {
        return divisionA.localeCompare(divisionB);
      }

      // If divisions are equal, sort by name
      return rowA.original.name.localeCompare(rowB.original.name);
    },
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
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Gender
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <Badge variant="outline" className="text-muted-foreground px-1.5">
        {row.getValue("gender") === "MALE" ? "Male" : "Female"}
      </Badge>
    ),
    sortingFn: (rowA, rowB) => {
      // Handle retired athletes - they should be at the bottom
      if (rowA.original.retired && !rowB.original.retired) return 1;
      if (!rowA.original.retired && rowB.original.retired) return -1;

      // Sort by gender (MALE first, then FEMALE)
      const genderA = rowA.original.gender ?? "";
      const genderB = rowB.original.gender ?? "";

      if (genderA !== genderB) {
        return genderA.localeCompare(genderB);
      }

      // If genders are equal, sort by name
      return rowA.original.name.localeCompare(rowB.original.name);
    },
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
    sortingFn: (rowA, rowB) => {
      // Handle retired athletes - they should be at the bottom
      if (rowA.original.retired && !rowB.original.retired) return 1;
      if (!rowA.original.retired && rowB.original.retired) return -1;

      // Sort by country
      const countryA = rowA.original.country ?? "";
      const countryB = rowB.original.country ?? "";

      if (countryA !== countryB) {
        return countryA.localeCompare(countryB);
      }

      // If countries are equal, sort by name
      return rowA.original.name.localeCompare(rowB.original.name);
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
    sortingFn: (rowA, rowB) => {
      // Handle retired athletes - they should be at the bottom
      if (rowA.original.retired && !rowB.original.retired) return 1;
      if (!rowA.original.retired && rowB.original.retired) return -1;

      // Sort by KO wins
      const koWinsA = rowA.original.winsByKo ?? 0;
      const koWinsB = rowB.original.winsByKo ?? 0;

      if (koWinsA !== koWinsB) {
        return koWinsA - koWinsB;
      }

      // If KO wins are equal, sort by name
      return rowA.original.name.localeCompare(rowB.original.name);
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
    sortingFn: (rowA, rowB) => {
      // Handle retired athletes - they should be at the bottom
      if (rowA.original.retired && !rowB.original.retired) return 1;
      if (!rowA.original.retired && rowB.original.retired) return -1;

      // Sort by submission wins
      const subWinsA = rowA.original.winsBySubmission ?? 0;
      const subWinsB = rowB.original.winsBySubmission ?? 0;

      if (subWinsA !== subWinsB) {
        return subWinsA - subWinsB;
      }

      // If submission wins are equal, sort by name
      return rowA.original.name.localeCompare(rowB.original.name);
    },
  },
  {
    accessorKey: "retired",
    header: "Status",
    cell: ({ row }) => {
      const retired = row.getValue("retired") as boolean;
      return (
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          <span className="relative flex items-center gap-1.5">
            <span className="relative flex size-2">
              <span
                className={
                  `animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ` +
                  (retired
                    ? "bg-red-500 dark:bg-red-400"
                    : "bg-green-500 dark:bg-green-400")
                }
              />
              <span
                className={
                  `relative inline-flex size-2 rounded-full ` +
                  (retired
                    ? "bg-red-500 dark:bg-red-400"
                    : "bg-green-500 dark:bg-green-400")
                }
              />
            </span>
            {retired ? "Retired" : "Active"}
          </span>
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell athlete={row.original} />,
  },
];

export function AthletesDataTable() {
  const [q, setQ] = useQueryState("q", parseAsString.withDefault(""));
  const [view, setView] = useQueryState(
    "view",
    parseAsString.withDefault("athletes")
  );
  const [gender, setGender] = useQueryState(
    "gender",
    parseAsString.withDefault("ALL")
  );
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [size, setSize] = useQueryState("size", parseAsInteger.withDefault(10));
  const [sort, setSort] = useQueryState(
    "sort",
    parseAsString.withDefault("rank.asc")
  );

  const [data, setData] = React.useState<{
    athletes: Athlete[];
    total: number;
  }>({ athletes: [], total: 0 });

  const [sorting, setSorting] = React.useState<SortingState>([
    {
      id: "rank",
      desc: false,
    },
    {
      id: "name",
      desc: false,
    },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

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
    if (view === "athletes" && !sort) {
      setSort("rank.asc");
      setSorting([
        {
          id: "rank",
          desc: false,
        },
      ]);
    } else if (view === "p4p") {
      // For P4P view, always use poundForPoundRank ascending (1, 2, 3... 15)
      setSort("poundForPoundRank.asc");
      setSorting([
        {
          id: "poundForPoundRank",
          desc: false,
        },
      ]);
    }
  }, [view, sort, setSort]);

  React.useEffect(() => {
    const fetchData = async () => {
      // Transform column filters to the expected format
      const transformedFilters = columnFilters.map((filter) => ({
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

      const { athletes, total } = await getPaginatedAthletes({
        page,
        pageSize: size,
        q,
        view,
        gender,
        sort: sort,
        columnFilters: transformedFilters,
      });
      setData({ athletes, total });
    };

    fetchData();
  }, [page, size, q, view, gender, sort, columnFilters]);

  const columns = createColumns();

  const table = useReactTable({
    data: data.athletes,
    columns,
    pageCount: Math.ceil(data.total / size),
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
      defaultValue="athletes"
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
            <SelectItem value="athletes">All Athletes</SelectItem>
            <SelectItem value="champions">Champions</SelectItem>
            <SelectItem value="undefeated">Undefeated</SelectItem>
            <SelectItem value="retired">Retired</SelectItem>
            <SelectItem value="p4p">P4P Rankings</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2">
          <Button variant="default" size="sm" asChild>
            <Link href="/dashboard/athletes/new">
              <PlusCircle className="h-4 w-4" />
              <span className="hidden lg:inline">Add Athlete</span>
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
            placeholder="Filter by name..."
            value={q}
            onChange={(event) => {
              setQ(event.target.value || null);
              setPage(1); // Reset to first page when searching
            }}
            className="max-w-sm"
          />
          <Select
            value={gender}
            onValueChange={(value: "ALL" | "MALE" | "FEMALE") => {
              setGender(value);
              setPage(1); // Reset to first page when changing gender
            }}
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
