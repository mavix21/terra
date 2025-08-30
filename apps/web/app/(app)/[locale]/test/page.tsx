"use client";

import { useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { parseEventLogs } from "viem";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

import type { Id } from "@terra/convex/convex/_generated/dataModel";
import { api } from "@terra/convex/convex/_generated/api";
import { Button } from "@terra/ui/components/button";

import { uploadCoffeeVerificationJSON } from "@/app/_shared/api/pinata/route";
import { abi } from "@/lib/abi";
import { COFFEE_VERIFICATION_CONTRACT_ADDRESS } from "@/lib/constants";

export default function TestPage() {
  const createMicrolot = useMutation(api.microlots.createMicrolot);
  const {
    data: hash,
    isPending,
    writeContract,
  } = useWriteContract({
    mutation: {
      onSuccess: () => {
        console.log("success");
      },
      onError: (error) => {
        console.log(error);
      },
    },
  });

  const {
    isLoading: isConfirming,
    isSuccess,
    data,
  } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isSuccess) {
      for (const log of data.logs) {
        const events = parseEventLogs({
          abi,
          logs: [log],
        });
        for (const event of events) {
          if (event.eventName === "CoffeeListed") {
            const { tokenId } = event.args;
            console.log(tokenId);
            createMicrolot({
              microlot: {
                tokenId: Number(tokenId),
                producerId:
                  "k171efgpr9hzaz83ssj263e0fs7pmh77" as Id<"producers">,
                variety: "Arabica",
                altitude: 1000,
                harvestDate: "2021-01-01",
                processingMethod: "Washed",
                description: "Description",
                family: "Family",
                estate: "Estate",
                totalSupply: 100,
                pricePerTokenWei: "1000000000000000000",
                metadataURI: `https://rose-gentle-toucan-395.mypinata.cloud/ipfs/ejemplo`,
              },
            })
              .then(() => console.log("Minted"))
              .catch((error) => console.error(error));
            return;
          }
        }
      }
    }
  }, [isSuccess, data]);

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

  // const handleBuy = async ({
  // })

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
      {/* <Button onClick={() => handleBuy()}> */}
      <Button onClick={() => console.log("buy")}>
        Comprar tokens café (2 tokens)
      </Button>
    </div>
  );
}
