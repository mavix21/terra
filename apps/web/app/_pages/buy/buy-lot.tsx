import { fetchQuery } from "convex/nextjs";
import { z } from "zod";

import { api } from "@terra/convex/convex/_generated/api";

import { auth } from "@/auth";
import { COFFEE_VERIFICATION_CONTRACT_ADDRESS } from "@/lib/constants";
import { searchParamsCache } from "@/shared/utils/searchparams";

import type { BuyRow } from "./buy-table";
import { BuyTable } from "./buy-table";

export async function BuyLot() {
  const session = await auth();
  const page = searchParamsCache.get("page");
  const perPage = searchParamsCache.get("perPage");
  const currentPage = Math.max(1, page);
  const limit = Math.max(1, perPage);

  const MicrolotSchema = z.object({
    tokenId: z.number(),
    variety: z.string(),
    altitude: z.number(),
    harvestDate: z.string(),
    processingMethod: z.string(),
    description: z.string(),
    family: z.string(),
    estate: z.string(),
    totalSupply: z.number(),
    pricePerTokenEth: z.number(),
    metadataURI: z.string(),
    image: z.string().nullable().optional(),
    imageUrl: z.string().nullable(),
  });
  const PaginatedSchema = z.object({
    items: z.array(MicrolotSchema),
    total: z.number(),
  });

  const { items, total } = PaginatedSchema.parse(
    await fetchQuery(
      api.microlots.listMicrolotsByOthersPaginated,
      {
        page: currentPage,
        limit,
      },
      session?.convexToken ? { token: session.convexToken } : undefined,
    ),
  );

  const rows: BuyRow[] = items.map((m) => {
    const photoUrl =
      m.imageUrl ??
      `https://api.slingacademy.com/public/sample-products/${m.tokenId}.png`;
    const tokenLink = `https://sepolia-blockscout.lisk.com/token/${COFFEE_VERIFICATION_CONTRACT_ADDRESS}/instance/${m.tokenId}`;
    return {
      id: m.tokenId,
      name: m.variety,
      description: m.description,
      price: m.pricePerTokenEth,
      category: "active",
      photo_url: photoUrl,
      token_link: tokenLink,
    } satisfies BuyRow;
  });

  return <BuyTable rows={rows} total={total} />;
}
