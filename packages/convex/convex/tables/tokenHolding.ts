import { defineTable } from "convex/server";
import { v } from "convex/values";

export const tokenHoldingsTable = defineTable({
  userId: v.id("users"),
  microlotId: v.id("microlots"),
  amount: v.number(),
}).index("by_user_and_microlot", ["userId", "microlotId"]);
