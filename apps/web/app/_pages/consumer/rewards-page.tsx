"use client";

import { useState } from "react";
import { Badge, Coffee, Crown, Gift, Star, Trophy, Zap } from "lucide-react";

import { Button } from "@terra/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@terra/ui/components/card";
import { Progress } from "@terra/ui/components/progress";

interface Reward {
  id: string;
  title: string;
  description: string;
  shopName: string;
  shopId: string;
  type: "discount" | "freebie" | "exclusive" | "vip";
  requirement: string;
  progress: number;
  maxProgress: number;
  isUnlocked: boolean;
  icon: React.ReactNode;
  value: string;
}

const rewards: Reward[] = [
  {
    id: "r01",
    title: "Descuento del 20% en tu próxima compra",
    description:
      "Obtén un descuento especial en cualquier café de origen único",
    shopName: "Café Central Lima",
    shopId: "cs01",
    type: "discount",
    requirement: "Colecciona 3 POAPs de esta cafetería",
    progress: 2,
    maxProgress: 3,
    isUnlocked: false,
    icon: <Coffee className="h-5 w-5" />,
    value: "20% OFF",
  },
  {
    id: "r02",
    title: "Cata Privada de Café Geisha",
    description: "Sesión exclusiva de cata con el maestro tostador",
    shopName: "Café Central Lima",
    shopId: "cs01",
    type: "exclusive",
    requirement: "Colecciona 5 POAPs de esta cafetería",
    progress: 2,
    maxProgress: 5,
    isUnlocked: false,
    icon: <Crown className="h-5 w-5" />,
    value: "EXCLUSIVO",
  },
  {
    id: "r03",
    title: "Café Gratis del Mes",
    description: "Un café premium gratis cada mes durante 3 meses",
    shopName: "Tostaduria Bisetti",
    shopId: "cs02",
    type: "freebie",
    requirement: "Colecciona 2 POAPs de esta cafetería",
    progress: 1,
    maxProgress: 2,
    isUnlocked: false,
    icon: <Gift className="h-5 w-5" />,
    value: "GRATIS",
  },
  {
    id: "r04",
    title: "Acceso VIP al Laboratorio de Tostado",
    description: "Aprende el proceso de tostado con los expertos",
    shopName: "Tostaduria Bisetti",
    shopId: "cs02",
    type: "vip",
    requirement: "Colecciona 4 POAPs de esta cafetería",
    progress: 1,
    maxProgress: 4,
    isUnlocked: false,
    icon: <Zap className="h-5 w-5" />,
    value: "VIP",
  },
  {
    id: "r05",
    title: "Kit de Degustación Premium",
    description: "Recibe un kit con 5 cafés especiales para degustar en casa",
    shopName: "Café Central Lima",
    shopId: "cs01",
    type: "exclusive",
    requirement: "Colecciona 7 POAPs de cualquier cafetería",
    progress: 7,
    maxProgress: 7,
    isUnlocked: true,
    icon: <Trophy className="h-5 w-5" />,
    value: "DESBLOQUEADO",
  },
  {
    id: "r06",
    title: "Masterclass de Barista Profesional",
    description:
      "Aprende técnicas avanzadas de preparación con baristas expertos",
    shopName: "Tostaduria Bisetti",
    shopId: "cs02",
    type: "exclusive",
    requirement: "Colecciona 6 POAPs de esta cafetería",
    progress: 6,
    maxProgress: 6,
    isUnlocked: true,
    icon: <Star className="h-5 w-5" />,
    value: "DESBLOQUEADO",
  },
];

const getTypeColor = (type: string) => {
  switch (type) {
    case "discount":
      return "bg-blue-500/10 text-blue-600 border-blue-200";
    case "freebie":
      return "bg-green-500/10 text-green-600 border-green-200";
    case "exclusive":
      return "bg-purple-500/10 text-purple-600 border-purple-200";
    case "vip":
      return "bg-amber-500/10 text-amber-600 border-amber-200";
    default:
      return "bg-gray-500/10 text-gray-600 border-gray-200";
  }
};

const getTypeLabel = (type: string) => {
  switch (type) {
    case "discount":
      return "Descuento";
    case "freebie":
      return "Gratis";
    case "exclusive":
      return "Exclusivo";
    case "vip":
      return "VIP";
    default:
      return type;
  }
};

