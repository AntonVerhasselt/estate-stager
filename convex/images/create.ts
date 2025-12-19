import { internalMutation, mutation } from "../_generated/server";
import { v } from "convex/values";

// Room type validator matching the schema
const roomTypeValidator = v.union(
  v.literal("living-room"),
  v.literal("kitchen"),
  v.literal("bedroom"),
  v.literal("bathroom"),
  v.literal("garden"),
  v.literal("hall"),
  v.literal("desk-area"),
  v.literal("other")
);

// Generate upload URL for client-side file uploads
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    return await ctx.storage.generateUploadUrl();
  },
});

// Add images to an existing property
export const addImagesToProperty = mutation({
  args: {
    propertyId: v.id("properties"),
    images: v.array(
      v.object({
        storageId: v.id("_storage"),
        roomType: roomTypeValidator,
      })
    ),
  },
  handler: async (ctx, args) => {
    // 1. Auth: Get identity
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // 2. Get property and verify it exists
    const property = await ctx.db.get(args.propertyId);
    if (!property) {
      throw new Error("Property not found");
    }

    // 3. Get current user
    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();
    if (!currentUser) {
      throw new Error("User not found");
    }

    // 4. Verify user belongs to property's organization
    if (!currentUser.organizationIds?.includes(property.organizationId)) {
      throw new Error("Not authorized to modify this property");
    }

    // 5. Create image records (inline, not using internal mutation)
    const newImageIds = [];
    for (const image of args.images) {
      const imageId = await ctx.db.insert("images", {
        propertyId: args.propertyId,
        storageId: image.storageId,
        roomType: image.roomType,
      });
      newImageIds.push(imageId);
    }

    // 6. Update property - append new images to existing
    const existingImages = property.images ?? [];
    await ctx.db.patch(args.propertyId, {
      images: [...existingImages, ...newImageIds],
    });

    return { imageIds: newImageIds };
  },
});

// Internal mutation to create image record
export const createImageRecord = internalMutation({
  args: {
    propertyId: v.id("properties"),
    storageId: v.id("_storage"),
    roomType: roomTypeValidator,
  },
  handler: async (ctx, args) => {
    const _id = await ctx.db.insert("images", {
      propertyId: args.propertyId,
      storageId: args.storageId,
      roomType: args.roomType,
    });
    return _id;
  },
});
