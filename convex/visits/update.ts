import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const cancelVisit = mutation({
  args: { visitId: v.id("visits") },
  handler: async (ctx, args) => {
    // 1. Verify authentication
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // 2. Get visit by ID
    const visit = await ctx.db.get(args.visitId);
    if (!visit) {
      throw new Error("Visit not found");
    }

    // 3. Get property by ID
    const property = await ctx.db.get(visit.propertyId);
    if (!property) {
      throw new Error("Property not found");
    }

    // 4. Verify user belongs to property's organization
    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();
    
    if (!currentUser) {
      throw new Error("User not found");
    }

    if (!currentUser.organizationIds?.includes(property.organizationId)) {
      throw new Error("Unauthorized");
    }

    // 5. Update visit status to cancelled
    await ctx.db.patch(args.visitId, {
      status: "cancelled",
    });

    return { success: true };
  },
});

export const updateVisit = mutation({
  args: {
    visitId: v.id("visits"),
    prospectName: v.string(),
    phoneNumber: v.string(), // Full phone number with country code
    startAt: v.number(), // Unix timestamp in milliseconds
  },
  handler: async (ctx, args) => {
    // 1. Verify authentication
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // 2. Get visit by ID
    const visit = await ctx.db.get(args.visitId);
    if (!visit) {
      throw new Error("Visit not found");
    }

    // 3. Get property by ID
    const property = await ctx.db.get(visit.propertyId);
    if (!property) {
      throw new Error("Property not found");
    }

    // 4. Verify user belongs to property's organization
    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();
    
    if (!currentUser) {
      throw new Error("User not found");
    }

    if (!currentUser.organizationIds?.includes(property.organizationId)) {
      throw new Error("Unauthorized");
    }

    // 5. Update visit fields
    await ctx.db.patch(args.visitId, {
      prospectName: args.prospectName,
      phoneNumber: args.phoneNumber,
      startAt: args.startAt,
    });

    return { success: true };
  },
});
