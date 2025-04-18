"use client"

import * as React from "react"
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
} from "@tanstack/react-table"
import {
  ArrowUpDown,
  ChevronDown,
  Filter,
  MoreHorizontal,
  PlusCircle,
  LayoutIcon,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CircleCheck,
  CircleX,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Athlete } from "@/types/athlete"
import { deleteAthlete } from "@/server/actions/delete-athlete"
import { toast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

// Helper component for the actions cell
const ActionsCell = ({ athlete }: { athlete: Athlete }) => {
  const router = useRouter()

  const handleDelete = async () => {
    try {
      await deleteAthlete(athlete.id)
      toast({
        title: "Athlete deleted successfully",
      })
      router.refresh()
    } catch (error: unknown) {
      toast({
        title: "Error deleting athlete",
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      })
    }
  }

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
          <Link href={`/dashboard/athletes/${athlete.id}/edit`}>
            Edit
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDelete} className="text-red-600">
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Helper component for the weight division filter
const WeightDivisionFilter = ({
  column,
}: {
  column: Column<Athlete, unknown>
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
  ]

  const femaleDivisions = [
    "Women's Strawweight",
    "Women's Flyweight",
    "Women's Bantamweight",
    "Women's Featherweight",
  ]

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
              const currentFilter = (column.getFilterValue() as string[]) ?? []
              if (checked) {
                column.setFilterValue([...currentFilter, division])
              } else {
                column.setFilterValue(
                  currentFilter.filter((item) => item !== division)
                )
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
              const currentFilter = (column.getFilterValue() as string[]) ?? []
              if (checked) {
                column.setFilterValue([...currentFilter, division])
              } else {
                column.setFilterValue(
                  currentFilter.filter((item) => item !== division)
                )
              }
            }}
          >
            {division}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const columns: ColumnDef<Athlete>[] = [
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
      )
    },
    cell: ({ row }) => {
      const athlete = row.original
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
      )
    },
    sortingFn: (rowA, rowB) => {
      const rankA = rowA.original.rank || Number.MAX_SAFE_INTEGER
      const rankB = rowB.original.rank || Number.MAX_SAFE_INTEGER
      return rankA - rankB
    },
    filterFn: (row, id, filterValue: string) => {
      return row.original.name.toLowerCase().includes(filterValue.toLowerCase())
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
      )
    },
    cell: ({ row }) => (
      <Badge variant="outline" className="text-muted-foreground px-1.5">
        {row.getValue("weightDivision")}
      </Badge>
    ),
    filterFn: (row, id, filterValues: string[]) => {
      if (!filterValues.length) return true
      const weightDivision = (row.getValue(id) as string).toLowerCase()
      return filterValues.some((filter) => {
        const normalizedFilter = filter.toLowerCase()
        if (weightDivision === normalizedFilter) return true
        if (weightDivision === normalizedFilter.replace("women's ", ""))
          return true
        if (weightDivision === `male ${normalizedFilter}`) return true
        if (weightDivision === `men's ${normalizedFilter}`) return true
        return false
      })
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
      )
    },
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
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          KO Wins
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
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
      )
    },
  },
  {
    accessorKey: "retired",
    header: "Status",
    cell: ({ row }) => {
      const retired = row.getValue("retired")
      return (
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {retired ? (
            <CircleX className="mr-1 h-3 w-3 text-red-500 dark:text-red-400" />
          ) : (
            <CircleCheck className="mr-1 h-3 w-3 text-green-500 dark:text-green-400" />
          )}
          {retired ? "Retired" : "Active"}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell athlete={row.original} />,
  },
]

interface AthletesDataTableProps {
  athletes: Athlete[]
  undefeatedAthletes: Athlete[]
  retiredAthletes: Athlete[]
}

export function AthletesDataTable({ athletes, undefeatedAthletes, retiredAthletes }: AthletesDataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([
    {
      id: "rankAndName",
      desc: false,
    },
  ])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const [activeView, setActiveView] = React.useState("athletes")

  const currentData = React.useMemo(() => {
    switch (activeView) {
      case "undefeated":
        return undefeatedAthletes
      case "retired":
        return retiredAthletes
      case "athletes":
      default:
        return athletes
    }
  }, [activeView, athletes, undefeatedAthletes, retiredAthletes])

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
  })

  return (
    <Tabs defaultValue="athletes" className="w-full flex-col justify-start gap-6">
      <div className="flex items-center justify-between px-4 lg:px-6">
        <Label htmlFor="view-selector" className="sr-only">
          View
        </Label>
        <Select defaultValue="athletes" onValueChange={setActiveView}>
          <SelectTrigger
            className="flex w-fit @4xl/main:hidden"
            size="sm"
            id="view-selector"
          >
            <SelectValue placeholder="Select a view" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="athletes">All Athletes</SelectItem>
            <SelectItem value="undefeated">Undefeated</SelectItem>
            <SelectItem value="retired">Retired</SelectItem>
          </SelectContent>
        </Select>
        <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
          <TabsTrigger value="athletes">All Athletes</TabsTrigger>
          <TabsTrigger value="undefeated">Undefeated</TabsTrigger>
          <TabsTrigger value="retired">Retired</TabsTrigger>
        </TabsList>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <LayoutIcon className="mr-2 h-4 w-4" />
                <span className="hidden lg:inline">Customize Columns</span>
                <span className="lg:hidden">Columns</span>
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/athletes/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              <span className="hidden lg:inline">Add Athlete</span>
            </Link>
          </Button>
        </div>
      </div>

      <TabsContent value="athletes" className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
        <div className="flex items-center py-4">
          <Input
            placeholder="Filter by name..."
            value={(table.getColumn("rankAndName")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("rankAndName")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
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

        <div className="flex items-center justify-between px-4">
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Rows per page
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value))
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

      <TabsContent value="undefeated" className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
        <div className="flex items-center py-4">
          <Input
            placeholder="Filter by name..."
            value={(table.getColumn("rankAndName")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("rankAndName")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
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
                    colSpan={columns.length}
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
                  table.setPageSize(Number(value))
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

      <TabsContent value="retired" className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
        <div className="flex items-center py-4">
          <Input
            placeholder="Filter by name..."
            value={(table.getColumn("rankAndName")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("rankAndName")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
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
                    colSpan={columns.length}
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
                  table.setPageSize(Number(value))
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
  )
} 