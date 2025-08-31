"use client";

import { ConvexReactClient } from "convex/react";
import { getCsrfToken, getSession, signOut } from "next-auth/react";

import { api } from "@terra/convex/convex/_generated/api";

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
  const convex = new ConvexReactClient(env.NEXT_PUBLIC_CONVEX_URL);

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
          onAuthSuccess: (_event) => {
            void (async () => {
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
                  await getSession();
                  router.replace("/dashboard/overview");
                } else {
                  console.error("Failed to log in");
                }
              } catch (error) {
                console.error("Error logging in", error);
              }
            })();
          },
          onLogout: (_event) => {
            console.log("onLogout", { event: _event });
            void (async () => {
              await signOut({ callbackUrl: "/" });
            })();
          },
        },
        handlers: {
          handleAuthenticatedUser: async (event) => {
            const walletAddress = (event.user.verifiedCredentials.find(
              (credential) => credential.address !== undefined,
            )?.address ?? "0x") as `0x${string}`;

            if (walletAddress !== "0x" && event.user.email !== undefined) {
              try {
                await convex.mutation(api.users.createUserIfNotExists, {
                  email: event.user.email,
                  walletAddress,
                });
              } catch (error) {
                console.error("Failed to ensure user exists", error);
              }
            }
          },
        },
      }}
    >
      {children}
    </DynamicContextProvider>
  );
}
