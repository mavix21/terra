"use client";

import { getCsrfToken, getSession } from "next-auth/react";

import type { EvmNetwork } from "@/lib/dynamic";
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

            fetch("/api/auth/callback/credentials", {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
              body: `csrfToken=${encodeURIComponent(
                csrfToken,
              )}&token=${encodeURIComponent(authToken ?? "")}`,
            })
              .then((res) => {
                if (res.ok) {
                  getSession();
                  // Handle success - maybe redirect to the home page or user dashboard
                } else {
                  // Handle any errors - maybe show an error message to the user
                  console.error("Failed to log in");
                }
              })
              .catch((error) => {
                // Handle any exceptions
                console.error("Error logging in", error);
              });
          },
        },
      }}
    >
      {children}
    </DynamicContextProvider>
  );
}
