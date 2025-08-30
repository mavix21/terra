import { defineTable } from "convex/server";
import { v } from "convex/values";

export const usersTable = defineTable({
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
}).index("by_walletAddress", ["walletAddress"]);
