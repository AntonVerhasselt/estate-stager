import { query } from "../_generated/server";
import { v } from "convex/values";

// List all unconfirmed style images that haven't been deleted
export const listUnconfirmedStyleImages = query({
  handler: async (ctx) => {
    // Verify authentication
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Query all style images where confirmed is false
    const allUnconfirmed = await ctx.db
      .query("styleImages")
      .withIndex("by_confirmed", (q) => q.eq("confirmed", false))
      .collect();

    // Filter out deleted images (deleted !== true)
    return allUnconfirmed.filter((image) => image.deleted !== true);
  },
});

/**
 * Get 5 random confirmed style images that this visit hasn't swiped yet
 */
export const listInitialSwipeImages = query({
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

    // Filter to unswiped, shuffle, take 5
    const unswiped = images.filter((img) => !swipedIds.has(img._id));
    for (let i = unswiped.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [unswiped[i], unswiped[j]] = [unswiped[j], unswiped[i]];
    }

    return unswiped.slice(0, 5);
  },
});

