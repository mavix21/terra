"use client";

import { useState } from "react";

import { Card, CardContent } from "@terra/ui/components/card";
import { cn } from "@terra/ui/lib/utils";

import type { Coffee, CollectedPoap } from "@/lib/mock-data";
import { coffees, collectedPoaps } from "@/lib/mock-data";

import { PoapDetailModal } from "./poap-detail-modal";

// Mock i18n function
function t(key: string): string {
  const translations: Record<string, string> = {
    "collections.title": "My Coffee POAP Collection",
    "collections.empty":
      "No POAPs collected yet. Start exploring coffee shops!",
    "collections.count": "POAPs collected",
  };
  return translations[key] || key;
}

export function CollectionsPage() {
  const [selectedPoap, setSelectedPoap] = useState<CollectedPoap | null>(null);

  const handlePoapClick = (poap: CollectedPoap) => {
    setSelectedPoap(poap);
  };

  const handleCloseModal = () => {
    setSelectedPoap(null);
  };

  const getCoffeeDetails = (
    coffeeId: string,
    shopId: string,
  ): Coffee | null => {
    const shopCoffees = coffees[shopId] || [];
    return shopCoffees.find((coffee) => coffee.id === coffeeId) || null;
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-6xl p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-foreground mb-2 text-3xl font-bold">
            {t("collections.title")}
          </h1>
          <p className="text-muted-foreground">
            {collectedPoaps.length} {t("collections.count")}
          </p>
        </div>

        {/* POAP Grid */}
        {collectedPoaps.length === 0 ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-muted-foreground text-lg">
              {t("collections.empty")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {collectedPoaps.map((poap) => (
              <PoapCard
                key={poap.id}
                poap={poap}
                onClick={() => handlePoapClick(poap)}
              />
            ))}
          </div>
        )}

        {/* Detail Modal */}
        <PoapDetailModal
          poap={selectedPoap}
          coffee={
            selectedPoap
              ? getCoffeeDetails(selectedPoap.coffeeId, selectedPoap.shopId)
              : null
          }
          onClose={handleCloseModal}
        />
      </div>
    </div>
  );
}

interface PoapCardProps {
  poap: CollectedPoap;
  onClick: () => void;
}

function PoapCard({ poap, onClick }: PoapCardProps) {
  return (
    <Card
      className={cn(
        "group cursor-pointer transition-all duration-300 hover:scale-105",
        "bg-card/50 border-border/50 border backdrop-blur-sm",
        "hover:bg-card/80 hover:border-border hover:shadow-primary/10 hover:shadow-lg",
        "perspective-1000 transform-gpu",
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        {/* POAP Image */}
        <div className="relative mb-4 overflow-hidden rounded-lg">
          <div className="from-primary/20 to-primary/5 flex aspect-square items-center justify-center bg-gradient-to-br">
            {/* Hexagonal POAP Badge */}
            <svg
              width="120"
              height="120"
              viewBox="0 0 120 120"
              className="text-primary"
            >
              <defs>
                <linearGradient
                  id={`poapGradient-${poap.id}`}
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="hsl(var(--primary))" />
                  <stop
                    offset="100%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity="0.7"
                  />
                </linearGradient>
              </defs>

              {/* Hexagonal shape */}
              <polygon
                points="60,15 90,35 90,75 60,95 30,75 30,35"
                fill={`url(#poapGradient-${poap.id})`}
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                className="drop-shadow-md transition-all duration-300 group-hover:drop-shadow-lg"
              />

              {/* Coffee cup icon */}
              <g transform="translate(60,60)">
                <rect
                  x="-12"
                  y="-8"
                  width="24"
                  height="16"
                  rx="2"
                  fill="hsl(var(--background))"
                />
                <path
                  d="M12 -4 Q16 -4 16 0 Q16 4 12 4"
                  stroke="hsl(var(--background))"
                  strokeWidth="2"
                  fill="none"
                />
                <rect
                  x="-16"
                  y="8"
                  width="32"
                  height="4"
                  rx="2"
                  fill="hsl(var(--background))"
                />
              </g>

              {/* Glow effect on hover */}
              <polygon
                points="60,15 90,35 90,75 60,95 30,75 30,35"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="1"
                opacity="0"
                className="transition-opacity duration-300 group-hover:animate-pulse group-hover:opacity-50"
                transform="scale(1.1)"
              />
            </svg>
          </div>

          {/* Glassmorphism overlay */}
          <div className="from-background/20 absolute inset-0 bg-gradient-to-t to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>

        {/* POAP Details */}
        <div className="space-y-2">
          <h3 className="text-card-foreground line-clamp-1 text-sm font-semibold">
            {poap.coffeeName}
          </h3>
          <p className="text-muted-foreground line-clamp-1 text-xs">
            {poap.shopName}
          </p>
          <p className="text-muted-foreground text-xs">
            {new Date(poap.dateMinted).toLocaleDateString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
