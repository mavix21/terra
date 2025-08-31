"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { Button } from "@terra/ui/components/button";

import { ProductTable } from "../products/ui/product-tables";

export interface BuyRow {
  id: number;
  name: string;
  description: string;
  price: number;
  category: "active";
  photo_url: string;
  token_link: string;
}

export function BuyTable({ rows, total }: { rows: BuyRow[]; total: number }) {
  const columns: ColumnDef<BuyRow, unknown>[] = [
    {
      accessorKey: "photo_url",
      header: "Image",
      cell: ({ row }) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={row.getValue("photo_url")}
          alt={row.getValue("name")}
          className="h-16 w-16 rounded-lg object-cover sm:h-20 sm:w-20"
        />
      ),
    },
    {
      id: "name",
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
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
      id: "token",
      header: "Token",
      cell: ({ row }) => (
        <a
          href={row.original.token_link}
          className="text-blue-600 underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          View
        </a>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button
          size="sm"
          onClick={() => {
            console.log("Buy clicked for token", row.original.id);
          }}
        >
          Buy
        </Button>
      ),
    },
  ];

  return (
    <ProductTable<BuyRow, unknown>
      data={rows}
      totalItems={total}
      columns={columns}
    />
  );
}
