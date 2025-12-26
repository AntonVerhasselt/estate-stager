import { internalQuery, query } from "../_generated/server";
import { v } from "convex/values";

// Check if a styleImage with the given unsplashId already exists
export const getByUnsplashId = internalQuery({
  args: {
    unsplashId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("styleImages")
      .withIndex("by_unsplashId", (q) => q.eq("unsplashId", args.unsplashId))
      .first();
  },
});

// Batch check which unsplashIds already exist in the database
export const getExistingUnsplashIds = internalQuery({
  args: {
    unsplashIds: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await Promise.all(
      args.unsplashIds.map((id) =>
        ctx.db
          .query("styleImages")
          .withIndex("by_unsplashId", (q) => q.eq("unsplashId", id))
          .first()
      )
    );
    // Return array of IDs that already exist
    return args.unsplashIds.filter((_, i) => existing[i] !== null);
  },
});

/**
 * Get 1 random confirmed style image that this visit hasn't swiped yet
 */
export const getNextStyleImage = query({
  args: { visitId: v.id("visits") },
  handler: async (ctx, args) => {
    // Get confirmed images
    const images = await ctx.db
      .query("styleImages")
      .withIndex("by_confirmed", (q) => q.eq("confirmed", true))
      .collect();

    // Get already-swiped image IDs
    const swipes = await ctx.db
      .query("swipes")
      .withIndex("by_visitId", (q) => q.eq("visitId", args.visitId))
      .collect();
    const swipedIds = new Set(swipes.map((s) => s.styleImageId));

    // Filter to unswiped
    const unswiped = images.filter((img) => !swipedIds.has(img._id));
    if (unswiped.length === 0) return null;

    // Pick 1 random
    const randomIndex = Math.floor(Math.random() * unswiped.length);
    return unswiped[randomIndex];
  },
});

/**
 * Get total count of available images for progress display
 */
export const getAvailableImageCount = query({
  args: {},
  handler: async (ctx) => {
    const allImages = await ctx.db
      .query("styleImages")
      .withIndex("by_confirmed", (q) => q.eq("confirmed", true))
      .collect();

    return allImages.filter((img) => img.deleted !== true).length;
  },
});