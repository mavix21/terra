import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

import { authTables } from "./authTables";

export default defineSchema({
  ...authTables,

  // --- TABLA DE USUARIOS ---
  users: defineTable({
    walletAddress: v.string(),

    // --- CORRECCIÓN AQUÍ ---
    // Usamos v.union() para permitir uno de los tres valores literales.
    role: v.union(
      v.literal("producer"),
      v.literal("intermediary"),
      v.literal("consumer"),
    ),

    name: v.optional(v.string()),
    profileImageUrl: v.optional(v.string()),
  }).index("by_walletAddress", ["walletAddress"]),

  // --- TABLA DE PRODUCTORES ---
  producers: defineTable({
    userId: v.id("users"),
    farmName: v.string(),
    country: v.optional(v.string()),
    bio: v.optional(v.string()),
  }).index("by_userId", ["userId"]),

  // --- TABLA DE CAFETERÍAS (Intermediarios) ---
  coffeeShops: defineTable({
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
  }).index("by_userId", ["userId"]),

  // --- TABLA DE MICROLOTES (El activo On-Chain) ---
  microlots: defineTable({
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
    .index("by_producer", ["producerId"]),

  // --- TABLA DE POSESIÓN DE TOKENS ---
  tokenHoldings: defineTable({
    userId: v.id("users"),
    microlotId: v.id("microlots"),
    amount: v.number(),
  }).index("by_user_and_microlot", ["userId", "microlotId"]),

  // --- TABLA DE COMPRAS ---
  purchases: defineTable({
    consumerId: v.id("users"),
    coffeeShopId: v.id("coffeeShops"),
    totalAmountPaid: v.number(),
    tokenizedAmount: v.number(),
    microlotTokenizedId: v.id("microlots"),
    tokensReceived: v.number(),
    rewardIssued: v.optional(v.string()),
  })
    .index("by_consumer", ["consumerId"])
    .index("by_coffeeShop", ["coffeeShopId"]),
});