export function RewardsPage() {
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);

  const unlockedRewards = rewards.filter((r) => r.isUnlocked);
  const availableRewards = rewards.filter((r) => !r.isUnlocked);

  return (
    <div className="h-full overflow-auto">
      <div className="space-y-4 p-4 pb-20 sm:space-y-6 sm:p-6 sm:pb-24">
        {/* Header */}
        <div className="space-y-2 text-center">
          <h1 className="text-foreground text-2xl font-bold sm:text-3xl">
            Tus Recompensas
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Desbloquea beneficios exclusivos coleccionando POAPs de tus
            cafeterías favoritas
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
          <Card>
            <CardContent className="p-3 text-center sm:p-4">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10 sm:h-12 sm:w-12">
                <Trophy className="h-5 w-5 text-green-600 sm:h-6 sm:w-6" />
              </div>
              <div className="text-foreground text-xl font-bold sm:text-2xl">
                {unlockedRewards.length}
              </div>
              <div className="text-muted-foreground text-xs sm:text-sm">
                Recompensas Desbloqueadas
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center sm:p-4">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10 sm:h-12 sm:w-12">
                <Star className="h-5 w-5 text-blue-600 sm:h-6 sm:w-6" />
              </div>
              <div className="text-foreground text-xl font-bold sm:text-2xl">
                {availableRewards.length}
              </div>
              <div className="text-muted-foreground text-xs sm:text-sm">
                Disponibles
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center sm:p-4">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/10 sm:h-12 sm:w-12">
                <Coffee className="h-5 w-5 text-purple-600 sm:h-6 sm:w-6" />
              </div>
              <div className="text-foreground text-xl font-bold sm:text-2xl">
                7
              </div>
              <div className="text-muted-foreground text-xs sm:text-sm">
                POAPs Coleccionados
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Unlocked Rewards */}
        {unlockedRewards.length > 0 && (
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-foreground flex items-center gap-2 text-lg font-semibold sm:text-xl">
              <Trophy className="h-4 w-4 text-green-600 sm:h-5 sm:w-5" />
              Recompensas Desbloqueadas
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2">
              {unlockedRewards.map((reward) => (
                <Card
                  key={reward.id}
                  className="border-green-200 bg-green-50/50 dark:bg-green-950/20"
                >
                  <CardHeader className="p-4 pb-2 sm:p-6 sm:pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {reward.icon}
                        <Badge
                          className={`${getTypeColor(reward.type)} text-xs`}
                        >
                          {getTypeLabel(reward.type)}
                        </Badge>
                      </div>
                      <Badge className="border-green-200 bg-green-500/10 text-xs text-green-600">
                        {reward.value}
                      </Badge>
                    </div>
                    <CardTitle className="text-base sm:text-lg">
                      {reward.title}
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      {reward.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 sm:p-6">
                    <div className="space-y-2 sm:space-y-3">
                      <div className="text-muted-foreground text-xs sm:text-sm">
                        <strong>Cafetería:</strong> {reward.shopName}
                      </div>
                      <Button className="w-full bg-green-600 text-sm hover:bg-green-700">
                        Usar Recompensa
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Available Rewards */}
        <div className="space-y-3 sm:space-y-4">
          <h2 className="text-foreground flex items-center gap-2 text-lg font-semibold sm:text-xl">
            <Star className="h-4 w-4 text-blue-600 sm:h-5 sm:w-5" />
            Recompensas Disponibles
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2">
            {availableRewards.map((reward) => (
              <Card
                key={reward.id}
                className="transition-shadow hover:shadow-md"
              >
                <CardHeader className="p-4 pb-2 sm:p-6 sm:pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {reward.icon}
                      <Badge className={`${getTypeColor(reward.type)} text-xs`}>
                        {getTypeLabel(reward.type)}
                      </Badge>
                    </div>
                    <Badge fontVariant="outline" className="text-xs">
                      {reward.value}
                    </Badge>
                  </div>
                  <CardTitle className="text-base sm:text-lg">
                    {reward.title}
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    {reward.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0 sm:p-6">
                  <div className="space-y-2 sm:space-y-3">
                    <div className="text-muted-foreground text-xs sm:text-sm">
                      <strong>Cafetería:</strong> {reward.shopName}
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-muted-foreground">Progreso</span>
                        <span className="font-medium">
                          {reward.progress}/{reward.maxProgress} POAPs
                        </span>
                      </div>
                      <Progress
                        value={(reward.progress / reward.maxProgress) * 100}
                        className="h-2"
                      />
                      <p className="text-muted-foreground text-xs">
                        {reward.requirement}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
