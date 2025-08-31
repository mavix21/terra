"use client";

import { useState } from "react";
import Image from "next/image";
import { Coffee, MapPin, Star } from "lucide-react";
import { useTheme } from "next-themes";

import type { CoffeeShop } from "@/lib/mock-data";
import { coffees, coffeeShops } from "@/lib/mock-data";

interface MapViewProps {
  selectedShopId?: string | null;
  onShopSelect?: (shopId: string) => void;
}

export function MapView({ selectedShopId, onShopSelect }: MapViewProps) {
  const { theme } = useTheme();
  const [hoveredShopId, setHoveredShopId] = useState<string | null>(null);

  const handleMarkerClick = (shop: CoffeeShop) => {
    console.log("Coffee shop clicked:", { id: shop.id, name: shop.name });
    onShopSelect?.(shop.id);
  };

  const shopLocationLabel: Record<string, string> = {
    cs01: "Lima",
    cs02: "Cusco",
    cs03: "Arequipa",
    cs04: "Iquitos",
    cs05: "Ica",
    cs06: "Huaraz",
    cs07: "Tarapoto",
  };

  const pointsConfig = [
    { id: "1", x: "22%", y: "42%", shopId: "cs01" }, // Lima - Costa central
    { id: "2", x: "38%", y: "28%", shopId: "cs02" }, // Cusco - Sierra central
    { id: "3", x: "58%", y: "52%", shopId: "cs03" }, // Arequipa - Sierra sur
  ];

  const staticPoints: { id: string; x: string; y: string; shop: CoffeeShop }[] =
    [];
  for (const cfg of pointsConfig) {
    const shop = coffeeShops.find((s) => s.id === cfg.shopId);
    if (shop) {
      staticPoints.push({ id: cfg.id, x: cfg.x, y: cfg.y, shop });
    }
  }

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/mapa-peru-detallado-real.png"
          alt="Detailed map of Peru"
          fill
          sizes="100vw"
          priority
          className={`object-cover transition-all duration-300 ${
            theme === "dark" ? "brightness-75 contrast-125" : "brightness-100"
          }`}
        />
        <div className="to-background/10 absolute inset-0 bg-gradient-to-b from-transparent via-transparent" />
      </div>

      {staticPoints.map((point) => (
        <div
          key={point.id}
          className="absolute z-10"
          style={{ left: point.x, top: point.y }}
        >
          {/* Pulsing ring animation for selected marker */}
          {selectedShopId === point.shop.id && (
            <div className="absolute inset-0 -translate-x-1/2 -translate-y-1/2 transform">
              <div className="bg-primary/20 h-20 w-20 animate-ping rounded-full" />
              <div className="bg-primary/30 animation-delay-75 absolute inset-2 h-16 w-16 animate-ping rounded-full" />
            </div>
          )}

          {/* Main marker button */}
          <button
            onClick={() => handleMarkerClick(point.shop)}
            onMouseEnter={() => setHoveredShopId(point.shop.id)}
            onMouseLeave={() => setHoveredShopId(null)}
            className={`border-background group relative flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 transform cursor-pointer items-center justify-center rounded-full border-3 shadow-2xl transition-all duration-300 hover:scale-125 ${
              selectedShopId === point.shop.id
                ? "bg-accent shadow-accent/50 scale-125"
                : hoveredShopId === point.shop.id
                  ? "bg-primary shadow-primary/50 scale-110"
                  : "bg-primary/90 hover:bg-primary"
            }`}
          >
            <Coffee className="text-primary-foreground h-7 w-7 transition-transform duration-300 group-hover:rotate-12" />

            {/* Active indicator dot */}
            {selectedShopId === point.shop.id && (
              <div className="bg-accent border-background absolute -top-1 -right-1 h-4 w-4 animate-pulse rounded-full border-2 shadow-lg" />
            )}

            {/* Hover glow effect */}
            <div className="bg-primary/20 absolute inset-0 scale-150 rounded-full opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />
          </button>

          <div
            className={`pointer-events-none absolute z-30 mb-4 -translate-x-1/2 -translate-y-full transform transition-all duration-300 ${
              hoveredShopId === point.shop.id ||
              selectedShopId === point.shop.id
                ? "translate-y-0 opacity-100"
                : "translate-y-2 opacity-0"
            }`}
            style={{ left: "50%", top: "0%" }}
          >
            <div className="bg-card/95 border-border min-w-[200px] rounded-xl border p-4 shadow-2xl backdrop-blur-md">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg">
                  <Coffee className="text-primary h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-card-foreground mb-1 truncate text-sm font-semibold">
                    {point.shop.name}
                  </h3>
                  <div className="mb-2 flex items-center gap-1">
                    <MapPin className="text-muted-foreground h-3 w-3" />
                    <span className="text-muted-foreground text-xs">
                      {shopLocationLabel[point.shop.id] ?? "Perú"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${i < 4 ? "text-accent fill-accent" : "text-muted-foreground/30"}`}
                        />
                      ))}
                    </div>
                    <span className="text-muted-foreground ml-1 text-xs">
                      4.8
                    </span>
                  </div>
                  <div className="text-primary mt-2 text-xs font-medium">
                    {coffees[point.shop.id]?.length ?? 0} specialty coffees
                  </div>
                </div>
              </div>

              {/* Tooltip arrow */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 transform">
                <div className="border-t-card/95 h-0 w-0 border-t-4 border-r-4 border-l-4 border-transparent" />
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="absolute top-6 right-6 z-20">
        <div className="bg-card/90 border-border rounded-xl border p-4 shadow-xl backdrop-blur-md">
          <h4 className="text-card-foreground mb-3 text-sm font-semibold">
            Coffee Shops
          </h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs">
              <div className="bg-primary h-3 w-3 rounded-full" />
              <span className="text-muted-foreground">Available</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="bg-accent h-3 w-3 rounded-full" />
              <span className="text-muted-foreground">Selected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
