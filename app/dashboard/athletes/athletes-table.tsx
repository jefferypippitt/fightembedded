"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table"
import Link from "next/link"
import { PlusCircle, MoreHorizontal, Pencil, Trash } from "lucide-react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { deleteAthlete } from "@/server/actions/delete-athlete"
import { useRouter } from "next/navigation"

import { Athlete } from "@/types/athlete"
import { toast } from "@/hooks/use-toast"

const ActionsCell = ({ athlete }: { athlete: Athlete }) => {
  const router = useRouter()

  const handleDelete = async () => {
    try {
      await deleteAthlete(athlete.id)
      toast({
        title: "Athlete deleted successfully",
      })
      router.refresh()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: "Error deleting athlete",
      })
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
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
  )
}

// Define columns for the data table
const columns: ColumnDef<Athlete>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "weightDivision",
    header: "Weight Division",
    cell: ({ row }) => (
      <Badge variant="secondary">{row.getValue("weightDivision")}</Badge>
    ),
  },
  {
    accessorKey: "country",
    header: "Country",
  },
  {
    accessorKey: "record",
    header: "Record",
    cell: ({ row }) => {
      const athlete = row.original
      return `${athlete.wins}-${athlete.losses}-${athlete.draws}`
    },
  },
  {
    accessorKey: "winsByKo",
    header: "KO Wins",
  },
  {
    accessorKey: "winsBySubmission",
    header: "Sub Wins",
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell athlete={row.original} />
  },
]

interface AthletesTableProps {
  athletes: Athlete[]
}

export default function AthletesTable({ athletes }: AthletesTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const table = useReactTable({
    data: athletes,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  return (
    <div className="container max-w-7xl mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Athletes</h1>
        <Button asChild>
          <Link href="/dashboard/new-athlete">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Athlete
          </Link>
        </Button>
      </div>

      <div className="flex items-center py-4">
        <Input
          placeholder="Filter by name..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
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
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No athletes found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
