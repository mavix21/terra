"use client";

import { useSession } from "next-auth/react";
import { useAccount } from "wagmi";

import SessionData from "./session-data";

export function SessionView() {
  const { data: session } = useSession();
  const { address, isConnected, chain } = useAccount();

  return (
    <div className="space-y-2">
      <SessionData session={session} />
      <div>
        <h2 className="text-xl font-bold">Onchain Data</h2>
        <p>{address ?? "Not Connected"}</p>
        <p>{chain?.name ?? "Not Connected"}</p>
        <p>{isConnected ? "Connected" : "Not Connected"}</p>
      </div>
    </div>
  );
}
