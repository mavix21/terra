import { baseSepolia, liskSepolia } from "viem/chains";
import { cookieStorage, createConfig, createStorage, http } from "wagmi";

export const wagmiConfig = createConfig({
  chains: [liskSepolia, baseSepolia],
  multiInjectedProviderDiscovery: false,
  transports: {
    [liskSepolia.id]: http(),
    [baseSepolia.id]: http(),
  },
  ssr: true,
  storage: createStorage({ storage: cookieStorage }),
});
