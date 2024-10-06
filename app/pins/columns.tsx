"use client";

import { DataTableColumnHeader } from "@/components/data-table/DataTableColumnHeader";
import { Pin } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Pin>[] = [
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
  {
    accessorKey: "message",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Message" />
    ),
  },
];
