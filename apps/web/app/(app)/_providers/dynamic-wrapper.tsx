"use client";

import { getCsrfToken, getSession, signOut } from "next-auth/react";

import type { EvmNetwork } from "@/lib/dynamic";
import { useRouter } from "@/app/_shared/i18n";
import { env } from "@/env";
import {
  DynamicContextProvider,
  EthereumWalletConnectors,
  getAuthToken,
  mergeNetworks,
} from "@/lib/dynamic";

const listSepoliaNetwork = {
  blockExplorerUrls: ["https://sepolia-blockscout.lisk.com"],
  chainId: 4202,
  networkId: 4202,
  chainName: "Lisk Sepolia",
  name: "Lisk Sepolia",
  iconUrls: ["https://icons.llamao.fi/icons/chains/rsz_lisk.jpg"],
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: ["https://rpc.sepolia-api.lisk.com"],
} satisfies EvmNetwork;

export default function DynamicProvider({ children }: React.PropsWithChildren) {
  const router = useRouter();

  return (
    <DynamicContextProvider
      settings={{
        environmentId: env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID,
        walletConnectors: [EthereumWalletConnectors],
        overrides: {
          evmNetworks: (networks) =>
            mergeNetworks([listSepoliaNetwork], networks),
        },
        events: {
          onAuthSuccess: async (event) => {
            const authToken = getAuthToken();

            const csrfToken = await getCsrfToken();

            try {
              const res = await fetch("/api/auth/callback/credentials", {
                method: "POST",
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                },
                body: `csrfToken=${encodeURIComponent(
                  csrfToken,
                )}&token=${encodeURIComponent(authToken ?? "")}`,
              });

              if (res.ok) {
                const session = await getSession();
                console.log("session", session);
                router.replace("/dashboard/overview");
                // Handle success - maybe redirect to the home page or user dashboard
              } else {
                // Handle any errors - maybe show an error message to the user
                console.error("Failed to log in");
              }
            } catch (error) {
              console.error("Error logging in", error);
            }
          },
          onLogout: async (event) => {
            console.log("onLogout", { event });
            await signOut({ callbackUrl: "/" });
          },
        },
      }}
    >
      {children}
    </DynamicContextProvider>
  );
}
