"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash } from "lucide-react"
import { useConfirm } from "@/hooks/use-confirm"


interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  filterKey: string
  onDelete: (rows: Row<TData>[]) => void;
  disabled?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filterKey,
  onDelete,
  disabled
}: DataTableProps<TData, TValue>) {
const [ConfirmDialog, confirm] = useConfirm(
  "?אתה בטוח",
  "אתה עומד לבצע מחיקה של הרבה נתונים"
)

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] =React.useState<ColumnFiltersState>(
    []
  )
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
        sorting,
        columnFilters,
        rowSelection
    }
  })

  return (
    <div>
      <ConfirmDialog/>
          <div className="flex items-center py-4">
          <Input
             placeholder={`Filter ${filterKey}...`}
             value={(table.getColumn(filterKey)?.getFilterValue() as string) ?? ""}
             onChange={(event) =>
               table.getColumn(filterKey)?.setFilterValue(event.target.value)
             }
             className="max-w-sm"
          />
        {table.getFilteredSelectedRowModel().rows.length > 0 && (
            <Button
            disabled={disabled}
            size="sm"
            variant="outline"
            className="ml-auto font-normal text-xs"
            onClick={async () => {
              const ok = await confirm();
              if (ok) {
                onDelete(table.getFilteredSelectedRowModel().rows)
                table.resetRowSelection();
              }
            }}
            >
               <Trash className="size-4 mr-2"/>
                 ({table.getFilteredSelectedRowModel().rows.length}) מחיקה
            </Button>
        )}
      </div>
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                .אין תוצאה 
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
    <div className="flex justify-between py-4">
  <div className="flex space-x-2">
    <Button
      variant="outline"
      size="sm"
      onClick={() => table.previousPage()}
      disabled={!table.getCanPreviousPage()}
    >
      הקודם
    </Button>
    <Button
      variant="outline"
      size="sm"
      onClick={() => table.nextPage()}
      disabled={!table.getCanNextPage()}
    >
      הבא
    </Button>
  </div>

  <div className="text-sm text-muted-foreground flex items-center">
    <p className="mr-1">שורות נבחרו</p>
    {table.getFilteredRowModel().rows.length}
    <p className="mr-1 ml-2">מתוך</p>
    {table.getFilteredSelectedRowModel().rows.length}

  </div>
</div>


    </div>
  )
}
