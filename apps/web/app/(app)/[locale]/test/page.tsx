"use client";

import { useQuery } from "convex/react";
import { useWriteContract } from "wagmi";

import { api } from "@terra/convex/convex/_generated/api";
import { Button } from "@terra/ui/components/button";

import { uploadCoffeeVerificationJSON } from "@/app/_shared/api/pinata/route";
import { abi } from "@/lib/abi";
import { COFFEE_VERIFICATION_CONTRACT_ADDRESS } from "@/lib/constants";

export default function TestPage() {
  const microlots = useQuery(api.microlots.getAvailableMicrolots);

  const { isPending, writeContract } = useWriteContract({
    mutation: {
      onSuccess: () => {
        console.log("success");
      },
      onError: (error) => {
        console.log(error);
      },
    },
  });

  const handleMint = async ({
    name,
    variety,
    altitude,
    harvestDate,
    processingMethod,
    totalSupply,
    pricePerTokenWei,
  }: {
    name: string;
    variety: string;
    altitude: number;
    harvestDate: string;
    processingMethod: string;
    totalSupply: number;
    pricePerTokenWei: number;
  }) => {
    const coffeeVerification = await uploadCoffeeVerificationJSON(
      name,
      variety,
      altitude,
      harvestDate,
      processingMethod,
    );
    writeContract({
      address: COFFEE_VERIFICATION_CONTRACT_ADDRESS as `0x${string}`,
      abi: abi,
      functionName: "listCoffee",
      args: [
        BigInt(totalSupply),
        `https://rose-gentle-toucan-395.mypinata.cloud/ipfs/${coffeeVerification?.cid}`,
        BigInt(pricePerTokenWei),
      ],
    });
  };

  return (
    <div>
      <Button
        onClick={() =>
          handleMint({
            name: "Café 1",
            variety: "Arabica",
            altitude: 1000,
            harvestDate: "2021-01-01",
            processingMethod: "Washed",
            totalSupply: 100,
            pricePerTokenWei: 1000000000000000000,
          })
        }
      >
        Crear café
      </Button>
    </div>
  );
}
