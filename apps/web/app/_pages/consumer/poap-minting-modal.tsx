"use client";

import { useEffect, useState } from "react";

import { Button } from "@terra/ui/components/button";

import type { Coffee, CoffeeShop } from "@/lib/mock-data";

interface PoapMintingModalProps {
  isOpen: boolean;
  coffee: Coffee | null;
  shop: CoffeeShop | null;
  onClose: () => void;
  onViewCollection: () => void;
}

type MintingStatus = "initiating" | "processing" | "success";

// Mock i18n function
function t(key: string): string {
  const translations: Record<string, string> = {
    "minting.status.initiating": "Initiating POAP mint...",
    "minting.status.processing": "Processing on blockchain...",
    "minting.status.success": "POAP successfully minted!",
    "minting.successMessage":
      "Your coffee POAP has been added to your collection!",
    "actions.viewCollection": "View in my Collection",
  };
  return translations[key] || key;
}

export function PoapMintingModal({
  isOpen,
  coffee,
  shop,
  onClose,
  onViewCollection,
}: PoapMintingModalProps) {
  const [mintingStatus, setMintingStatus] =
    useState<MintingStatus>("initiating");
  const [showParticles, setShowParticles] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setMintingStatus("initiating");
      setShowParticles(false);
      return;
    }

    const timer1 = setTimeout(() => {
      setMintingStatus("processing");
      setShowParticles(true);
    }, 1000);

    const timer2 = setTimeout(() => {
      setMintingStatus("success");
    }, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [isOpen]);

  if (!isOpen || !coffee || !shop) return null;

  const handleViewCollection = () => {
    onViewCollection();
    onClose();
  };

  return (
    <div className="bg-background/80 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-card relative mx-4 w-full max-w-md overflow-hidden rounded-lg p-8">
        {/* Particle Effects */}
        {showParticles && (
          <div className="pointer-events-none absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="bg-primary absolute h-1 w-1 animate-ping rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${1 + Math.random()}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Main Animation Container */}
        <div className="flex flex-col items-center space-y-6">
          <div className="relative flex h-32 w-32 items-center justify-center">
            {/* Circuit Board Lines */}
            <svg
              className={`absolute inset-0 h-full w-full transition-opacity duration-1000 ${
                mintingStatus === "processing" ? "opacity-100" : "opacity-0"
              }`}
              viewBox="0 0 128 128"
            >
              <defs>
                <linearGradient
                  id="circuitGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop
                    offset="0%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity="0.8"
                  />
                  <stop
                    offset="100%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity="0.2"
                  />
                </linearGradient>
              </defs>

              {/* Animated circuit lines */}
              <path
                d="M64 20 L64 40 L80 40 L80 60 L100 60"
                stroke="url(#circuitGradient)"
                strokeWidth="2"
                fill="none"
                className="animate-pulse"
              />
              <path
                d="M64 108 L64 88 L48 88 L48 68 L28 68"
                stroke="url(#circuitGradient)"
                strokeWidth="2"
                fill="none"
                className="animate-pulse"
                style={{ animationDelay: "0.5s" }}
              />
              <path
                d="M20 64 L40 64 L40 48 L60 48 L60 28"
                stroke="url(#circuitGradient)"
                strokeWidth="2"
                fill="none"
                className="animate-pulse"
                style={{ animationDelay: "1s" }}
              />
              <path
                d="M108 64 L88 64 L88 80 L68 80 L68 100"
                stroke="url(#circuitGradient)"
                strokeWidth="2"
                fill="none"
                className="animate-pulse"
                style={{ animationDelay: "1.5s" }}
              />

              {/* Circuit nodes */}
              <circle
                cx="80"
                cy="40"
                r="3"
                fill="hsl(var(--primary))"
                className="animate-pulse"
              />
              <circle
                cx="48"
                cy="88"
                r="3"
                fill="hsl(var(--primary))"
                className="animate-pulse"
              />
              <circle
                cx="40"
                cy="48"
                r="3"
                fill="hsl(var(--primary))"
                className="animate-pulse"
              />
              <circle
                cx="88"
                cy="80"
                r="3"
                fill="hsl(var(--primary))"
                className="animate-pulse"
              />
            </svg>

            {/* Coffee Bean to POAP Transformation */}
            <div className="relative">
              {/* Coffee Bean (Initial State) */}
              <div
                className={`transition-all duration-1000 ${
                  mintingStatus === "initiating"
                    ? "scale-100 opacity-100"
                    : "scale-75 opacity-0"
                }`}
              >
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 64 64"
                  className="text-amber-600"
                >
                  <ellipse
                    cx="32"
                    cy="32"
                    rx="20"
                    ry="28"
                    fill="currentColor"
                    className="animate-pulse"
                  />
                  <path
                    d="M32 12 Q32 32 32 52"
                    stroke="hsl(var(--background))"
                    strokeWidth="3"
                    fill="none"
                  />
                </svg>
              </div>

              {/* Transitional Glow */}
              <div
                className={`absolute inset-0 transition-all duration-1000 ${
                  mintingStatus === "processing"
                    ? "scale-110 opacity-100"
                    : "scale-100 opacity-0"
                }`}
              >
                <div className="bg-primary/30 h-16 w-16 animate-ping rounded-full" />
                <div className="bg-primary/50 animation-delay-500 absolute inset-2 h-12 w-12 animate-ping rounded-full" />
              </div>

              {/* POAP Badge (Final State) */}
              <div
                className={`absolute inset-0 transition-all duration-1000 ${
                  mintingStatus === "success"
                    ? "scale-100 rotate-0 opacity-100"
                    : "scale-50 rotate-180 opacity-0"
                }`}
              >
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 64 64"
                  className="text-primary"
                >
                  <defs>
                    <linearGradient
                      id="poapGradient"
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

                  {/* Hexagonal POAP shape */}
                  <polygon
                    points="32,8 48,18 48,38 32,48 16,38 16,18"
                    fill="url(#poapGradient)"
                    stroke="hsl(var(--primary))"
                    strokeWidth="2"
                    className="drop-shadow-lg"
                  />

                  {/* Coffee cup icon in center */}
                  <g transform="translate(32,32)">
                    <rect
                      x="-6"
                      y="-4"
                      width="12"
                      height="8"
                      rx="1"
                      fill="hsl(var(--background))"
                    />
                    <path
                      d="M6 -2 Q8 -2 8 0 Q8 2 6 2"
                      stroke="hsl(var(--background))"
                      strokeWidth="1.5"
                      fill="none"
                    />
                    <rect
                      x="-8"
                      y="4"
                      width="16"
                      height="2"
                      rx="1"
                      fill="hsl(var(--background))"
                    />
                  </g>

                  {/* Glow effect */}
                  <polygon
                    points="32,8 48,18 48,38 32,48 16,38 16,18"
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="1"
                    opacity="0.5"
                    className="animate-pulse"
                    transform="scale(1.1)"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Status Text */}
          <div className="space-y-2 text-center">
            <p className="text-card-foreground text-lg font-medium">
              {t(`minting.status.${mintingStatus}`)}
            </p>

            {mintingStatus === "success" && (
              <div className="animate-in fade-in-0 slide-in-from-bottom-4 space-y-4 duration-500">
                <p className="text-muted-foreground text-sm">
                  {t("minting.successMessage")}
                </p>
                <div className="text-muted-foreground space-y-1 text-xs">
                  <p>
                    <strong>Coffee:</strong> {coffee.name}
                  </p>
                  <p>
                    <strong>Shop:</strong> {shop.name}
                  </p>
                </div>
                <Button onClick={handleViewCollection} className="w-full">
                  {t("actions.viewCollection")}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
