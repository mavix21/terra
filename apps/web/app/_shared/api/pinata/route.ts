"use server";

import { pinata } from "@/lib/pinata.config";

export async function uploadCoffeeVerificationJSON(
  name: string,
  variety: string,
  altitude: number,
  harvestDate: string,
  processingMethod: string,
) {
  try {
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
        image: "https://example.com",
      })
      .name(name);

    return upload;
  } catch (e) {
    console.log(e);
  }
}
