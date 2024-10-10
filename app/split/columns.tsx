"use client";

import { DataTableColumnHeader } from "@/components/data-table/DataTableColumnHeader";
import { Pin } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";

export const truncatedColumns: ColumnDef<Pin>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return value.length > 10 ? `${value.substring(0, 10)}...` : value;
    },
  },
  {
    accessorKey: "message",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Message" />
    ),
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return value.length > 60 ? `${value.substring(0, 57)}...` : value;
    },
  },
  {
    accessorKey: "lat",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Latitude" />
    ),
  },
  {
    accessorKey: "lng",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Longitude" />
    ),
  },
];
