import { v } from "convex/values";

import { Id } from "./_generated/dataModel";
import { internalAction, mutation, query } from "./_generated/server";

export const getAvailableMicrolots = query({
  handler: async (ctx) => {
    return await ctx.db.query("microlots").collect();
  },
});

export const listMicrolotsPaginated = query({
  args: {
    page: v.number(),
    limit: v.number(),
  },
  handler: async (ctx, { page, limit }) => {
    const safePage = Math.max(1, page);
    const safeLimit = Math.max(1, Math.min(limit, 100));

    let cursor: string | null = null;
    let current = 1;
    let result = await ctx.db
      .query("microlots")
      .withIndex("by_tokenId")
      .paginate({ numItems: safeLimit, cursor });

    while (current < safePage && !result.isDone) {
      cursor = result.continueCursor;
      result = await ctx.db
        .query("microlots")
        .withIndex("by_tokenId")
        .paginate({ numItems: safeLimit, cursor });
      current += 1;
    }

    const itemsWithUrls = await Promise.all(
      result.page.map(async (m) => {
        const imageUrl = m.image ? await ctx.storage.getUrl(m.image) : null;
        return { ...m, imageUrl };
      }),
    );

    // Compute total using the index (no withFilter)
    const total = (
      await ctx.db.query("microlots").withIndex("by_tokenId").collect()
    ).length;

    return { items: itemsWithUrls, total };
  },
});

export const listOwnMicrolotsPaginated = query({
  args: {
    page: v.number(),
    limit: v.number(),
  },
  handler: async (ctx, { page, limit }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return { items: [], total: 0 };
    }
    const currentUserId = identity.subject as Id<"users">;

    const safePage = Math.max(1, page);
    const safeLimit = Math.max(1, Math.min(limit, 100));

    let cursor: string | null = null;
    let current = 1;
    let result = await ctx.db
      .query("microlots")
      .withIndex("by_producer", (q) => q.eq("producerId", currentUserId))
      .paginate({ numItems: safeLimit, cursor });

    while (current < safePage && !result.isDone) {
      cursor = result.continueCursor;
      result = await ctx.db
        .query("microlots")
        .withIndex("by_producer", (q) => q.eq("producerId", currentUserId))
        .paginate({ numItems: safeLimit, cursor });
      current += 1;
    }

    const itemsWithUrls = await Promise.all(
      result.page.map(async (m) => {
        const imageUrl = m.image ? await ctx.storage.getUrl(m.image) : null;
        return { ...m, imageUrl };
      }),
    );

    const total = (
      await ctx.db
        .query("microlots")
        .withIndex("by_producer", (q) => q.eq("producerId", currentUserId))
        .collect()
    ).length;

    return { items: itemsWithUrls, total };
  },
});

export const createMicrolot = mutation({
  args: {
    microlot: v.object({
      tokenId: v.number(),
      variety: v.string(),
      altitude: v.number(),
      harvestDate: v.string(),
      processingMethod: v.string(),
      description: v.string(),
      family: v.string(),
      estate: v.string(),
      totalSupply: v.number(),
      pricePerTokenEth: v.number(),
      metadataURI: v.string(),
      image: v.optional(v.id("_storage")),
    }),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    console.log("identity", identity);
    if (!identity) {
      throw new Error("Unauthorized");
    }
    const producerId = identity.subject as Id<"users">;
    return await ctx.db.insert("microlots", {
      ...args.microlot,
      producerId,
    });
  },
});

export const listMicrolotsByOthersPaginated = query({
  args: {
    page: v.number(),
    limit: v.number(),
  },
  handler: async (ctx, { page, limit }) => {
    const identity = await ctx.auth.getUserIdentity();
    const currentUserId = identity ? (identity.subject as Id<"users">) : null;
    console.log("currentUserId", currentUserId);

    const safePage = Math.max(1, page);
    const safeLimit = Math.max(1, Math.min(limit, 100));

    const desiredStartIndex = (safePage - 1) * safeLimit;

    let seenNonSelf = 0;
    const collected: Array<{
      _id: Id<"microlots">;
      _creationTime: number;
      tokenId: number;
      producerId: Id<"users">;
      variety: string;
      altitude: number;
      harvestDate: string;
      processingMethod: string;
      description: string;
      family: string;
      estate: string;
      totalSupply: number;
      image?: Id<"_storage">;
      pricePerTokenEth: number;
      metadataURI: string;
    }> = [];

    let cursor: string | null = null;
    let result = await ctx.db
      .query("microlots")
      .withIndex("by_tokenId")
      .paginate({ numItems: safeLimit, cursor });

    while (true) {
      for (const doc of result.page) {
        if (currentUserId && doc.producerId === currentUserId) continue;
        if (seenNonSelf >= desiredStartIndex && collected.length < safeLimit) {
          collected.push(doc);
        }
        seenNonSelf += 1;
        if (collected.length >= safeLimit) break;
      }
      if (collected.length >= safeLimit || result.isDone) break;
      result = await ctx.db
        .query("microlots")
        .withIndex("by_tokenId")
        .paginate({ numItems: safeLimit, cursor: result.continueCursor });
    }

    const itemsWithUrls = await Promise.all(
      collected.map(async (m) => {
        const imageUrl = m.image ? await ctx.storage.getUrl(m.image) : null;
        return { ...m, imageUrl };
      }),
    );

    const totalAll = (
      await ctx.db.query("microlots").withIndex("by_tokenId").collect()
    ).length;
    const totalOwn = currentUserId
      ? (
          await ctx.db
            .query("microlots")
            .withIndex("by_producer", (q) => q.eq("producerId", currentUserId))
            .collect()
        ).length
      : 0;
    const total = totalAll - totalOwn;

    return { items: itemsWithUrls, total };
  },
});
