import { v } from "convex/values";

import { defineTable } from "convex/server";

export const coffeeShopsTable = defineTable({
  userId: v.id("users"),
  shopName: v.string(),
  location: v.string(),
  menu: v.optional(
    v.array(
      v.object({
        itemName: v.string(),
        price: v.number(),
      }),
    ),
  ),
}).index("by_userId", ["userId"]);
