import { defineTable } from "convex/server";
import { v } from "convex/values";

export const microlotPurchasesTable = defineTable({
  buyerId: v.id("users"),
  sellerId: v.id("users"),
  microlotId: v.id("microlots"),
  amount: v.number(),
  pricePerTokenEth: v.number(),
  totalAmountPaidEth: v.number(),
  // stored as ms timestamp for convenience
  createdAt: v.number(),
})
  .index("by_buyer", ["buyerId"])
  .index("by_seller", ["sellerId"])
  .index("by_microlot", ["microlotId"]);
