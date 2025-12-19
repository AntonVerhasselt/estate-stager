import { internalMutation } from "../_generated/server";
import { v } from "convex/values";

// Internal mutation to update property with image IDs
export const updatePropertyImages = internalMutation({
  args: {
    propertyId: v.id("properties"),
    imageIds: v.array(v.id("images")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.propertyId, {
      images: args.imageIds,
    });
  },
});
