"use client";

import { useState } from "react";
import Image from "next/image";
import { Coffee, MapPin, Search } from "lucide-react";

import { Card, CardContent } from "@terra/ui/components/card";
import { Input } from "@terra/ui/components/input";

import type { CoffeeShop } from "@/lib/mock-data";
import { coffees, coffeeShops } from "@/lib/mock-data";

interface SearchPageProps {
  onShopSelect: (shopId: string) => void;
}

export function SearchPage({ onShopSelect }: SearchPageProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredShops = coffeeShops.filter((shop) =>
    shop.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleShopClick = (shop: CoffeeShop) => {
    onShopSelect(shop.id);
  };

  return (
    <div className="h-full overflow-auto">
      <div className="space-y-4 p-4 pb-20 sm:space-y-6 sm:p-6 sm:pb-24">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-foreground text-2xl font-bold sm:text-3xl">
            Buscar Cafeterías
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Descubre las mejores cafeterías de Perú y sus cafés únicos
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
          <Input
            placeholder="Buscar cafeterías..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-12 pl-10 sm:h-10"
          />
        </div>

        {/* Coffee Shop Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {filteredShops.map((shop) => {
            const shopCoffees = coffees[shop.id] ?? [];
            const logoSrc =
              shop.logoUrl && shop.logoUrl.trim().length > 0
                ? shop.logoUrl
                : "/coffee-bean-icon.png";
            return (
              <Card
                key={shop.id}
                className="bg-card border-border cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg"
                onClick={() => handleShopClick(shop)}
              >
                <CardContent className="space-y-3 p-4 sm:space-y-4 sm:p-6">
                  {/* Shop Logo */}
                  <div className="flex items-center justify-center">
                    <div className="bg-muted/20 flex h-12 w-12 items-center justify-center overflow-hidden rounded-full sm:h-16 sm:w-16">
                      <Image
                        src={logoSrc}
                        alt={shop.name}
                        width={48}
                        height={48}
                        className="h-8 w-8 object-contain sm:h-12 sm:w-12"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          (target as unknown as HTMLElement).style.display =
                            "none";
                          (
                            target.parentElement?.querySelector(
                              "svg",
                            ) as HTMLElement | null
                          )?.classList.remove("hidden");
                        }}
                      />
                      <Coffee className="text-muted-foreground hidden h-6 w-6 sm:h-8 sm:w-8" />
                    </div>
                  </div>

                  {/* Shop Info */}
                  <div className="space-y-1 text-center sm:space-y-2">
                    <h3 className="text-foreground text-base font-semibold sm:text-lg">
                      {shop.name}
                    </h3>
                    <div className="text-muted-foreground flex items-center justify-center text-xs sm:text-sm">
                      <MapPin className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                      <span>Perú</span>
                    </div>
                  </div>

                  {/* Coffee Count */}
                  <div className="text-center">
                    <div className="bg-primary/10 text-primary inline-flex items-center rounded-full px-2 py-1 text-xs font-medium sm:px-3 sm:text-sm">
                      <Coffee className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                      {shopCoffees.length}{" "}
                      {shopCoffees.length === 1 ? "café" : "cafés"} disponibles
                    </div>
                  </div>

                  {/* Coffee Preview */}
                  {shopCoffees.length > 0 && (
                    <div className="space-y-1 sm:space-y-2">
                      <p className="text-foreground text-xs font-medium sm:text-sm">
                        Cafés destacados:
                      </p>
                      <div className="space-y-1">
                        {shopCoffees.slice(0, 2).map((coffee) => (
                          <div
                            key={coffee.id}
                            className="text-muted-foreground text-xs sm:text-sm"
                          >
                            • {coffee.name}
                          </div>
                        ))}
                        {shopCoffees.length > 2 && (
                          <div className="text-muted-foreground text-xs sm:text-sm">
                            • y {shopCoffees.length - 2} más...
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* No Results */}
        {filteredShops.length === 0 && searchTerm && (
          <div className="py-8 text-center sm:py-12">
            <div className="bg-muted/20 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full sm:h-16 sm:w-16">
              <Search className="text-muted-foreground h-6 w-6 sm:h-8 sm:w-8" />
            </div>
            <p className="text-muted-foreground text-sm sm:text-base">
              No se encontraron cafeterías que coincidan con "{searchTerm}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
