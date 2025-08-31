import { defineTable } from "convex/server";
import { v } from "convex/values";

export const microlotsTable = defineTable({
  tokenId: v.number(),
  producerId: v.id("users"),
  variety: v.string(),
  altitude: v.number(),
  harvestDate: v.string(),
  processingMethod: v.string(),
  description: v.string(),
  family: v.string(),
  estate: v.string(),
  totalSupply: v.number(),
  image: v.optional(v.id("_storage")),
  pricePerTokenEth: v.number(),
  metadataURI: v.string(),
})
  .index("by_tokenId", ["tokenId"])
  .index("by_producer", ["producerId"]);
