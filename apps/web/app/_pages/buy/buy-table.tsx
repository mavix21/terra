"use client";

import type { ColumnDef } from "@tanstack/react-table";
import React, { useState } from "react";
import { useMutation } from "convex/react";
import { toast } from "sonner";

import { api } from "@terra/convex/convex/_generated/api";
import { Button } from "@terra/ui/components/button";
import { Modal } from "@terra/ui/components/modal";

import { ProductTable } from "../products/ui/product-tables";

export interface BuyRow {
  id: number;
  name: string;
  description: string;
  price: number;
  category: "active";
  photo_url: string;
  token_link: string;
  max: number;
}

export function BuyTable({ rows, total }: { rows: BuyRow[]; total: number }) {
  const [selected, setSelected] = useState<BuyRow | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const buyTokens = useMutation(api.microlots.buyTokens);

  const openModal = (row: BuyRow) => {
    setSelected(row);
    setQuantity(1);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  async function handleConfirm() {
    if (!selected) return;
    const amount = Math.min(Math.max(1, quantity), selected.max);
    try {
      setIsSubmitting(true);
      await buyTokens({ tokenId: selected.id, amount });
      toast.success("Purchase recorded successfully");
      closeModal();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to purchase";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

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
        <Button size="sm" onClick={() => openModal(row.original)}>
          Buy
        </Button>
      ),
    },
  ];

  return (
    <>
      <ProductTable<BuyRow, unknown>
        data={rows}
        totalItems={total}
        columns={columns}
      />
      <Modal
        title={selected ? `Buy ${selected.name}` : "Buy"}
        description={selected ? `Max available: ${selected.max}` : ""}
        isOpen={isOpen}
        onClose={closeModal}
      >
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-3">
            <label htmlFor="quantity" className="text-sm">
              Quantity
            </label>
            <input
              id="quantity"
              type="number"
              min={1}
              max={selected?.max ?? 1}
              value={quantity}
              onChange={(e) =>
                setQuantity(
                  Number.isFinite(Number(e.target.value))
                    ? Number(e.target.value)
                    : 1,
                )
              }
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-24 rounded-md border px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />
            {selected && (
              <span className="text-muted-foreground text-xs">
                Price: {selected.price} ETH each
              </span>
            )}
          </div>
          {selected && (
            <div className="flex items-center justify-between">
              <span className="text-sm">Total</span>
              <span className="text-sm font-medium">
                {(quantity * selected.price).toLocaleString(undefined, {
                  maximumFractionDigits: 6,
                })}{" "}
                ETH
              </span>
            </div>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              onClick={closeModal}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleConfirm} disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : "Confirm"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
