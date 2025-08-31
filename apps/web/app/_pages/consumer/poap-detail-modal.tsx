"use client";

import { X } from "lucide-react";

import { Button } from "@terra/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@terra/ui/components/card";

import type { Coffee, CollectedPoap } from "@/lib/mock-data";

interface PoapDetailModalProps {
  poap: CollectedPoap | null;
  coffee: Coffee | null;
  onClose: () => void;
}

// Mock i18n function
function t(key: string): string {
  const translations: Record<string, string> = {
    "poap.details.title": "POAP Details",
    "poap.details.mintedOn": "Minted on",
    "poap.details.coffee": "Coffee Details",
    "coffee.details.origin": "Origin",
    "coffee.details.location": "Location",
    "coffee.details.altitude": "Altitude",
    "coffee.details.variety": "Variety",
    "coffee.details.farm": "Farm",
    "coffee.details.family": "Family",
    "actions.close": "Close",
  };
  return translations[key] || key;
}

export function PoapDetailModal({
  poap,
  coffee,
  onClose,
}: PoapDetailModalProps) {
  if (!poap) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="bg-background/80 animate-in fade-in-0 fixed inset-0 z-50 flex items-center justify-center p-4 pb-28 backdrop-blur-sm duration-300"
      onClick={handleBackdropClick}
    >
      <Card className="bg-card/95 border-border/50 animate-in zoom-in-95 slide-in-from-bottom-4 w-full max-w-xs border backdrop-blur-sm duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm">{t("poap.details.title")}</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="flex justify-center">
            <svg
              width="60"
              height="60"
              viewBox="0 0 100 100"
              className="text-primary"
            >
              <defs>
                <linearGradient
                  id="modalPoapGradient"
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

              <polygon
                points="50,12 75,30 75,62 50,80 25,62 25,30"
                fill="url(#modalPoapGradient)"
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                className="drop-shadow-lg"
              />

              <g transform="translate(50,50)">
                <rect
                  x="-10"
                  y="-6"
                  width="20"
                  height="12"
                  rx="1"
                  fill="hsl(var(--background))"
                />
                <path
                  d="M10 -3 Q13 -3 13 0 Q13 3 10 3"
                  stroke="hsl(var(--background))"
                  strokeWidth="1.5"
                  fill="none"
                />
                <rect
                  x="-13"
                  y="6"
                  width="26"
                  height="3"
                  rx="1"
                  fill="hsl(var(--background))"
                />
              </g>
            </svg>
          </div>

          <div className="space-y-0.5 text-center">
            <h3 className="text-card-foreground text-base font-semibold">
              {poap.coffeeName}
            </h3>
            <p className="text-muted-foreground text-xs">{poap.shopName}</p>
            <p className="text-muted-foreground text-xs">
              {t("poap.details.mintedOn")}{" "}
              {new Date(poap.dateMinted).toLocaleDateString()}
            </p>
          </div>

          {coffee && (
            <div className="space-y-1.5">
              <h4 className="text-card-foreground text-xs font-medium">
                {t("poap.details.coffee")}
              </h4>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                <div>
                  <span className="text-card-foreground font-medium">
                    {t("coffee.details.origin")}:
                  </span>
                  <p className="text-muted-foreground text-xs">
                    {coffee.origin}
                  </p>
                </div>
                <div>
                  <span className="text-card-foreground font-medium">
                    {t("coffee.details.location")}:
                  </span>
                  <p className="text-muted-foreground text-xs">
                    {coffee.details.location}
                  </p>
                </div>
                <div>
                  <span className="text-card-foreground font-medium">
                    {t("coffee.details.altitude")}:
                  </span>
                  <p className="text-muted-foreground text-xs">
                    {coffee.details.altitude}
                  </p>
                </div>
                <div>
                  <span className="text-card-foreground font-medium">
                    {t("coffee.details.variety")}:
                  </span>
                  <p className="text-muted-foreground text-xs">
                    {coffee.details.variety}
                  </p>
                </div>
                <div>
                  <span className="text-card-foreground font-medium">
                    {t("coffee.details.farm")}:
                  </span>
                  <p className="text-muted-foreground text-xs">
                    {coffee.details.farm}
                  </p>
                </div>
                <div>
                  <span className="text-card-foreground font-medium">
                    {t("coffee.details.family")}:
                  </span>
                  <p className="text-muted-foreground text-xs">
                    {coffee.details.family}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
