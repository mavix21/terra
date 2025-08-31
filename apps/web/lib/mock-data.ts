export interface CoffeeShop {
  id: string;
  name: string;
  position: [number, number];
  logoUrl: string;
}

export const coffeeShops: CoffeeShop[] = [
  {
    id: "cs01",
    name: "Café Central Lima",
    position: [-12.0464, -77.0428], // Lima
    logoUrl: "/coffee-shop-logo.png",
  },
  {
    id: "cs02",
    name: "Tostaduria Bisetti",
    position: [-13.5319, -71.9675], // Cusco
    logoUrl: "/modern-coffee-shop-logo.png",
  },
  {
    id: "cs03",
    name: "Café de la Paz",
    position: [-15.8402, -70.0219], // Arequipa
    logoUrl: "/artisan-coffee-logo.png",
  },
  {
    id: "cs04",
    name: "Amazonia Coffee",
    position: [-3.7437, -73.2516], // Iquitos
    logoUrl: "/specialty-coffee-logo.png",
  },
  {
    id: "cs05",
    name: "Huacachina Roasters",
    position: [-14.0875, -75.7626], // Ica
    logoUrl: "/coffee-roaster-logo.png",
  },
  {
    id: "cs06",
    name: "Cordillera Coffee",
    position: [-9.526, -77.528], // Huaraz
    logoUrl: "/coffee-shop-logo.png",
  },
  {
    id: "cs07",
    name: "Selva Verde Café",
    position: [-6.4889, -76.3625], // Tarapoto
    logoUrl: "/modern-coffee-shop-logo.png",
  },
];

export interface Coffee {
  id: string;
  name: string;
  origin: string;
  details: {
    location: string;
    altitude: string;
    variety: string;
    farm: string;
    family: string;
  };
}

export const coffees: Record<string, Coffee[]> = {
  cs01: [
    {
      id: "c01",
      name: "Café Villa Rica",
      origin: "Perú",
      details: {
        location: "Villa Rica, Pasco",
        altitude: "1,200-1,800m",
        variety: "Typica, Caturra",
        farm: "Cooperativa Villa Rica",
        family: "Arabica",
      },
    },
    {
      id: "c02",
      name: "Café Chanchamayo",
      origin: "Perú",
      details: {
        location: "Chanchamayo, Junín",
        altitude: "1,000-1,500m",
        variety: "Bourbon, Catimor",
        farm: "Finca La Esperanza",
        family: "Arabica",
      },
    },
  ],
  cs02: [
    {
      id: "c03",
      name: "Café Machu Picchu",
      origin: "Perú",
      details: {
        location: "Cusco, Sacred Valley",
        altitude: "1,500-2,000m",
        variety: "Typica",
        farm: "Cooperativa Machu Picchu",
        family: "Arabica",
      },
    },
  ],
  cs03: [
    {
      id: "c04",
      name: "Café Volcán Misti",
      origin: "Perú",
      details: {
        location: "Arequipa",
        altitude: "1,800-2,200m",
        variety: "Bourbon",
        farm: "Finca Volcán",
        family: "Arabica",
      },
    },
  ],
  cs04: [
    {
      id: "c05",
      name: "Café Amazonas",
      origin: "Perú",
      details: {
        location: "Amazonas, San Martín",
        altitude: "800-1,200m",
        variety: "Catimor, Pache",
        farm: "Cooperativa Amazonas",
        family: "Arabica",
      },
    },
  ],
  cs05: [
    {
      id: "c06",
      name: "Café Huacachina",
      origin: "Perú",
      details: {
        location: "Ica Desert Oasis",
        altitude: "400-800m",
        variety: "Geisha",
        farm: "Oasis Coffee Farm",
        family: "Arabica",
      },
    },
  ],
  cs06: [
    {
      id: "c07",
      name: "Café Cordillera Blanca",
      origin: "Perú",
      details: {
        location: "Ancash, Huaraz",
        altitude: "2,000-2,500m",
        variety: "Typica, Bourbon",
        farm: "Finca Cordillera",
        family: "Arabica",
      },
    },
  ],
  cs07: [
    {
      id: "c08",
      name: "Café Selva Alta",
      origin: "Perú",
      details: {
        location: "San Martín, Tarapoto",
        altitude: "900-1,400m",
        variety: "Caturra, Catimor",
        farm: "Cooperativa Selva",
        family: "Arabica",
      },
    },
  ],
};

export interface CollectedPoap {
  id: string;
  poapImageUrl: string;
  coffeeName: string;
  shopName: string;
  dateMinted: string;
  coffeeId: string;
  shopId: string;
}

export const collectedPoaps: CollectedPoap[] = [
  {
    id: "poap01",
    poapImageUrl: "/poap-cafe-villa-rica.png",
    coffeeName: "Café Villa Rica",
    shopName: "Café Central Lima",
    dateMinted: "2025-01-15", // updated date to 2025
    coffeeId: "c01",
    shopId: "cs01",
  },
  {
    id: "poap02",
    poapImageUrl: "/poap-cafe-machu-picchu.png",
    coffeeName: "Café Machu Picchu",
    shopName: "Tostaduria Bisetti",
    dateMinted: "2025-01-20", // updated date to 2025
    coffeeId: "c03",
    shopId: "cs02",
  },
  {
    id: "poap03",
    poapImageUrl: "/poap-cafe-volcan-misti.png",
    coffeeName: "Café Volcán Misti",
    shopName: "Café de la Paz",
    dateMinted: "2025-01-25", // updated date to 2025
    coffeeId: "c04",
    shopId: "cs03",
  },
  {
    id: "poap04",
    poapImageUrl: "/poap-cafe-amazonas.png",
    coffeeName: "Café Amazonas",
    shopName: "Amazonia Coffee",
    dateMinted: "2025-02-01", // updated date to 2025
    coffeeId: "c05",
    shopId: "cs04",
  },
  {
    id: "poap05",
    poapImageUrl: "/poap-cafe-huacachina.png",
    coffeeName: "Café Huacachina",
    shopName: "Huacachina Roasters",
    dateMinted: "2025-02-05", // updated date to 2025
    coffeeId: "c06",
    shopId: "cs05",
  },
  {
    id: "poap06",
    poapImageUrl: "/poap-cafe-cordillera-blanca.png",
    coffeeName: "Café Cordillera Blanca",
    shopName: "Cordillera Coffee",
    dateMinted: "2025-02-10", // updated date to 2025
    coffeeId: "c07",
    shopId: "cs06",
  },
  {
    id: "poap07",
    poapImageUrl: "/poap-cafe-selva-alta.png",
    coffeeName: "Café Selva Alta",
    shopName: "Selva Verde Café",
    dateMinted: "2025-02-15", // updated date to 2025
    coffeeId: "c08",
    shopId: "cs07",
  },
];
