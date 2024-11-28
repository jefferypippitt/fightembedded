import { getFilteredRowModel, getSortedRowModel } from "@tanstack/react-table"
import { getCoreRowModel } from "@tanstack/react-table"
import { useReactTable } from "@tanstack/react-table"
import { SortingState } from "@tanstack/react-table"
import { ColumnFiltersState } from "@tanstack/react-table"
import { useState } from "react"
import { Table } from "./table"
import { Input } from "./input"
import { ColumnDef } from "@tanstack/react-table"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchKey: string
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  
  const table = useReactTable({
    data,
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
    <div>
      <Input
        placeholder="Search..."
        value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
        onChange={(event) =>
          table.getColumn(searchKey)?.setFilterValue(event.target.value)
        }
        className="max-w-sm"
      />
      <Table>
        {/* Table implementation */}
      </Table>
    </div>
  )
} 