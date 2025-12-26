import { v } from "convex/values";
import { query } from "../_generated/server";

/**
 * Get the swipe count for a visit
 * Used to show progress in the UI (e.g., "Swipe 12 of 50")
 */
export const getSwipeCount = query({
    args: {
      visitId: v.id("visits"),
    },
    handler: async (ctx, args) => {
      const swipes = await ctx.db
        .query("swipes")
        .withIndex("by_visitId", (q) => q.eq("visitId", args.visitId))
        .collect();
  
      return swipes.length;
    },
  });