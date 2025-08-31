import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

export const createUserIfNotExists = mutation({
  args: {
    email: v.string(),
    walletAddress: v.string(),
    role: v.optional(
      v.union(
        v.literal("producer"),
        v.literal("intermediary"),
        v.literal("consumer"),
      ),
    ),
  },
  returns: v.id("users"),
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.email))
      .unique();

    if (existing !== null) {
      return existing._id;
    }

    const userId = await ctx.db.insert("users", {
      email: args.email,
      walletAddress: args.walletAddress,
      role: args.role ?? "consumer",
    });

    return userId;
  },
});

export const getUserIdByEmail = query({
  args: { email: v.string() },
  returns: v.union(v.id("users"), v.null()),
  handler: async (ctx, { email }) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", email))
      .unique();
    return existing ? existing._id : null;
  },
});
