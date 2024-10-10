"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
  VisibilityState,
  getFilteredRowModel,
  ColumnFiltersState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { DataTableViewOptions } from "./DataTableViewOptions";
import { Input } from "@/components/ui/input";
import { Pin } from "@/lib/types";
import { useSelectedPin } from "@/components/SplitView";
import { Combobox } from "@/components/ui/combobox";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  columnToFilter: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  columnToFilter,
}: DataTableProps<TData, TValue>) {
  const { selectedPin, setSelectedPin } = useSelectedPin();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnVisibility,
      columnFilters,
    },
  });

  const items = Array.from(
    new Set(data.map((item) => item[columnToFilter])),
  ).map((uniqueValue) => ({
    value: uniqueValue,
    label: uniqueValue,
  }));

  return (
    <div>
      <div className="flex items-center pb-2">
        <Input
          placeholder="Filter messages..."
          value={(table.getColumn("message")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("message")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Combobox
          items={items}
          searchLabel={columnToFilter}
          onSelect={(value) => {
            const currentValue = table
              .getColumn(columnToFilter)
              ?.getFilterValue() as string;
            table
              .getColumn(columnToFilter)
              ?.setFilterValue(currentValue === value ? "" : value);
          }}
        />
        <DataTableViewOptions table={table} />
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
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                const isSelected = row.original === selectedPin;
                return (
                  <TableRow
                    key={row.id}
                    data-state={isSelected ? "selected" : ""}
                    className={isSelected ? "bg-yellow-100" : ""}
                    onClick={() => setSelectedPin(row.original as Pin)} // {{ edit }}
                    style={{ cursor: "pointer" }} // {{ edit }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
