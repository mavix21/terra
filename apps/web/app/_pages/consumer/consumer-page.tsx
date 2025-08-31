"use client";

import { useState } from "react";

import type { Coffee, CoffeeShop, CollectedPoap } from "@/lib/mock-data";

import { CoffeeShopSideSheet } from "./coffee-shop-side-sheet";
import { CollectionsPage } from "./collections-page";
import { HomePage } from "./home-page";
import { MapView } from "./navigation/map-view";
import { NavigationSidebar } from "./navigation/navigation-sidebar";
import { PoapMintingModal } from "./poap-minting-modal";
import { RewardsPage } from "./rewards-page";
import { SearchPage } from "./search-page";

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

export function ConsumerPage() {
  const [activeSection, setActiveSection] = useState("home");
  const [selectedShopId, setSelectedShopId] = useState<string | null>(null);
  const [mintingModal, setMintingModal] = useState<{
    isOpen: boolean;
    coffee: Coffee | null;
    shop: CoffeeShop | null;
  }>({
    isOpen: false,
    coffee: null,
    shop: null,
  });

  const handleMintPoap = (coffee: Coffee, shop: CoffeeShop) => {
    console.log("Minting POAP for:", {
      coffee: coffee.name,
      shop: shop.name,
    });
    setMintingModal({
      isOpen: true,
      coffee,
      shop,
    });
  };

  const handleCloseSideSheet = () => {
    setSelectedShopId(null);
  };

  const handleCloseMintingModal = () => {
    setMintingModal({
      isOpen: false,
      coffee: null,
      shop: null,
    });
  };

  const handleViewCollection = () => {
    setActiveSection("collections");
    setSelectedShopId(null);
  };

  const renderContent = () => {
    switch (activeSection) {
      case "home":
        return (
          <div className="h-full pb-20 sm:pb-24">
            <HomePage onNavigate={setActiveSection} />
          </div>
        );
      case "map":
        return (
          <div className="absolute inset-0 pb-20 sm:pb-24">
            <MapView
              selectedShopId={selectedShopId}
              onShopSelect={setSelectedShopId}
            />
            <CoffeeShopSideSheet
              shopId={selectedShopId}
              onClose={handleCloseSideSheet}
              onMintPoap={handleMintPoap}
            />
          </div>
        );
      case "search":
        return (
          <div className="absolute inset-0 pb-20 sm:pb-24">
            <SearchPage onShopSelect={setSelectedShopId} />
            <CoffeeShopSideSheet
              shopId={selectedShopId}
              onClose={handleCloseSideSheet}
              onMintPoap={handleMintPoap}
            />
          </div>
        );
      case "rewards":
        return (
          <div className="h-full pb-20 sm:pb-24">
            <RewardsPage />
          </div>
        );
      case "collections":
        return (
          <div className="h-full pb-20 sm:pb-24">
            <CollectionsPage />
          </div>
        );
      default:
        return (
          <div className="flex h-full items-center justify-center pb-20 sm:pb-24">
            <div className="space-y-4 text-center">
              <div className="bg-primary/10 mx-auto flex h-20 w-20 items-center justify-center rounded-full">
                <span className="text-primary text-2xl font-bold">T</span>
              </div>
              <p className="text-foreground text-xl font-semibold">
                {t("content.welcome")}
              </p>
              <p className="text-muted-foreground max-w-md text-sm">
                {
                  "Explora cafeterías, colecciona POAPs únicos y construye tu viaje del café"
                }
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="bg-background fixed inset-0 overflow-hidden">
      <div className="absolute inset-0 w-full overflow-hidden">
        {renderContent()}
      </div>
      <NavigationSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      <PoapMintingModal
        isOpen={mintingModal.isOpen}
        coffee={mintingModal.coffee}
        shop={mintingModal.shop}
        onClose={handleCloseMintingModal}
        onViewCollection={handleViewCollection}
      />
    </div>
  );
}
