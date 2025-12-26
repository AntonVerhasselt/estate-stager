import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { internal } from "../_generated/api";

/**
 * Record a swipe - ultra-fast mutation (~5ms)
 * No validation - frontend sends valid IDs from Convex queries
 */
export const createSwipe = mutation({
  args: {
    visitId: v.id("visits"),
    styleImageId: v.id("styleImages"),
    direction: v.union(v.literal("like"), v.literal("dislike")),
  },
  handler: async (ctx, args) => {
    // Insert immediately
    const swipeId = await ctx.db.insert("swipes", args);

    // Schedule background profile update
    await ctx.scheduler.runAfter(0, internal.styleProfiles.update.updateProfileAsync, {
      visitId: args.visitId,
    });

    return { swipeId };
  },
});