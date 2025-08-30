import { defineTable } from "convex/server";
import { v } from "convex/values";

export const purchasesTable = defineTable({
  consumerId: v.id("users"),
  coffeeShopId: v.id("coffeeShops"),
  totalAmountPaid: v.number(),
  tokenizedAmount: v.number(),
  microlotTokenizedId: v.id("microlots"),
  tokensReceived: v.number(),
  rewardIssued: v.optional(v.string()),
})
  .index("by_consumer", ["consumerId"])
  .index("by_coffeeShop", ["coffeeShopId"]);
