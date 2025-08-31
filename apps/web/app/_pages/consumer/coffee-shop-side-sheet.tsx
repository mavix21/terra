"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";

import { Button } from "@terra/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@terra/ui/components/card";
import { cn } from "@terra/ui/lib/utils";

import type { Coffee, CoffeeShop } from "@/lib/mock-data";
import { coffees, coffeeShops } from "@/lib/mock-data";

interface CoffeeShopSideSheetProps {
  shopId: string | null;
  onClose: () => void;
  onMintPoap: (coffee: Coffee, shop: CoffeeShop) => void;
}

// Mock i18n function
function t(key: string): string {
  const translations: Record<string, string> = {
    "actions.mintPoap": "Purchase & Mint POAP",
    "coffee.details.location": "Location",
    "coffee.details.altitude": "Altitude",
    "coffee.details.variety": "Variety",
    "coffee.details.farm": "Farm",
    "coffee.details.family": "Family",
    "coffee.origin": "Origin",
    "shop.availableCoffees": "Available Coffees",
  };
  return translations[key] || key;
}

export function CoffeeShopSideSheet({
  shopId,
  onClose,
  onMintPoap,
}: CoffeeShopSideSheetProps) {
  const [expandedCoffee, setExpandedCoffee] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (shopId) {
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
    }
  }, [shopId]);

  if (!shopId) return null;

  const shop = coffeeShops.find((s) => s.id === shopId);
  const shopCoffees = coffees[shopId] || [];

  if (!shop) return null;

  const toggleCoffeeExpansion = (coffeeId: string) => {
    setExpandedCoffee(expandedCoffee === coffeeId ? null : coffeeId);
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 300);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "bg-background/80 fixed inset-0 z-40 backdrop-blur-sm transition-opacity duration-300",
          isVisible ? "opacity-100" : "opacity-0",
        )}
        onClick={handleClose}
      />

      {/* Side Sheet */}
      <div
        className={cn(
          "bg-card border-border fixed top-0 right-0 z-50 h-full w-full border-l transition-all duration-300 ease-out sm:w-96",
          isVisible
            ? "translate-x-0 scale-100 opacity-100"
            : "translate-x-full scale-95 opacity-0",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div
            className={cn(
              "border-border flex items-center justify-between border-b p-4 transition-all delay-100 duration-500 sm:p-6",
              isVisible
                ? "translate-y-0 opacity-100"
                : "-translate-y-4 opacity-0",
            )}
          >
            <h2 className="text-card-foreground text-lg font-semibold sm:text-xl">
              {shop.name}
            </h2>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div
            className={cn(
              "flex-1 overflow-y-auto p-4 transition-all delay-200 duration-700 sm:p-6",
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0",
            )}
          >
            <div className="space-y-4">
              <h3 className="text-card-foreground mb-4 text-base font-medium sm:text-lg">
                {t("shop.availableCoffees")}
              </h3>

              {shopCoffees.map((coffee, index) => {
                const isExpanded = expandedCoffee === coffee.id;

                return (
                  <Card
                    key={coffee.id}
                    className={cn(
                      "transition-all duration-200 hover:scale-[1.02] hover:shadow-md",
                      isVisible
                        ? "translate-x-0 opacity-100"
                        : "translate-x-8 opacity-0",
                    )}
                    style={{
                      transitionDelay: isVisible
                        ? `${300 + index * 100}ms`
                        : "0ms",
                    }}
                  >
                    <CardHeader
                      className="cursor-pointer p-4 sm:p-6"
                      onClick={() => toggleCoffeeExpansion(coffee.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-sm sm:text-base">
                            {coffee.name}
                          </CardTitle>
                          <p className="text-muted-foreground text-xs sm:text-sm">
                            {t("coffee.origin")}: {coffee.origin}
                          </p>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="text-muted-foreground h-4 w-4" />
                        ) : (
                          <ChevronDown className="text-muted-foreground h-4 w-4" />
                        )}
                      </div>
                    </CardHeader>

                    <CardContent
                      className={cn(
                        "overflow-hidden p-4 pt-0 transition-all duration-200 sm:p-6",
                        isExpanded
                          ? "max-h-96 opacity-100"
                          : "max-h-0 opacity-0",
                      )}
                    >
                      <div className="mb-4 space-y-3">
                        <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2 sm:text-sm">
                          <div>
                            <span className="text-card-foreground font-medium">
                              {t("coffee.details.location")}:
                            </span>
                            <p className="text-muted-foreground">
                              {coffee.details.location}
                            </p>
                          </div>
                          <div>
                            <span className="text-card-foreground font-medium">
                              {t("coffee.details.altitude")}:
                            </span>
                            <p className="text-muted-foreground">
                              {coffee.details.altitude}
                            </p>
                          </div>
                          <div>
                            <span className="text-card-foreground font-medium">
                              {t("coffee.details.variety")}:
                            </span>
                            <p className="text-muted-foreground">
                              {coffee.details.variety}
                            </p>
                          </div>
                          <div>
                            <span className="text-card-foreground font-medium">
                              {t("coffee.details.farm")}:
                            </span>
                            <p className="text-muted-foreground">
                              {coffee.details.farm}
                            </p>
                          </div>
                          <div className="sm:col-span-2">
                            <span className="text-card-foreground font-medium">
                              {t("coffee.details.family")}:
                            </span>
                            <p className="text-muted-foreground">
                              {coffee.details.family}
                            </p>
                          </div>
                        </div>
                      </div>

                      <Button
                        className="w-full text-sm sm:text-base"
                        onClick={() => onMintPoap(coffee, shop)}
                      >
                        {t("actions.mintPoap")}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
