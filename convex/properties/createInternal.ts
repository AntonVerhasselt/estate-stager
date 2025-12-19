import { internalMutation } from "../_generated/server";
import { v } from "convex/values";

// Internal mutation to insert property into database
export const insertProperty = internalMutation({
  args: {
    address: v.string(),
    sourceUrl: v.optional(v.string()),
    organizationId: v.id("organizations"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const propertyId = await ctx.db.insert("properties", {
      address: args.address,
      status: "available",
      organizationId: args.organizationId,
      userId: args.userId,
      sourceUrl: args.sourceUrl,
      images: [], // Start with empty array, will be updated after storing images
    });
    return propertyId;
  },
});
