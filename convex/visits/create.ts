import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { nanoid } from "nanoid";

export const createVisit = mutation({
  args: {
    propertyId: v.id("properties"),
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
    
    if (!currentUser) {
      throw new Error("User not found");
    }

    if (!currentUser.organizationIds?.includes(property.organizationId)) {
      throw new Error("Unauthorized");
    }

    // 4. Generate short unique prospectLinkId (<10 chars)
    const prospectLinkId = nanoid(10);

    // 5. Insert visit with status "planned" and current timestamp
    const visitId = await ctx.db.insert("visits", {
      propertyId: args.propertyId,
      startAt: args.startAt,
      prospectName: args.prospectName,
      phoneNumber: args.phoneNumber,
      status: "planned",
      prospectLinkId,
      createdAt: Date.now(),
    });

    return { visitId };
  },
});
