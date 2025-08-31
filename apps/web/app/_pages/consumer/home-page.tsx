import { Coffee, Gem, MapPin, TrendingUp, Trophy } from "lucide-react";

import { Badge } from "@terra/ui/components/badge";
import { Button } from "@terra/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@terra/ui/components/card";

import { coffeeShops, collectedPoaps } from "@/lib/mock-data";

interface HomePageProps {
  onNavigate: (section: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const totalPoaps = collectedPoaps?.length || 0;
  const totalShops = coffeeShops?.length || 0;
  const featuredShops = coffeeShops?.slice(0, 2) || [];

  return (
    <div className="h-full overflow-y-auto">
      <div className="space-y-6 p-4 sm:p-6">
        {/* Hero Section */}
        <div className="space-y-4 py-8 text-center">
          <div className="from-primary to-primary/80 mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg">
            <Coffee className="text-primary-foreground h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-foreground text-3xl font-bold sm:text-4xl">
              Bienvenido a Terra Coffee
            </h1>
            <p className="text-muted-foreground mx-auto max-w-md text-lg">
              Descubre cafeterías únicas, colecciona POAPs exclusivos y
              construye tu viaje del café perfecto
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="from-accent/20 to-accent/30 border-accent/40 bg-gradient-to-br">
            <CardContent className="p-4 text-center">
              <div className="mb-2 flex items-center justify-center">
                <Gem className="text-accent-foreground h-5 w-5" />
              </div>
              <div className="text-foreground text-2xl font-bold">
                {totalPoaps}
              </div>
              <div className="text-muted-foreground text-sm">
                POAPs Coleccionados
              </div>
            </CardContent>
          </Card>

          <Card className="from-primary/20 to-primary/30 border-primary/40 bg-gradient-to-br">
            <CardContent className="p-4 text-center">
              <div className="mb-2 flex items-center justify-center">
                <MapPin className="text-primary h-5 w-5" />
              </div>
              <div className="text-foreground text-2xl font-bold">
                {totalShops}
              </div>
              <div className="text-muted-foreground text-sm">
                Cafeterías Disponibles
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Featured Coffee Shops */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-foreground text-xl font-semibold">
              Cafeterías Destacadas
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate("search")}
            >
              Ver todas
            </Button>
          </div>

          <div className="space-y-3">
            {featuredShops.map((shop) => (
              <Card
                key={shop.id}
                className="cursor-pointer transition-shadow hover:shadow-md"
                onClick={() => onNavigate("map")}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="bg-muted h-12 w-12 flex-shrink-0 overflow-hidden rounded-full">
                      <img
                        src={shop.logoUrl || "/placeholder.svg"}
                        alt={shop.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-foreground truncate font-medium">
                        {shop.name}
                      </h3>
                      <p className="text-muted-foreground flex items-center text-sm">
                        <MapPin className="mr-1 h-3 w-3" />
                        {shop.position
                          ? `${shop.position[0]}, ${shop.position[1]}`
                          : "Ubicación no disponible"}
                      </p>
                    </div>
                    <Badge variant="secondary" className="flex-shrink-0">
                      Disponible
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-foreground text-xl font-semibold">
            Acciones Rápidas
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Card
              className="cursor-pointer transition-shadow hover:shadow-md"
              onClick={() => onNavigate("map")}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                    <MapPin className="text-primary h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Explorar Mapa</CardTitle>
                    <CardDescription className="text-sm">
                      Encuentra cafeterías cerca de ti
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card
              className="cursor-pointer transition-shadow hover:shadow-md"
              onClick={() => onNavigate("rewards")}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-accent/10 flex h-10 w-10 items-center justify-center rounded-lg">
                    <Trophy className="text-accent-foreground h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Ver Recompensas</CardTitle>
                    <CardDescription className="text-sm">
                      Descubre beneficios exclusivos
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-4">
          <h2 className="text-foreground text-xl font-semibold">
            Actividad Reciente
          </h2>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                  <TrendingUp className="text-primary h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-foreground text-sm font-medium">
                    ¡Nuevo POAP desbloqueado!
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Coleccionaste el POAP de Café Selva Alta
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">
                  Hace 2 días
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
