import { defineTable } from "convex/server";
import { v } from "convex/values";

export const buyerVerificationTable = defineTable({
  userId: v.id("users"),
  businessName: v.string(),
  taxId: v.string(),
  licenseId: v.string(),
  certifications: v.array(v.string()),
  contactEmail: v.string(),
  contactPhone: v.optional(v.string()),
  addressLine1: v.string(),
  addressLine2: v.optional(v.string()),
  city: v.string(),
  state: v.string(),
  country: v.string(),
  postalCode: v.string(),
  // simple status flag to gate access to other features in UI
  isVerified: v.boolean(),
}).index("by_userId", ["userId"]);
