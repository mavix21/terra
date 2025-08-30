import { v } from "convex/values";

import { mutation } from "./_generated/server";

export const createUserIfNotExists = mutation({
  args: {
    email: v.string(),
    walletAddress: v.string(),
  },
  returns: v.id("users"),
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.walletAddress))
      .unique();

    if (existing !== null) {
      return existing._id;
    }

    const userId = await ctx.db.insert("users", {
      email: args.email,
      walletAddress: args.walletAddress,
      role: "producer",
    });

    return userId;
  },
});
