import Image from "next/image";
import {
  ArrowRight,
  Coffee,
  Gem,
  MapPin,
  Sparkles,
  Star,
  Trophy,
} from "lucide-react";

import { Badge } from "@terra/ui/components/badge";
import { Button } from "@terra/ui/components/button";
import { Card, CardContent } from "@terra/ui/components/card";

import { coffeeShops, collectedPoaps } from "@/lib/mock-data";

interface HomePageProps {
  onNavigate: (section: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const totalPoaps = collectedPoaps.length;
  const totalShops = coffeeShops.length;
  const featuredShops = coffeeShops.slice(0, 2);

  return (
    <div className="h-full overflow-y-auto">
      <div className="relative">
        <div className="relative bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 text-white">
          <div className="absolute inset-0 bg-[url('/coffee-beans-pattern.png')] opacity-10"></div>
          <div className="relative px-6 py-16 text-center">
            <div className="mx-auto max-w-2xl">
              <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-white/10 backdrop-blur-sm">
                <Coffee className="h-10 w-10" />
              </div>
              <h1 className="mb-4 text-4xl font-bold text-balance sm:text-5xl">
                Discover Terra's
                <span className="block text-white">Coffee Culture</span>
              </h1>
              <p className="mx-auto mb-8 max-w-lg text-xl text-balance text-white/80">
                Explore authentic coffee shops, collect unique POAPs, and build
                your perfect coffee journey
              </p>
              <Button
                size="lg"
                variant="secondary"
                className="text-primary bg-white shadow-lg hover:bg-white/90"
                onClick={() => onNavigate("search")}
              >
                Start Exploring
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="relative z-10 -mt-8 px-6">
          <div className="mx-auto grid max-w-md grid-cols-2 gap-4">
            <Card className="bg-card border shadow-md">
              <CardContent className="p-6 text-center">
                <div className="bg-primary/10 mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl">
                  <Gem className="text-primary h-6 w-6" />
                </div>
                <div className="text-card-foreground mb-1 text-3xl font-bold">
                  {totalPoaps}
                </div>
                <div className="text-muted-foreground text-sm">
                  POAPs Collected
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border shadow-md">
              <CardContent className="p-6 text-center">
                <div className="bg-primary/10 mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl">
                  <MapPin className="text-primary h-6 w-6" />
                </div>
                <div className="text-card-foreground mb-1 text-3xl font-bold">
                  {totalShops}
                </div>
                <div className="text-muted-foreground text-sm">
                  Coffee Shops
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="px-6 py-12">
          <div className="mx-auto max-w-2xl">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-foreground mb-2 text-2xl font-bold">
                  Featured Coffee Shops
                </h2>
                <p className="text-muted-foreground">
                  Discover Peru's finest coffee experiences
                </p>
              </div>
              <Button
                variant="ghost"
                onClick={() => onNavigate("search")}
                className="text-primary"
              >
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              {featuredShops.map((shop) => (
                <Card
                  key={shop.id}
                  className="group bg-card border transition-all duration-300 hover:shadow-lg"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="bg-muted relative h-16 w-16 overflow-hidden rounded-2xl">
                          <Image
                            src={
                              shop.logoUrl ||
                              "/placeholder.svg?height=64&width=64&query=coffee shop logo"
                            }
                            alt={shop.name}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </div>
                        <div className="bg-primary absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full">
                          <Star className="text-primary-foreground h-3 w-3 fill-current" />
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-card-foreground mb-1 text-lg font-semibold">
                          {shop.name}
                        </h3>
                        <p className="text-muted-foreground mb-2 flex items-center text-sm">
                          <MapPin className="mr-1 h-4 w-4" />
                          {"Peru"}
                        </p>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary" className="text-xs">
                            {2} Coffees
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Premium
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 pb-12">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-foreground mb-8 text-center text-2xl font-bold">
              Quick Actions
            </h2>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Card
                className="group bg-card hover:bg-muted cursor-pointer border transition-all duration-300 hover:shadow-md"
                onClick={() => onNavigate("map")}
              >
                <CardContent className="p-8 text-center">
                  <div className="bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl transition-transform group-hover:scale-110">
                    <MapPin className="text-primary h-8 w-8" />
                  </div>
                  <h3 className="text-foreground mb-2 text-lg font-semibold">
                    Explore Map
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Find coffee shops near you
                  </p>
                </CardContent>
              </Card>

              <Card
                className="group bg-card hover:bg-muted cursor-pointer border transition-all duration-300 hover:shadow-md"
                onClick={() => onNavigate("rewards")}
              >
                <CardContent className="p-8 text-center">
                  <div className="bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl transition-transform group-hover:scale-110">
                    <Trophy className="text-primary h-8 w-8" />
                  </div>
                  <h3 className="text-foreground mb-2 text-lg font-semibold">
                    View Rewards
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Discover exclusive benefits
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <div className="px-6 pb-24">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-foreground mb-6 text-2xl font-bold">
              Recent Activity
            </h2>

            <Card className="bg-card border">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-2xl">
                    <Sparkles className="text-primary h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <p className="text-foreground mb-1 font-medium">
                      New POAP Unlocked!
                    </p>
                    <p className="text-muted-foreground text-sm">
                      You collected the Café Selva Alta POAP
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    2 days ago
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
