import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { internal } from "../_generated/api";

/**
 * Record a swipe - ultra-fast mutation (~5ms)
 * No validation - frontend sends valid IDs from Convex queries
 * Prevents duplicate swipes for the same image
 */
export const createSwipe = mutation({
  args: {
    visitId: v.id("visits"),
    styleImageId: v.id("styleImages"),
    direction: v.union(v.literal("like"), v.literal("dislike")),
  },
  handler: async (ctx, args) => {
    // Check if this image was already swiped for this visit
    const existingSwipe = await ctx.db
      .query("swipes")
      .withIndex("by_visitId", (q) => q.eq("visitId", args.visitId))
      .filter((q) => q.eq(q.field("styleImageId"), args.styleImageId))
      .first();
    
    // If already swiped, skip creating duplicate
    if (existingSwipe) {
      return { swipeId: existingSwipe._id, duplicate: true };
    }

    // Insert immediately
    const swipeId = await ctx.db.insert("swipes", args);

    // Schedule background profile update
    await ctx.scheduler.runAfter(0, internal.styleProfiles.update.updateProfileAsync, {
      visitId: args.visitId,
    });

    return { swipeId, duplicate: false };
  },
});