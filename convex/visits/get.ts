import { v } from "convex/values";
import { query } from "../_generated/server";

export const getVisitById = query({
  args: { visitId: v.id("visits") },
  handler: async (ctx, args) => {
    // 1. Verify authentication
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    // 2. Fetch visit by ID
    const visit = await ctx.db.get(args.visitId);
    if (!visit) return null;

    // 3. Fetch related property
    const property = await ctx.db.get(visit.propertyId);
    if (!property) return null;

    // 4. Verify user belongs to property's organization
    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();
    
    if (!currentUser?.organizationIds?.includes(property.organizationId)) {
      return null;
    }

    // 5. Fetch generated images for this visit (where visitId matches)
    const generatedImages = await ctx.db
      .query("images")
      .withIndex("by_visitId", (q) => q.eq("visitId", args.visitId))
      .collect();

    // 6. Get storage URLs for each image
    const imagesWithUrls = await Promise.all(
      generatedImages.map(async (image) => {
        const url = await ctx.storage.getUrl(image.storageId);
        if (!url) return null;
        return {
          _id: image._id,
          _creationTime: image._creationTime,
          roomType: image.roomType,
          imageUrl: url,
        };
      })
    ).then((imgs) => imgs.filter((img): img is NonNullable<typeof img> => img !== null));

    // 7. Return combined visit + property + images data
    return {
      visit: {
        _id: visit._id,
        startAt: visit.startAt,
        prospectName: visit.prospectName,
        phoneNumber: visit.phoneNumber,
        status: visit.status,
        prospectLinkId: visit.prospectLinkId,
        createdAt: visit.createdAt,
      },
      property: {
        _id: property._id,
        address: property.address,
      },
      generatedImages: imagesWithUrls,
    };
  },
});
