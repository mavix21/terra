import { fetchQuery } from "convex/nextjs";
import { z } from "zod";

import { api } from "@terra/convex/convex/_generated/api";

import type { Product } from "@/shared/data/mock-api";
import { searchParamsCache } from "@/shared/utils/searchparams";

import { ProductTable } from "./product-tables";
import { columns } from "./product-tables/columns";

// Server returns microlot docs plus `imageUrl`
interface Microlot {
  tokenId: number;
  variety: string;
  altitude: number;
  harvestDate: string;
  processingMethod: string;
  description: string;
  family: string;
  estate: string;
  totalSupply: number;
  pricePerTokenEth: number;
  metadataURI: string;
  image?: string | null;
  imageUrl: string | null;
}

export default async function ProductListingPage() {
  // Showcasing the use of search params cache in nested RSCs
  const page = searchParamsCache.get("page");
  // const _search = searchParamsCache.get("name");
  const pageLimit = searchParamsCache.get("perPage");
  // const categories = searchParamsCache.get("category");

  const currentPage = Math.max(1, page);
  const limit = Math.max(1, pageLimit);
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
    await fetchQuery(api.microlots.listMicrolotsPaginated, {
      page: currentPage,
      limit,
    }),
  );

  const products: Product[] = items.map((m: Microlot) => {
    const photoUrl =
      m.imageUrl ??
      `https://api.slingacademy.com/public/sample-products/${m.tokenId}.png`;

    const price = m.pricePerTokenEth;

    const createdAt = m.harvestDate;

    return {
      id: m.tokenId,
      name: m.variety,
      description: m.description,
      created_at: createdAt,
      updated_at: createdAt,
      price,
      // Use a permissive category to keep UI happy; not used semantically here
      category: "active",
      photo_url: photoUrl,
    } satisfies Product;
  });

  const totalProducts = total;

  return (
    <ProductTable
      data={products}
      totalItems={totalProducts}
      columns={columns}
    />
  );
}
