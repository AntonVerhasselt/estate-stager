import { v } from "convex/values";
import { mutation } from "../_generated/server";

export const deleteImage = mutation({
  args: {
    imageId: v.id("images"),
  },
  handler: async (ctx, args) => {
    // 1. Verify authentication
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    // 2. Get the image record
    const image = await ctx.db.get(args.imageId);
    if (!image) throw new Error("Image not found");

    // 3. Get the property and verify user belongs to organization
    const property = await ctx.db.get(image.propertyId);
    if (!property) throw new Error("Property not found");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();
    
    if (!currentUser?.organizationIds?.includes(property.organizationId)) {
      throw new Error("Unauthorized");
    }

    // 4. Delete from storage
    await ctx.storage.delete(image.storageId);

    // 5. Delete the image record
    await ctx.db.delete(args.imageId);

    // 6. Update property's images array
    const updatedImages = (property.images ?? []).filter(
      (id) => id !== args.imageId
    );
    await ctx.db.patch(image.propertyId, { images: updatedImages });

    return { success: true };
  },
});
