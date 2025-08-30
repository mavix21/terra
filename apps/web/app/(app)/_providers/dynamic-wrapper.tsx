"use client";

import { getCsrfToken, getSession } from "next-auth/react";

import { env } from "@/env";
import {
  DynamicContextProvider,
  EthereumWalletConnectors,
  getAuthToken,
} from "@/lib/dynamic";

export default function DynamicProvider({ children }: React.PropsWithChildren) {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID,
        walletConnectors: [EthereumWalletConnectors],
        events: {
          onAuthSuccess: async (event) => {
            const authToken = getAuthToken();

            const csrfToken = await getCsrfToken();
            console.log("csrfToken", csrfToken);
            console.log("authToken", authToken);

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
                  console.log("LOGGED IN", res);
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
