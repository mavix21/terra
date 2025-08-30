"use server";

import { pinata } from "@/lib/pinata.config";

export async function uploadEventImgJSON(name: string, imageUrl: string) {
  try {
    const upload = await pinata.upload.public
      .json({
        name,
        description: "Event On-Chain",
        attributes: [
          {
            trait_type: "name",
            value: name,
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
