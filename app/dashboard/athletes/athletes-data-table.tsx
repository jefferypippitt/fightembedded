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
  Row,
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
  GripVertical,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// DnD Kit imports
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Athlete } from "@/types/athlete";
import { deleteAthlete, updateAthleteRanks } from "@/server/actions/athlete";
import { getPaginatedAthletes } from "@/server/actions/get-paginated-athletes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Switch } from "@/components/ui/switch";

// Drag Handle Component
const DragHandle = ({
  attributes,
  listeners,
  isDragging,
}: {
  attributes: React.HTMLAttributes<HTMLButtonElement>;
  listeners: unknown;
  isDragging: boolean;
}) => {
  return (
    <Button
      {...attributes}
      {...(listeners as React.HTMLAttributes<HTMLButtonElement>)}
      variant="ghost"
      size="icon"
      className={`text-muted-foreground size-7 hover:bg-transparent cursor-grab active:cursor-grabbing ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <GripVertical className="text-muted-foreground size-3" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  );
};

// Draggable Row Component
const DraggableRow = ({ row }: { row: Row<Athlete> }) => {
  const {
    attributes,
    listeners,
    transform,
    transition,
    setNodeRef,
    isDragging,
  } = useSortable({
    id: row.original.id,
  });

  return (
    <TableRow
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      data-dragging={isDragging}
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {cell.column.id === "drag" ? (
            <DragHandle
              attributes={attributes}
              listeners={listeners}
              isDragging={isDragging}
            />
          ) : (
            flexRender(cell.column.columnDef.cell, cell.getContext())
          )}
        </TableCell>
      ))}
    </TableRow>
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
        // Force immediate refresh for live environment
        router.refresh();
        // Also reload to ensure all data is fresh
        window.location.reload();
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
    id: "drag",
    header: () => null,
    cell: () => null, // This will be handled by DraggableRow
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "displayRank",
    header: "Position",
    cell: ({ row }) => {
      // Show position in the current filtered list
      const rowIndex = row.index;
      return (
        <Badge
          variant="outline"
          className="min-w-8 h-6 flex items-center justify-center px-1 bg-primary/10"
        >
          {rowIndex + 1}
        </Badge>
      );
    },
    enableSorting: false,
  },
  {
    id: "rank",
    accessorFn: (row) => {
      // Always return the actual rank value for proper sorting
      return row.rank ?? 0;
    },
    header: ({ column }) => {
      return (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Rank
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const rank = row.original.rank;
      const isRetired = row.original.retired;

      // For retired athletes, show "NR" instead of rank numbers
      // This makes it clear that these are not active division rankings
      if (isRetired) {
        return (
          <div className="flex justify-center">
            <Badge
              variant="outline"
              className="min-w-8 h-6 flex items-center justify-center px-1"
            >
              NR
            </Badge>
          </div>
        );
      }

      // For active athletes, show rank as normal
      return (
        <div className="flex justify-center">
          <Badge
            variant="outline"
            className="min-w-8 h-6 flex items-center justify-center px-1"
          >
            {rank ? `#${rank}` : "NR"}
          </Badge>
        </div>
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
        <div className="flex justify-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            P4P Rank
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const athlete = row.original;
      const p4pRank = row.getValue("poundForPoundRank") as
        | number
        | null
        | undefined;

      // Show P4P rank only if it's between 1-15
      return (
        <div className="flex justify-center">
          {p4pRank !== null &&
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
          )}
        </div>
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
        <div className="flex items-center justify-center space-x-2">
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
      <div className="flex justify-center">
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {row.getValue("weightDivision")}
        </Badge>
      </div>
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
        <div className="flex justify-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Gender
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {row.getValue("gender") === "MALE" ? "Male" : "Female"}
        </Badge>
      </div>
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
        <div className="flex justify-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Country
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="flex justify-center">{row.getValue("country")}</div>
    ),
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
        <div className="flex justify-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            KO Wins
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="flex justify-center">{row.getValue("winsByKo")}</div>
    ),
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
        <div className="flex justify-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Sub Wins
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="flex justify-center">
        {row.getValue("winsBySubmission")}
      </div>
    ),
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
  const router = useRouter();
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

  // Add reorder mode state
  const [isReorderMode, setIsReorderMode] = React.useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);
  const [originalAthletes, setOriginalAthletes] = React.useState<Athlete[]>([]);

  // Dialog state
  const [showExitDialog, setShowExitDialog] = React.useState(false);
  const [showViewChangeDialog, setShowViewChangeDialog] = React.useState(false);
  const [pendingViewChange, setPendingViewChange] = React.useState<
    string | null
  >(null);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  // DnD sensors
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor)
  );

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

  // Set initial sort if none exists
  React.useEffect(() => {
    if (!sort && !sorting.length) {
      if (view === "athletes") {
        setSort("rank.asc");
      } else if (view === "p4p") {
        setSort("poundForPoundRank.asc");
      }
    }
  }, [sort, sorting.length, view, setSort]);

  // Reset sorting when view changes to ensure proper default sorting
  React.useEffect(() => {
    if (view === "athletes") {
      // For All Athletes view, always use rank ascending
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
    } else if (view === "champions") {
      // For Champions view, sort by weight division then name
      setSort("weightDivision.asc");
      setSorting([
        {
          id: "weightDivision",
          desc: false,
        },
      ]);
    } else if (view === "undefeated") {
      // For Undefeated view, sort by rank then name
      setSort("rank.asc");
      setSorting([
        {
          id: "rank",
          desc: false,
        },
      ]);
    } else if (view === "retired") {
      // For Retired view, sort by rank (retirement order)
      setSort("rank.asc");
      setSorting([
        {
          id: "rank",
          desc: false,
        },
      ]);
    }
  }, [view, setSort]);

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

      // Update original athletes whenever data changes (for reorder mode)
      // This ensures that when filters change, we have the correct baseline
      if (athletes.length > 0) {
        setOriginalAthletes([...athletes]);
        // Only reset reorder mode when filters change, not when entering reorder mode
        // We'll handle this more carefully
      }
    };

    fetchData();
  }, [
    page,
    size,
    q,
    view,
    gender,
    sort,
    columnFilters,
    // Remove these dependencies that were causing reorder mode to reset
    // originalAthletes.length,
    // isReorderMode,
    // setIsReorderMode,
    // setHasUnsavedChanges,
  ]);

  // Separate effect to handle resetting reorder mode when filters change
  const prevFiltersRef = React.useRef({ q, view, gender, columnFilters });

  React.useEffect(() => {
    // Only reset reorder mode if filters have actually changed and we're in reorder mode
    const currentFilters = { q, view, gender, columnFilters };
    const prevFilters = prevFiltersRef.current;

    const filtersChanged =
      prevFilters.q !== currentFilters.q ||
      prevFilters.view !== currentFilters.view ||
      prevFilters.gender !== currentFilters.gender ||
      JSON.stringify(prevFilters.columnFilters) !==
        JSON.stringify(currentFilters.columnFilters);

    if (filtersChanged && isReorderMode) {
      setIsReorderMode(false);
      setHasUnsavedChanges(false);
    }

    prevFiltersRef.current = currentFilters;
  }, [q, view, gender, columnFilters, isReorderMode]);

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

  // Handle drag and drop end
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active && over && active.id !== over.id) {
      const oldIndex = data.athletes.findIndex(
        (athlete) => athlete.id === active.id
      );
      const newIndex = data.athletes.findIndex(
        (athlete) => athlete.id === over.id
      );

      if (oldIndex !== -1 && newIndex !== -1) {
        // Create new array with reordered athletes
        const newAthletes = arrayMove(data.athletes, oldIndex, newIndex);

        // Update local state immediately for responsive UI
        setData((prev) => ({ ...prev, athletes: newAthletes }));

        // Mark that we have unsaved changes
        setHasUnsavedChanges(true);
      }
    }
  };

  // Toggle reorder mode
  const toggleReorderMode = async (checked: boolean) => {
    if (checked) {
      // Entering reorder mode - save current state
      setOriginalAthletes([...data.athletes]);
      setIsReorderMode(true);
      setHasUnsavedChanges(false);
    } else {
      // Exiting reorder mode
      if (hasUnsavedChanges) {
        // If we have unsaved changes, save them automatically
        try {
          await saveAllChanges();
          // After successful save, exit reorder mode
          setIsReorderMode(false);
        } catch (error) {
          console.error("Failed to auto-save:", error);
          // If save fails, keep reorder mode active and show error
          toast.error("Failed to save changes. Please try again.");
          return; // Don't exit reorder mode if save failed
        }
      } else {
        setIsReorderMode(false);
      }
    }
  };

  // Handle exit reorder mode confirmation
  const handleExitReorderMode = () => {
    setIsReorderMode(false);
    setHasUnsavedChanges(false);
    // Restore original order
    setData((prev) => ({ ...prev, athletes: originalAthletes }));
    setShowExitDialog(false);
  };

  // Add a refresh function to force fresh data
  const refreshData = React.useCallback(async () => {
    try {
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

      // Update original athletes whenever data changes (for reorder mode)
      if (athletes.length > 0) {
        setOriginalAthletes([...athletes]);
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast.error("Failed to refresh data");
    }
  }, [page, size, q, view, gender, sort, columnFilters]);

  // Add refresh button to the UI
  const handleRefresh = () => {
    refreshData();
    toast.success("Data refreshed");
  };

  // Save all changes
  const saveAllChanges = async () => {
    if (!hasUnsavedChanges) return;

    try {
      // Determine which rank field to update based on the current view
      const isP4PView = view === "p4p";
      const isRetiredView = view === "retired";

      let rankUpdates;

      if (isRetiredView) {
        // For retired athletes, we'll use the rank field to store their retirement order
        // This represents their legacy ranking or display order
        rankUpdates = data.athletes.map((athlete, index) => {
          const newRetirementOrder = index + 1;

          return {
            id: athlete.id,
            rank: newRetirementOrder,
          };
        });
      } else {
        // For active athletes (regular and P4P views)
        rankUpdates = data.athletes
          .filter((athlete) => !athlete.retired) // Only active athletes
          .map((athlete, index) => {
            // Check if this athlete had a rank in the original data
            const originalAthlete = originalAthletes.find(
              (oa) => oa.id === athlete.id
            );

            // For P4P view, check poundForPoundRank; for regular view, check rank
            const originalRankValue = isP4PView
              ? originalAthlete?.poundForPoundRank
              : originalAthlete?.rank;

            // If the athlete was originally unranked (rank = 0 or null), keep them unranked
            // If they had a rank > 0, give them a new rank based on position
            const wasOriginallyUnranked =
              !originalAthlete || !originalRankValue || originalRankValue === 0;

            const newRankValue = wasOriginallyUnranked ? 0 : index + 1;

            // Return the appropriate update object
            if (isP4PView) {
              return {
                id: athlete.id,
                poundForPoundRank: newRankValue,
              };
            } else {
              return {
                id: athlete.id,
                rank: newRankValue,
              };
            }
          })
          .filter((update) => {
            const rankValue = isP4PView
              ? (update as { id: string; poundForPoundRank: number })
                  .poundForPoundRank
              : (update as { id: string; rank: number }).rank;
            return rankValue > 0;
          }); // Only include athletes that need rank updates
      }

      if (rankUpdates.length === 0) {
        toast.info("No rank changes to save");
        setHasUnsavedChanges(false);
        return;
      }

      // Update ranks in the database
      const result = await updateAthleteRanks(rankUpdates);

      if (result.status === "success") {
        toast.success(
          `${
            isP4PView ? "P4P" : isRetiredView ? "Retired Athlete" : "Athlete"
          } ranks updated successfully`
        );
        setHasUnsavedChanges(false);
        setOriginalAthletes([...data.athletes]);

        // Force immediate refresh for live environment
        router.refresh();
        // Also reload to ensure all data is fresh
        window.location.reload();
      } else {
        toast.error(result.message || "Failed to update athlete ranks");
      }
    } catch (error) {
      console.error("Error updating ranks:", error);
      toast.error(
        error instanceof Error
          ? `Error updating athlete ranks: ${error.message}`
          : "Error updating athlete ranks"
      );
    }
  };

  // Handle view change confirmation
  const handleViewChange = () => {
    if (pendingViewChange) {
      setIsReorderMode(false);
      setHasUnsavedChanges(false);
      setView(pendingViewChange);
      setPage(1); // Reset to first page when changing view
      setPendingViewChange(null);
      setShowViewChangeDialog(false);
    }
  };

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
            // Check if we're in reorder mode with unsaved changes
            if (isReorderMode && hasUnsavedChanges) {
              setPendingViewChange(newView);
              setShowViewChangeDialog(true);
            } else {
              setView(newView);
              setPage(1); // Reset to first page when changing view
            }
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
          {/* Refresh Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="flex items-center gap-2"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span className="hidden lg:inline">Refresh</span>
          </Button>

          {/* Reorder Mode Toggle */}
          <div className="flex items-center space-x-2">
            <Switch
              id="reorder-mode"
              checked={isReorderMode}
              onCheckedChange={toggleReorderMode}
              className={
                isReorderMode
                  ? view === "p4p"
                    ? "data-[state=checked]:bg-blue-500"
                    : view === "retired"
                    ? "data-[state=checked]:bg-purple-500"
                    : "data-[state=checked]:bg-orange-500"
                  : ""
              }
            />
            <Label
              htmlFor="reorder-mode"
              className={`text-sm font-medium ${
                isReorderMode
                  ? view === "p4p"
                    ? "text-blue-600 dark:text-blue-400"
                    : view === "retired"
                    ? "text-purple-600 dark:text-purple-400"
                    : "text-orange-600 dark:text-orange-400"
                  : ""
              }`}
            >
              {isReorderMode ? "Reorder Mode" : "Reorder Mode"}
            </Label>
          </div>

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
          {/* Reorder Mode Indicator */}
          {isReorderMode && (
            <div
              className={`border-b px-4 py-2 text-sm ${
                view === "p4p"
                  ? "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800"
                  : view === "retired"
                  ? "bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800"
                  : "bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`font-medium ${
                      view === "p4p"
                        ? "text-blue-700 dark:text-blue-300"
                        : view === "retired"
                        ? "text-purple-700 dark:text-purple-300"
                        : "text-orange-700 dark:text-orange-300"
                    }`}
                  >
                    {view === "p4p"
                      ? "P4P Reorder Mode"
                      : view === "retired"
                      ? "Retirement Order Mode"
                      : "Rank Reorder Mode"}{" "}
                    Active
                  </span>
                  {hasUnsavedChanges && (
                    <Badge
                      variant="secondary"
                      className={`text-xs ${
                        view === "p4p"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                          : view === "retired"
                          ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                          : "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300"
                      }`}
                    >
                      Unsaved Changes
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          )}

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={() => {
              if (!isReorderMode) {
                return;
              }
            }}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
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
                  <SortableContext
                    items={table
                      .getRowModel()
                      .rows.map((row) => row.original.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {table.getRowModel().rows.map((row) => (
                      <DraggableRow key={row.id} row={row} />
                    ))}
                  </SortableContext>
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
          </DndContext>
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

      {/* Exit Reorder Mode Dialog */}
      <Dialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Exit Reorder Mode</DialogTitle>
            <DialogDescription>
              You have unsaved changes in reorder mode. Are you sure you want to
              exit reorder mode? All changes will be lost.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExitDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleExitReorderMode}>
              Exit Reorder Mode
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Change Confirmation Dialog */}
      <Dialog
        open={showViewChangeDialog}
        onOpenChange={setShowViewChangeDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm View Change</DialogTitle>
            <DialogDescription>
              You have unsaved changes in reorder mode. Changing the view will
              discard these changes. Are you sure you want to change the view?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowViewChangeDialog(false)}
            >
              Keep Changes
            </Button>
            <Button variant="default" onClick={handleViewChange}>
              Confirm View Change
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Tabs>
  );
}
