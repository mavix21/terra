"use client";

import type { Column, ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { CheckCircle2, Text, XCircle } from "lucide-react";

import { Badge } from "@terra/ui/components/badge";
import { DataTableColumnHeader } from "@terra/ui/components/table/data-table-column-header";

import type { Product } from "@/shared/data/mock-api";

import { CellAction } from "./cell-action";
import { CATEGORY_OPTIONS } from "./options";

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "photo_url",
    header: "Image",
    cell: ({ row }) => {
      return (
        <div className="relative aspect-square h-16 w-16 overflow-hidden sm:h-20 sm:w-20">
          <Image
            src={row.getValue("photo_url")}
            alt={row.getValue("name")}
            fill
            unoptimized
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="rounded-lg object-cover"
          />
        </div>
      );
    },
  },
  {
    id: "name",
    accessorKey: "name",
    header: ({ column }: { column: Column<Product, unknown> }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ cell }) => <div>{cell.getValue<Product["name"]>()}</div>,
    meta: {
      label: "Name",
      placeholder: "Search products...",
      variant: "text",
      icon: Text,
    },
    enableColumnFilter: true,
  },
  {
    id: "category",
    accessorKey: "category",
    header: ({ column }: { column: Column<Product, unknown> }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ cell }) => {
      const status = cell.getValue<Product["category"]>();
      const Icon = status === "active" ? CheckCircle2 : XCircle;

      return (
        <Badge variant="outline" className="gap-2 capitalize">
          <Icon className="size-3" />
          {status}
        </Badge>
      );
    },
    enableColumnFilter: true,
    meta: {
      label: "categories",
      variant: "multiSelect",
      options: CATEGORY_OPTIONS,
    },
  },
  {
    accessorKey: "price",
    header: "Price (ETH)",
  },
  {
    accessorKey: "description",
    header: "Description",
  },

  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
