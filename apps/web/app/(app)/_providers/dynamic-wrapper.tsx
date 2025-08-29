"use client";

import { env } from "@/env";
import {
  DynamicContextProvider,
  EthereumWalletConnectors,
} from "@/lib/dynamic";

export default function DynamicProvider({ children }: React.PropsWithChildren) {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID,
        walletConnectors: [EthereumWalletConnectors],
      }}
    >
      {children}
    </DynamicContextProvider>
  );
}
