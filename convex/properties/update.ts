import { v } from "convex/values";
import { mutation } from "../_generated/server";

export const setStatusToSold = mutation({
  args: { propertyId: v.id("properties") },
  handler: async (ctx, args) => {
    // 1. Verify authentication
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // 2. Get property by ID
    const property = await ctx.db.get(args.propertyId);
    if (!property) {
      throw new Error("Property not found");
    }

    // 3. Verify user belongs to property's organization
    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();
    if (!currentUser?.organizationIds?.includes(property.organizationId)) {
      throw new Error("Unauthorized");
    }

    // 4. Update status to sold
    await ctx.db.patch(args.propertyId, {
      status: "sold",
    });

    return { success: true };
  },
});
