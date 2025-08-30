import { defineTable } from "convex/server";
import { v } from "convex/values";

export const microlotsTable = defineTable({
  tokenId: v.number(),
  producerId: v.id("producers"),
  variety: v.string(),
  altitude: v.number(),
  harvestDate: v.string(),
  processingMethod: v.string(),
  totalSupply: v.number(),
  pricePerTokenWei: v.string(),
  metadataURI: v.string(),
})
  .index("by_tokenId", ["tokenId"])
  .index("by_producer", ["producerId"]);
