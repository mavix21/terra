"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cookieToInitialState, WagmiProvider } from "wagmi";

import { wagmiConfig } from "@/lib/wagmi";

import DynamicProvider from "./dynamic-wrapper";

interface Props {
  children: React.ReactNode;
  cookie: string | null;
}

const queryClient = new QueryClient();

export function OnchainProviders({ children, cookie }: Props) {
  const initialState = cookieToInitialState(wagmiConfig, cookie);

  return (
    <DynamicProvider>
      <WagmiProvider config={wagmiConfig} initialState={initialState}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </WagmiProvider>
    </DynamicProvider>
  );
}
