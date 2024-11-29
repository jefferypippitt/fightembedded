"use client";

import { Column, ColumnDef } from "@tanstack/react-table";
import { Athlete } from "@/types/athlete";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  ArrowUpDown,
  MoreHorizontal,
  Pencil,
  Trash,
  Filter,
} from "lucide-react";
import Link from "next/link";
import { deleteAthlete } from "@/server/actions/delete-athlete";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

// Helper component for the actions cell
const ActionsCell = ({ athlete }: { athlete: Athlete }) => {
  const router = useRouter();

  const handleDelete = async () => {
    try {
      await deleteAthlete(athlete.id);
      toast({
        title: "Athlete deleted successfully",
      });
      router.refresh();
    } catch (error: unknown) {
      toast({
        title: "Error deleting athlete",
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link href={`/dashboard/athletes/${athlete.id}/edit`}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete} className="text-red-600">
          <Trash className="mr-2 h-4 w-4" />
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
    "Women's Featherweight",
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

export const columns: ColumnDef<Athlete>[] = [
  {
    id: "rankAndName",
    accessorFn: (row) => ({
      rank: row.rank,
      name: row.name
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
    cell: ({ row }) => {
      const athlete = row.original;
      return (
        <div className="flex items-center gap-2">
          {athlete.rank ? (
            <Badge
              variant="outline"
              className="w-8 h-6 flex items-center justify-center"
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
          )}
          <span>{athlete.name}</span>
        </div>
      );
    },
    sortingFn: (rowA, rowB) => {
      const rankA = rowA.original.rank || Number.MAX_SAFE_INTEGER;
      const rankB = rowB.original.rank || Number.MAX_SAFE_INTEGER;
      return rankA - rankB;
    },
    filterFn: (row, id, filterValue: string) => {
      return row.original.name.toLowerCase().includes(filterValue.toLowerCase());
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
      <Badge variant="secondary">{row.getValue("weightDivision")}</Badge>
    ),
    filterFn: (row, id, filterValues: string[]) => {
      if (!filterValues.length) return true;
      const weightDivision = (row.getValue(id) as string).toLowerCase();
      console.log("Actual weight division:", weightDivision);
      console.log("Filter values:", filterValues);

      return filterValues.some((filter) => {
        const normalizedFilter = filter.toLowerCase();
        if (weightDivision === normalizedFilter) return true;
        if (weightDivision === normalizedFilter.replace("women's ", ""))
          return true;
        if (weightDivision === `male ${normalizedFilter}`) return true;
        if (weightDivision === `men's ${normalizedFilter}`) return true;
        return false;
      });
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
    id: "actions",
    cell: ({ row }) => <ActionsCell athlete={row.original} />,
  },
];
