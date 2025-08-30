import { v } from "convex/values";

import { internalAction, mutation, query } from "./_generated/server";

export const getAvailableMicrolots = query({
  handler: async (ctx) => {
    return await ctx.db.query("microlots").collect();
  },
});

export const createMicrolot = mutation({
  args: {
    microlot: v.object({
      tokenId: v.number(),
      producerId: v.id("producers"),
      variety: v.string(),
      altitude: v.number(),
      harvestDate: v.string(),
      processingMethod: v.string(),
      description: v.string(),
      family: v.string(),
      estate: v.string(),
      totalSupply: v.number(),
      pricePerTokenWei: v.string(),
      metadataURI: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("microlots", args.microlot);
  },
});
