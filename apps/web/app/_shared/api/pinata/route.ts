"use server";

import { fetchQuery } from "convex/nextjs";

import type { Id } from "@terra/convex/convex/_generated/dataModel";
import { api } from "@terra/convex/convex/_generated/api";

import { pinata } from "@/lib/pinata.config";

export async function uploadCoffeeVerificationJSON(
  name: string,
  variety: string,
  altitude: number,
  harvestDate: string,
  processingMethod: string,
  imageStorageId?: Id<"_storage">,
) {
  try {
    let imageUrl =
      "https://rose-gentle-toucan-395.mypinata.cloud/ipfs/bafybeibmwwr5ftobi7fni53r7gta5ss3xbuxeg6wwyuiyj5gmjpdbytrse";

    if (imageStorageId) {
      try {
        const resolvedUrl = await fetchQuery(api.storage.getUrl, {
          storageId: imageStorageId,
        });
        console.log("resolvedUrl", resolvedUrl);
        if (typeof resolvedUrl === "string" && resolvedUrl.length > 0) {
          imageUrl = resolvedUrl;
        }
      } catch (err) {
        console.log(
          "Failed to resolve Convex storage URL, using fallback",
          err,
        );
      }
    }

    const upload = await pinata.upload.public
      .json({
        name,
        description: "Coffee Verification On-Chain",
        attributes: [
          {
            trait_type: "variety",
            value: variety,
          },
          {
            trait_type: "altitude",
            value: altitude,
          },
          {
            trait_type: "harvestDate",
            value: harvestDate,
          },
          {
            trait_type: "processingMethod",
            value: processingMethod,
          },
        ],
        image: imageUrl,
      })
      .name(name);

    return upload;
  } catch (e) {
    console.log(e);
  }
}
