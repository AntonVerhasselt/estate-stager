import { query } from "../_generated/server";

export const listProperties = query({
  handler: async (ctx) => {
    // Get authenticated user identity
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    // Get current user from database using Clerk ID
    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!currentUser) {
      return [];
    }

    // Get the first organization ID from user's organizationIds array
    const userOrgIds = currentUser.organizationIds;
    if (!userOrgIds || userOrgIds.length === 0) {
      return [];
    }

    // Get the organization document from the database
    const organization = await ctx.db.get(userOrgIds[0]);
    if (!organization) {
      return [];
    }

    // Query properties by organizationId
    const properties = await ctx.db
      .query("properties")
      .withIndex("by_organizationId", (q) =>
        q.eq("organizationId", organization._id)
      )
      .collect();

    // For each property, get the first image URL
    const propertiesWithImages = await Promise.all(
      properties.map(async (property) => {
        let imageUrl: string | null = null;

        // Get the first image if it exists
        if (property.images && property.images.length > 0) {
          const firstImageId = property.images[0];
          const image = await ctx.db.get(firstImageId);

          if (image && image.storageId) {
            // Get the storage URL for the image
            imageUrl = await ctx.storage.getUrl(image.storageId);
          }
        }

        return {
          _id: property._id,
          address: property.address,
          status: property.status,
          imageUrl,
        };
      })
    );

    return propertiesWithImages;
  },
});
