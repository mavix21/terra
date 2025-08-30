import { defineTable } from "convex/server";
import { v } from "convex/values";

export const producersTable = defineTable({
  userId: v.id("users"),
  farmName: v.string(),
  country: v.optional(v.string()),
  bio: v.optional(v.string()),
}).index("by_userId", ["userId"]);
