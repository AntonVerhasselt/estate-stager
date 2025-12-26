"use node";

import { action } from "../_generated/server";
import { internal } from "../_generated/api";
import { v } from "convex/values";
import { Id } from "../_generated/dataModel";

// Room type validator matching the schema
const roomTypeValidator = v.union(
  v.literal("livingRoom"),
  v.literal("kitchen"),
  v.literal("bedroom"),
  v.literal("bathroom"),
  v.literal("garden"),
  v.literal("hall"),
  v.literal("deskArea"),
  v.literal("other")
);

// Main action to create a property with images
export const createProperty = action({
  args: {
    address: v.string(),
    sourceUrl: v.optional(v.string()),
    images: v.array(
      v.object({
        url: v.string(),
        roomType: roomTypeValidator,
      })
    ),
    userId: v.id("users"),
  },
  handler: async (ctx, args): Promise<{
    propertyId: Id<"properties">;
  }> => {
    // Get authenticated user identity
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const organization = await ctx.runQuery(internal.organizations.get.getOrganization);

    if (!organization) {
      throw new Error("Organization not found");
    }

    // Check if the args.userId is a user for this organization
    const isUserInOrg = organization.users.includes(args.userId);
    if (!isUserInOrg) {
      throw new Error("Selected user does not belong to this organization");
    }

    // Create the property with empty images array
    const propertyId: Id<"properties"> = await ctx.runMutation(
      internal.properties.createInternal.insertProperty,
      {
        address: args.address,
        sourceUrl: args.sourceUrl,
        organizationId: organization._id,
        userId: args.userId,
      }
    );

    // Store images and create image records
    const imageResult: {
      storedCount: number;
      totalCount: number;
      imageIds: Id<"images">[];
    } = await ctx.runAction(internal.images.store.storePropertyImages, {
      propertyId,
      images: args.images,
    });

    // Update property with the image IDs
    if (imageResult.imageIds.length > 0) {
      await ctx.runMutation(internal.properties.updateInternal.updatePropertyImages, {
        propertyId,
        imageIds: imageResult.imageIds,
      });
    }

    return {
      propertyId
    };
  },
});
