import { v } from "convex/values";
import { query } from "../_generated/server";

export const getPropertyById = query({
  args: { propertyId: v.id("properties") },
  handler: async (ctx, args) => {
    // 1. Verify authentication
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    // 2. Get property by ID
    const property = await ctx.db.get(args.propertyId);
    if (!property) return null;

    // 3. Verify user belongs to property's organization
    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();
    if (!currentUser?.organizationIds?.includes(property.organizationId)) {
      return null;
    }

    // 4. Get all images with storage URLs
    const images = await Promise.all(
      (property.images ?? []).map(async (imageId) => {
        const image = await ctx.db.get(imageId);
        if (!image) return null;
        const url = await ctx.storage.getUrl(image.storageId);
        return { ...image, imageUrl: url };
      })
    ).then((imgs) => imgs.filter((img): img is NonNullable<typeof img> => img !== null));

    // 5. Get visits for this property
    const visits = await ctx.db
      .query("visits")
      .withIndex("by_propertyId", (q) => q.eq("propertyId", args.propertyId))
      .collect();

    return {
      ...property,
      images,
      visits,
    };
  },
});
