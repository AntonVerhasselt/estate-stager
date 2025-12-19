"use node";

import { internalAction } from "../_generated/server";
import { internal } from "../_generated/api";
import { v } from "convex/values";
import { Id } from "../_generated/dataModel";

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

export const storePropertyImages = internalAction({
  args: {
    propertyId: v.id("properties"),
    images: v.array(
      v.object({
        url: v.string(),
        roomType: roomTypeValidator,
      })
    ),
  },
  handler: async (ctx, args) => {
    const storedImageIds: Id<"images">[] = [];

    for (const image of args.images) {
      try {
        // Fetch the image from the URL
        const response = await fetch(image.url);
        if (!response.ok) {
          console.error(`Failed to fetch image: ${image.url}`);
          continue;
        }

        // Get the image blob
        const blob = await response.blob();

        // Store the image in Convex storage
        const storageId = await ctx.storage.store(blob);

        // Create the image record in the database and collect the returned _id
        const imageId = await ctx.runMutation(internal.images.create.createImageRecord, {
          propertyId: args.propertyId,
          storageId,
          roomType: image.roomType,
        });

        storedImageIds.push(imageId);
      } catch (error) {
        console.error(`Error storing image ${image.url}:`, error);
        // Continue with other images even if one fails
      }
    }

    return {
      storedCount: storedImageIds.length,
      totalCount: args.images.length,
      imageIds: storedImageIds,
    };
  },
});
