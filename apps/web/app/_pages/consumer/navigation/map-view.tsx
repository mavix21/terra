"use client";

import { Coffee } from "lucide-react";
import { useTheme } from "next-themes";

import type { CoffeeShop } from "@/lib/mock-data";
import { coffeeShops } from "@/lib/mock-data";

interface MapViewProps {
  selectedShopId?: string | null;
  onShopSelect?: (shopId: string) => void;
}

export function MapView({ selectedShopId, onShopSelect }: MapViewProps) {
  const { theme } = useTheme();

  const handleMarkerClick = (shop: CoffeeShop) => {
    console.log("Coffee shop clicked:", { id: shop.id, name: shop.name });
    onShopSelect?.(shop.id);
  };

  const staticPoints = [
    { id: "1", x: "22%", y: "42%", shop: coffeeShops[0] }, // Lima - Costa central
    { id: "2", x: "38%", y: "28%", shop: coffeeShops[1] }, // Huánuco - Sierra central
    { id: "3", x: "58%", y: "52%", shop: coffeeShops[2] }, // Cusco - Sierra sur
  ];

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <img
        src="/mapa-peru-detallado-real.png"
        alt="Mapa detallado de Perú"
        className={`h-full w-full object-cover ${theme === "dark" ? "brightness-75 contrast-125" : "brightness-100"}`}
      />

      {staticPoints.map((point) => (
        <button
          key={point.id}
          onClick={() => handleMarkerClick(point.shop)}
          className={`absolute z-10 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 transform cursor-pointer items-center justify-center rounded-full border-3 border-white shadow-xl transition-all duration-200 hover:scale-110 ${
            selectedShopId === point.shop.id
              ? "scale-125 bg-red-500 ring-4 ring-white ring-offset-2"
              : "bg-amber-600 hover:bg-amber-500"
          }`}
          style={{ left: point.x, top: point.y }}
        >
          <Coffee className="h-6 w-6 text-white" />

          {selectedShopId === point.shop.id && (
            <div className="absolute -top-1 -right-1 h-4 w-4 animate-pulse rounded-full border-2 border-white bg-red-500"></div>
          )}
        </button>
      ))}

      {staticPoints.map((point) => (
        <div
          key={`tooltip-${point.id}`}
          className="pointer-events-none absolute z-20 mb-2 -translate-x-1/2 -translate-y-full transform rounded-lg bg-black/80 px-3 py-1 text-sm text-white opacity-0 transition-opacity duration-200 hover:opacity-100"
          style={{ left: point.x, top: point.y }}
        >
          {point.shop.name}
        </div>
      ))}
    </div>
  );
}
