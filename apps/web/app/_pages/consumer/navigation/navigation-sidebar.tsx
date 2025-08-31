"use client";

import { Gem, Home, Map, Moon, Search, Sun, Trophy } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@terra/ui/components/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@terra/ui/components/tooltip";
import { cn } from "@terra/ui/lib/utils";

interface NavigationSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const navigationItems = [
  { id: "home", icon: Home, label: "navigation.home" },
  { id: "map", icon: Map, label: "navigation.map" },
  { id: "search", icon: Search, label: "navigation.search" },
  { id: "rewards", icon: Trophy, label: "navigation.rewards" },
  { id: "collections", icon: Gem, label: "navigation.collections" },
];

// Mock i18n function
function t(key: string): string {
  const translations: Record<string, string> = {
    "navigation.home": "Inicio",
    "navigation.map": "Mapa",
    "navigation.search": "Buscar",
    "navigation.rewards": "Recompensas",
    "navigation.collections": "Colecciones",
    "theme.light": "Modo Claro",
    "theme.dark": "Modo Oscuro",
  };
  return translations[key] || key;
}

export function NavigationSidebar({
  activeSection,
  onSectionChange,
}: NavigationSidebarProps) {
  const { theme, setTheme } = useTheme();

  return (
    <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 sm:bottom-6">
      <div className="bg-background/80 border-border/30 rounded-2xl border px-4 py-3 shadow-2xl shadow-black/10 backdrop-blur-xl sm:px-6 sm:py-4 dark:shadow-black/30">
        <div className="flex items-center justify-between gap-4">
          {/* Navigation Icons */}
          <TooltipProvider>
            <nav className="flex flex-1 items-center justify-center gap-2 sm:gap-4">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;

                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    size="icon"
                    onClick={() => onSectionChange(item.id)}
                    className={cn(
                      "hover:bg-muted/50 relative h-11 w-11 rounded-xl transition-all duration-200 sm:h-12 sm:w-12",
                      isActive &&
                        "text-primary bg-primary/10 hover:bg-primary/15",
                    )}
                  >
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                    {isActive && (
                      <>
                        <div className="bg-primary shadow-primary/50 absolute bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full shadow-lg" />
                        <div className="bg-primary/5 absolute inset-0 rounded-xl" />
                      </>
                    )}
                  </Button>
                );
              })}
            </nav>

            <div className="ml-2 flex-shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="hover:bg-muted/50 h-9 w-9 rounded-xl transition-all duration-200 sm:h-10 sm:w-10"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
              </Button>
            </div>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}
